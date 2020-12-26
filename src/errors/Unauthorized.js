const { HttpError } = require('./HttpError');

export class Unauthorized extends HttpError {
  constructor(user) {
    super(`${user} was not authorized.`);
    this.name = this.constructor.name;
    this.statusCode = 401;
    HttpError.captureStackTrace(this, this.constructor);
  }
}
