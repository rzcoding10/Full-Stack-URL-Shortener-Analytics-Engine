const User = require('../models/User');
const Link = require('../models/Link.js');
const Click = require('../models/Click');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- HELPER: Generate JWT & Set Cookie ---
const sendTokenResponse = (user, statusCode, res, message) => {
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'strict'
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message,
        user: { email: user.email, id: user._id }
    });
};

// --- 1. REGISTER USER ---
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        sendTokenResponse(user, 201, res, 'User created successfully');
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 2. LOGIN USER ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res, 'Logged in successfully');
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 3. LOGOUT USER ---
exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'User logged out' });
};

// --- 4. GET PROFILE ---
exports.getProfile = async (req, res) => {
    // req.user is supplied by our auth middleware
    res.status(200).json({ success: true, user: req.user });
};

// --- 5. DELETE ACCOUNT (Clean & Efficient) ---
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find all links owned by this user
        const userLinks = await Link.find({ userId });
        const linkIds = userLinks.map(link => link._id);

        // 2. Delete all clicks associated with those links (Efficiency upgrade)
        await Click.deleteMany({ linkId: { $in: linkIds } });

        // 3. Delete all the links
        await Link.deleteMany({ userId });

        // 4. Delete the user
        await User.findByIdAndDelete(userId);

        // 5. Clear the cookie
        res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });

        res.status(200).json({ success: true, message: 'Account and all associated data deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};