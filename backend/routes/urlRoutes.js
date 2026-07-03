const express = require('express');
const router = express.Router();
const { 
    createShortLink, 
    redirectUrl, 
    getUserLinks 
} = require('../controllers/urlController');

// We will build this middleware next, but we declare it here
const { protect } = require('../middleware/authMiddleware');

// Route 1: Create a new short link (POST /api/url/shorten)
router.post('/shorten', createShortLink);

// Route 2: Get all links for the logged-in user (GET /api/url/my-links)
// router.get('/my-links', protect, getUserLinks); // Commented out until auth is built

// Route 3: Redirect to the original URL (GET /api/url/:hash)
// Note: We'll eventually move this to the root of your server so links look like "yoursite.com/Abc1234"
router.get('/:hash', redirectUrl);

module.exports = router;