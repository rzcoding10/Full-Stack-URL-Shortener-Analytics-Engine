const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Link = require('../models/Link.js');
const Click = require('../models/Click');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- HELPER: Generate JWT & Set Cookie ---
const sendTokenResponse = (user, statusCode, res, message) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message,
        user: { email: user.email, id: user._id }
    });
};

// --- 1. REGISTER USER ---
exports.register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password');
    }
    if (password.length < 8) {
        res.status(400);
        throw new Error('Password must be at least 8 characters');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    sendTokenResponse(user, 201, res, 'User created successfully');
});

// --- 2. LOGIN USER ---
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
});

// --- 3. LOGOUT USER ---
exports.logout = asyncHandler(async (req, res) => {
    const options = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.cookie('token', 'none', options);
    res.status(200).json({ success: true, message: 'User logged out' });
});

// --- 4. GET PROFILE ---
exports.getProfile = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

// --- 5. DELETE ACCOUNT (Clean & Efficient) ---
exports.deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const userLinks = await Link.find({ userId });
    const linkIds = userLinks.map(link => link._id);

    await Click.deleteMany({ linkId: { $in: linkIds } });
    await Link.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    // Use the exact same cookie options to ensure the browser deletes it
    const options = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };
    
    res.cookie('token', 'none', options);

    res.status(200).json({ success: true, message: 'Account and all associated data deleted' });
});