const { HttpError } = require('./HttpError');

class MethodNotAllowed extends HttpError {
  constructor(error) {
    super(error.message);
    this.name = this.constructor.name;
    this.statusCode = 405;
    HttpError.captureStackTrace(this, this.constructor);
  }
}

module.exports = { MethodNotAllowed };
