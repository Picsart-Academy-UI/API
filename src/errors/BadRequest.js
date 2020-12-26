const { HttpError } = require('./HttpError');

class BadRequest extends HttpError {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.statusCode = 400;
    this.message = message;
    HttpError.captureStackTrace(this, this.constructor);
  }
}

module.exports = { BadRequest };
