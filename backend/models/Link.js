const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: [true, 'Please provide an original URL']
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Null means it was created anonymously
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Link', linkSchema);