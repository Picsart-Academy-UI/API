const { HttpError } = require('./HttpError');

class NotFound extends HttpError {
  constructor(config = null) {
    super();
    this.name = this.constructor.name;
    this.statusCode = 404;

    if (config) {
      this.message = config.message || `${config.entity}: ${config.resource} not found.`;
    } else {
      this.message = 'The requested URL was not found on this server';
    }

    HttpError.captureStackTrace(this, this.constructor);
  }
}
module.exports = { NotFound };
