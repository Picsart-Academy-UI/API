const { HttpError } = require('./HttpError');

class Forbidden extends HttpError {
  constructor(error) {
    super(error.message);
    this.name = this.constructor.name;
    this.statusCode = 403;
    HttpError.captureStackTrace(this, this.constructor);
  }
}

module.exports = { Forbidden };
