// eslint-disable-next-line max-classes-per-file
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequest extends Error {
  constructor(message, statusCode = 400) {
    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class Unauthorized extends Error {
  constructor(message, statusCode = 401) {
    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class Forbidden extends Error {
  constructor(message, statusCode = 403) {
    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFound extends Error {
  constructor(message, statusCode = 404) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class MethodNotAllowed extends Error {
  constructor(message, statusCode = 405) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotAcceptable extends Error {
  constructor(message, statusCode = 406) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class Conflict extends Error {
  constructor(message, statusCode = 409) {
    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  ErrorResponse,
  NotFound,
  Conflict,
  Forbidden,
  BadRequest,
  Unauthorized,
  NotAcceptable,
  MethodNotAllowed
};
