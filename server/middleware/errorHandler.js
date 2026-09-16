/**
 * Centralized Error Handling Middleware
 * Guarantees consistent JSON responses: { success: false, message: string, errors?: object }
 */

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found on this Rolodex shelf: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('⚠️ [Error Handler Catch]:', err);

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    const message =
      field === 'email'
        ? `A contact with the email address '${value}' is already filed in your Rolodex.`
        : `Duplicate entry detected for ${field}: '${value}'.`;

    return res.status(409).json({
      success: false,
      message,
      errors: {
        [field]: message,
      },
    });
  }

  // Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format for parameter '${err.path}': ${err.value}`,
      errors: {
        [err.path]: 'Malformed identifier.',
      },
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(400).json({
      success: false,
      message: 'Database validation failed.',
      errors,
    });
  }

  // Custom Application Error with explicit status
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'An unexpected ink-spill occurred on the server.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
