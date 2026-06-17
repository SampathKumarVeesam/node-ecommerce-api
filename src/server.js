// Handle uncaught exceptions (synchronous errors that occurred in the code but weren't caught)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Establish Connection to MongoDB Database
connectDB();

const PORT = process.env.PORT || 5000;

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
});

// Handle unhandled promise rejections (asynchronous errors that weren't caught)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down gracefully...');
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
