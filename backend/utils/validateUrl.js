// utils/validateUrl.js

const isValidUrl = (urlString) => {
    try {
        const parsedUrl = new URL(urlString);
        // Ensure the URL is strictly HTTP or HTTPS (blocks ftp:// or malicious protocols)
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch (err) {
        // If new URL() throws an error, the string is not a valid URL
        return false;
    }
};

module.exports = { isValidUrl };