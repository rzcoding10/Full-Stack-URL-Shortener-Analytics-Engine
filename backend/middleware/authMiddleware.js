const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check for token in cookies
    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token || token === 'none') {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object (excluding the password)
        req.user = await User.findById(decoded.id).select('-password');
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};