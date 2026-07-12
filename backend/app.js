const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors({origin: process.env.CLIENT_URL,credentials: true,}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/test', (req, res) => {
    res.status(200).json({ status: "success", message: "API is operational!" });
});

app.use('/api/url', require('./routes/urlRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.use(errorHandler);

module.exports = app;