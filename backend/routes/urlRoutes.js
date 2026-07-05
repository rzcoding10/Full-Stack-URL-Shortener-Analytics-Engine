const express = require('express');
const router = express.Router();
const { 
    createShortLink, 
    redirectUrl, 
    getUserLinks,
    getAnalytics
} = require('../controllers/urlController');

// Middlewares
const { apiLimiter } = require('../middleware/rateLimiter');
const { protect, optionalAuth } = require('../middleware/authMiddleware'); // Import optionalAuth

// Route 1: Create a new short link
// optionalAuth checks for a user, apiLimiter prevents spam, createShortLink saves it
router.post('/shorten', optionalAuth, apiLimiter, createShortLink);

// Route 2: Get all links for the logged-in user
// protect STRICTLY requires a logged-in user
router.get('/my-links', protect, getUserLinks); 

// Route 3: Get detailed analytics for a specific link
// Must be placed before /:hash to ensure the router doesn't treat 'analytics' as a hash
router.get('/:hash/analytics', protect, getAnalytics);

// Route 3: Redirect to the original URL
router.get('/:hash', redirectUrl);

module.exports = router;