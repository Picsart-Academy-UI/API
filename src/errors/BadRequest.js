const { HttpError } = require('./HttpError');

export class BadRequest extends HttpError {
  constructor(error) {
    super(error.message);
    this.name = this.constructor.name;
    this.statusCode = 400;
    HttpError.captureStackTrace(this, this.constructor);
  }
}
