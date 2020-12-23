const { HttpError } = require('./HttpError');

export class InternalServer extends HttpError {
  constructor(error) {
    super(error.message);
    this.name = this.constructor.name;
    this.statusCode = 500;
    HttpError.captureStackTrace(this, this.constructor);
  }
}
