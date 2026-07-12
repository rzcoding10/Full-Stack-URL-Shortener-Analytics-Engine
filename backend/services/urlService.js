const Link = require('../models/Link');
const { generateShortCode } = require('../utils/base62');

exports.createUniqueLink = async (originalUrl, userId) => {
    let hash = generateShortCode();
    let hashExists = await Link.findOne({ shortUrl: hash });

    while (hashExists) {
        hash = generateShortCode();
        hashExists = await Link.findOne({ shortUrl: hash });
    }

    const newLink = await Link.create({
        originalUrl,
        shortUrl: hash,
        userId
    });

    return newLink;
};