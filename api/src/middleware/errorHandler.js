const { Request, Response, NextFunction } = require('express')

function errorHandler(
  err,
  req,
  res,
  next
) {
  console.error(err.stack)

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    })
  }

  // Handle unauthorized errors
  if (err.message === 'Unauthorized') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access'
    })
  }

  // Handle all other errors
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
}

module.exports = { errorHandler }
