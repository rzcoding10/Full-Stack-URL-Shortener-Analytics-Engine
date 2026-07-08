const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // 1. Import Helmet
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- 1. MIDDLEWARE ---
app.use(helmet());
app.use(cors({origin: process.env.CLIENT_URL,credentials: true,}));
app.use(express.json()); // Replaces body-parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- 2. HEALTH CHECK ---
app.get('/api/test', (req, res) => {
    res.status(200).json({ status: "success", message: "API is operational!" });
});

// --- 3. ROUTES (We will build and import these next) ---
app.use('/api/url', require('./routes/urlRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));

// --- 4. GLOBAL ERROR HANDLER ---
// Must be placed AFTER all routes
app.use(errorHandler);

// --- 5. FRONTEND SERVING (For Production) ---
// Uncomment this later if deploying React and Node together
// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

module.exports = app;