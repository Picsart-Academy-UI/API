class HttpError extends Error {
  constructor(httpCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = httpCode;
    this.message = message;

    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = { HttpError };
