const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @route   GET /health
 * @desc    Health check endpoint to monitor API and Database status
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbConnectionState = mongoose.connection.readyState;
  const dbStatus = dbConnectionState === 1 ? 'UP' : 'DOWN';

  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: dbStatus,
        state: dbStates[dbConnectionState] || 'unknown'
      }
    },
    uptime: `${Math.round(process.uptime())}s`,
    environment: process.env.NODE_ENV,
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
    }
  });
});

module.exports = router;
