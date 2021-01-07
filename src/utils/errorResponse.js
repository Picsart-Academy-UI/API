// eslint-disable-next-line max-classes-per-file
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFound extends Error {
  constructor(message, statusCode = 404) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequest extends Error {
  constructor(message, statusCode = 400) {
    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  ErrorResponse,
  NotFound,
  BadRequest
};
