const {
  ErrorResponse, NotFound, BadRequest, Unauthorized,
  MethodNotAllowed, Forbidden, Conflict, NotAcceptable
} = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `The requested URL: ${req.path} was not found on this server`;
    // const { message } = err;
    error = new ErrorResponse(message, 404);
  }

  // JSONWEBTOKEN error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
  }

  // Mongoose duplicated key
  if (err.code === 11000) {
    const errValStr = JSON.stringify(err.keyValue);
    const message = `Duplicate ${errValStr} field value entered.`;
    // const { message } = err;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Syntax error
  if (err.name === 'SyntaxError') {
    const message = 'Syntax Error';
    error = new ErrorResponse(message, 401);
  }

  // Bad Request error
  if (err.name === 'BadRequest') {
    const message = err.message || 'Bad Request';
    error = new BadRequest(message, 400);
  }

  // Unauthorized error
  if (err.name === 'Unauthorized') {
    const message = err.message || 'Unauthorized';
    error = new Unauthorized(message, 401);
  }

  // Not Found error
  if (err.name === 'NotFound') {
    const message = err.message || `The requested resource ${req.url} was not found.`;
    error = new NotFound(message, 404);
  }

  // Forbidden error
  if (err.name === 'Forbidden') {
    const message = err.message || 'Forbidden';
    error = new Forbidden(message, 403);
  }

  // MethodNotAllowed error
  if (err.name === 'MethodNotAllowed') {
    const message = err.message || 'Method Not Allowed';
    error = new MethodNotAllowed(message, 405);
  }

  // NotAcceptable error
  if (err.name === 'NotAcceptable') {
    const message = err.message || 'Not Acceptable';
    error = new NotAcceptable(message, 406);
  }

  // Conflict error
  if (err.name === 'Conflict') {
    const message = err.message || 'Conflict';
    error = new Conflict(message, 409);
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Server Error'
  });
};
module.exports = errorHandler;
