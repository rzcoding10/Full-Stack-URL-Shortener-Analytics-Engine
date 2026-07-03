require('dotenv').config();
 // Load environment variables first
const app = require('./app');
const connectDB = require('./utils/db');

const PORT = process.env.PORT || 4000;

// Connect to the database, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize server:', err);
});