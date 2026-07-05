// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // If the error already has a status code (like 400), use it. Otherwise, default to 500.
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message,
        // Only show the stack trace if we are in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };