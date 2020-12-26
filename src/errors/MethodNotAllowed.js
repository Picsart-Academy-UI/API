const { HttpError } = require('./HttpError');

export class MethodNotAllowed extends HttpError {
  constructor(error) {
    super(error.message);
    this.name = this.constructor.name;
    this.statusCode = 405;
    HttpError.captureStackTrace(this, this.constructor);
  }
}
