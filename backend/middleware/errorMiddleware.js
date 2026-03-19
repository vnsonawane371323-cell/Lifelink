/**
 * Global error-handling middleware for LifeLink API.
 *
 * Two handlers are exported:
 *  1. notFound  – catches requests to undefined routes (404).
 *  2. errorHandler – catches all thrown / forwarded errors
 *     and returns a uniform JSON response.
 */

/**
 * 404 — Route Not Found
 * Attached *after* all valid route definitions.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * General error handler.
 * In production the stack trace is omitted for security.
 */
const errorHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
