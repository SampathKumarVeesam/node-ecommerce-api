const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log error stack in dev/prod (but skip during tests to keep logs clean)
  if (process.env.NODE_ENV !== 'test') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      // Provide detailed stack trace only in development environment
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = errorHandler;
