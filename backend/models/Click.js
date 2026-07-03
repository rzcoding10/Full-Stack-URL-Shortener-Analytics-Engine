const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
        required: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    clickedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Click', clickSchema);