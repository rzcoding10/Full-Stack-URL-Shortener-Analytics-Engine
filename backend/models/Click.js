const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
        required: true,
        index: true
    },
    ipAddress: {
        type: String
    },
    browser: {
        type: String,
        default: 'Unknown'
    },
    os: {
        type: String,
        default: 'Unknown'
    },
    device: {
        type: String,
        default: 'desktop'
    },
    referrer: {
        type: String,
        default: 'Direct'
    },
    clickedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('Click', clickSchema);