export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle known error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors
    });
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      success: false,
      error: 'Unable to reach the platform. Please try again later.'
    });
  }

  if (err.response?.status === 404) {
    return res.status(404).json({
      success: false,
      error: 'Content not found. The video may have been deleted or is private.'
    });
  }

  if (err.response?.status === 403) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. The content may be private or restricted.'
    });
  }

  if (err.response?.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limited by the platform. Please try again later.'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
