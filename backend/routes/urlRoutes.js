const express = require('express');
const router = express.Router();
const { 
    createShortLink, 
    redirectUrl, 
    getUserLinks,
    getAnalytics
} = require('../controllers/urlController');

const { apiLimiter } = require('../middleware/rateLimiter');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/shorten', optionalAuth, apiLimiter, createShortLink);

router.get('/my-links', protect, getUserLinks); 

router.get('/:hash/analytics', protect, getAnalytics);

router.get('/:hash', redirectUrl);

module.exports = router;