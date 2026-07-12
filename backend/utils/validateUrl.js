
const isValidUrl = (urlString) => {
    try {
        const parsedUrl = new URL(urlString);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch (err) {
        return false;
    }
};

module.exports = { isValidUrl };