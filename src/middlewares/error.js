const { ErrorResponse } = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `The requested URL: ${req.path} was not found on this server`;
    // const { message } = err;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicated key
  if (err.code === 11000) {
    const errValStr = JSON.stringify(err.keyValue);
    const message = `Duplicate ${errValStr} field value entered.`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    error: error.message || 'Server Error'
  });
};
module.exports = errorHandler;
