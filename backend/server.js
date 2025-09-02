require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, _promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & throw error instead of process.exit
  server.close(() => {
    throw new Error(`Unhandled Rejection: ${err.message}`);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  // Throw error instead of process.exit
  throw new Error(`Uncaught Exception: ${err.message}`);
});
