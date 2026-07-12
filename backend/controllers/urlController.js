const asyncHandler = require('express-async-handler');
const Link = require('../models/Link.js');
const { isValidUrl } = require('../utils/validateUrl');

const { createUniqueLink } = require('../services/urlService');
const { trackClick, getLinkMetrics } = require('../services/analyticsService');

// --- 1. CREATE A SHORT URL ---
exports.createShortLink = asyncHandler(async (req, res) => {
    const { originalUrl } = req.body;
    
    if (!originalUrl || !isValidUrl(originalUrl)) {
        res.status(400);
        throw new Error('Please provide a valid URL starting with http:// or https://');
    }

    const userId = req.user ? req.user._id : null;

    const newLink = await createUniqueLink(originalUrl, userId);
    const fullShortUrl =`${req.protocol}://${req.get("host")}/api/url/${newLink.shortUrl}`;

    res.status(201).json({
        success: true,
        data: {
            originalUrl: newLink.originalUrl,
            shortUrl: fullShortUrl,
            hash: newLink.shortUrl
        }
    });
});

// --- 2. REDIRECT TO ORIGINAL URL & TRACK CLICK ---
exports.redirectUrl = asyncHandler(async (req, res) => {
    const { hash } = req.params;
    const link = await Link.findOne({ shortUrl: hash });

    if (!link) {
        return res.redirect(`${req.protocol}://${req.get("host")}/not-found`);
    }

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        res.status(410);
        throw new Error('This link has expired');
    }

    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referer || req.headers.referrer;

    await trackClick(link._id, req.ip, userAgent, referrer);

    return res.redirect(link.originalUrl);
});

// --- 3. GET USER'S DASHBOARD URLS ---
exports.getUserLinks = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Unauthorized');
    }

    const links = await Link.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: links.length,
        data: links
    });
});

// --- 4. GET LINK ANALYTICS ---
exports.getAnalytics = asyncHandler(async (req, res) => {
    const { hash } = req.params;
    
    const link = await Link.findOne({ shortUrl: hash });
    
    if (!link) {
        res.status(404);
        throw new Error('Link not found');
    }

    if (!req.user || link.userId?.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view these analytics');
    }

    const metrics = await getLinkMetrics(link._id);

    res.status(200).json({
        success: true,
        data: {
            totalClicks: link.totalClicks,
            lastVisited: link.lastVisited,
            metrics
        }
    });
});