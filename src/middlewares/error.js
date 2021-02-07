const {
  ErrorResponse, NotFound, BadRequest, Unauthorized,
  MethodNotAllowed, Forbidden, Conflict, NotAcceptable
} = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  switch (err.name) {
    case 'MongoError':
      if (err.code === 11000) {
        const { message } = err;
        error = new BadRequest(message, 400);
      }
      break;
    case 'CastError': {
      const { message } = err;
      error = new ErrorResponse(message, 404);
      break;
    }
    case 'JsonWebTokenError': {
      const message = 'Invalid token';
      error = new ErrorResponse(message, 401);
      break;
    }
    case 'ValidationError': {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new BadRequest(message[0], 400);
      break;
    }
    case 'BadRequest': {
      const message = err.message || 'Bad Request';
      error = new BadRequest(message, 400);
      break;
    }
    case 'Unauthorized': {
      const message = err.message || 'Unauthorized';
      error = new Unauthorized(message, 401);
      break;
    }
    case 'NotFound': {
      const message = err.message || `The requested resource ${req.url} was not found.`;
      error = new NotFound(message, 404);
      break;
    }
    case 'Forbidden': {
      const message = err.message || 'Forbidden';
      error = new Forbidden(message, 403);
      break;
    }
    case 'MethodNotAllowed': {
      const message = err.message || 'Method Not Allowed';
      error = new MethodNotAllowed(message, 405);
      break;
    }
    case 'NotAcceptable': {
      const message = err.message || 'Not Acceptable';
      error = new NotAcceptable(message, 406);
      break;
    }
    case 'Conflict': {
      const message = err.message || 'Conflict';
      error = new Conflict(message, 409);
      break;
    }
  }

  if (err.message && err.message.startsWith('Unexpected token')) {
    const message = err.message || 'Invalid token';
    error = new Unauthorized(message, 401);
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Server Error'
  });
};
module.exports = errorHandler;
