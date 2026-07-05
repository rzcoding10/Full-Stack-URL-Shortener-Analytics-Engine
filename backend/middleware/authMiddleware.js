const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- STRICT SHIELD (For dashboard & account deletion) ---
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token || token === 'none') {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object
        req.user = await User.findById(decoded.id).select('-password');
        
        // 🎯 THE FIX: Reject if token is valid but user was deleted
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

// --- OPTIONAL SHIELD (For link creation) ---
exports.optionalAuth = async (req, res, next) => {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // If no token exists, just move to the next function (guest mode)
    if (!token || token === 'none') {
        return next();
    }

    try {
        // If a token exists, verify it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foundUser = await User.findById(decoded.id).select('-password');
        
        // 🎯 THE FIX: Only attach the user if they still exist in the database
        if (foundUser) {
            req.user = foundUser;
        }
        
        next();
    } catch (error) {
        // If the token is expired or user is deleted, ignore it and treat them as a guest
        next();
    }
};