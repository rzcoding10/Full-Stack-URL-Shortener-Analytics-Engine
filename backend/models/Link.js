const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: [true, 'Please provide an original URL']
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true // unique: true automatically creates an index in MongoDB
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true // 🎯 Fast lookups for dashboard queries
    },
    totalClicks: {
        type: Number,
        default: 0
    },
    lastVisited: {
        type: Date,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true // 🎯 Fast sorting by creation date
    }
});

module.exports = mongoose.model('Link', linkSchema);