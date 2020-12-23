const { HttpError } = require('./HttpError');

export class Unauthorized extends HttpError {
  constructor() {
    super();
    this.name = this.constructor.name;
    this.statusCode = 401;
    HttpError.captureStackTrace(this, this.constructor);
  }
}
