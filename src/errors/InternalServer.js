const { HttpError } = require('./HttpError');

class InternalServer extends HttpError {
  constructor(error) {
    super(error.message);
    this.name = this.constructor.name;
    this.statusCode = 500;
    HttpError.captureStackTrace(this, this.constructor);
  }
}

module.exports = { InternalServer };
