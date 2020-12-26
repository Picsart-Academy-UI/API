const { HttpError } = require('./HttpError');

export class NotFound extends HttpError {
  constructor(field) {
    super(`${field} was not found.`);
    this.name = this.constructor.name;
    this.statusCode = 404;
    HttpError.captureStackTrace(this, this.constructor);
  }
}
