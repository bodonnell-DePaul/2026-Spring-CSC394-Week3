// ---------------------------------------------------------------------------
// errorHandler.js — Centralized error-handling middleware
// ---------------------------------------------------------------------------
// Demonstrates the standardized error format from the lecture:
//   { error: { code, message, details? } }
// ---------------------------------------------------------------------------

function notFound(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}

module.exports = { notFound, errorHandler };
