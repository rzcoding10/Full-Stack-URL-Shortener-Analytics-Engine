const Link = require('../models/Link.js');
const Click = require('../models/Click');
const User = require('../models/User');

// --- HELPER FUNCTION: Generate a random 7-character string ---
const generateHash = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// --- 1. CREATE A SHORT URL ---
exports.createShortLink = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        
        if (!originalUrl) {
            return res.status(400).json({ success: false, message: 'Please provide an original URL' });
        }

        // Keep generating a hash until we find a unique one
        let hash = generateHash();
        let hashExists = await Link.findOne({ shortUrl: hash });
        while (hashExists) {
            hash = generateHash();
            hashExists = await Link.findOne({ shortUrl: hash });
        }

        // Determine if user is logged in (from auth middleware, which we'll build later)
        const userId = req.user ? req.user._id : null;

        const newLink = await Link.create({
            originalUrl,
            shortUrl: hash,
            userId
        });

        const fullShortUrl = `${req.protocol}://${req.get("host")}/${hash}`;

        res.status(201).json({
            success: true,
            data: {
                originalUrl: newLink.originalUrl,
                shortUrl: fullShortUrl,
                hash: newLink.shortUrl
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 2. REDIRECT TO ORIGINAL URL & TRACK CLICK ---
exports.redirectUrl = async (req, res) => {
    try {
        const { hash } = req.params;
        const link = await Link.findOne({ shortUrl: hash });

        if (!link) {
            // Redirect to a 404 page on your frontend (we will configure this later)
            return res.redirect(`${req.protocol}://${req.get("host")}/not-found`);
        }

        // Track the click for analytics
        await Click.create({
            linkId: link._id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        // Redirect the user
        return res.redirect(link.originalUrl);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during redirection' });
    }
};

// --- 3. GET USER'S DASHBOARD URLS ---
exports.getUserLinks = async (req, res) => {
    try {
        // req.user will be populated by your auth middleware
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const links = await Link.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: links.length,
            data: links
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};