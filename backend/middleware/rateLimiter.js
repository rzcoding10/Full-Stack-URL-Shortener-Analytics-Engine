const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { 
        success: false, 
        message: 'Too many URLs generated. Please wait a minute and try again.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter };