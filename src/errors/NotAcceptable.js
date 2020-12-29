const { HttpError } = require('./HttpError');

class NotAcceptable extends HttpError {
  constructor(error) {
    super(error.message);
    this.name = this.constructor.name;
    this.statusCode = 406;
    HttpError.captureStackTrace(this, this.constructor);
  }
}

module.exports = { NotAcceptable };
