export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends ApiError {
  constructor(message) {
    super(400, message, true);
  }
}

export class NotFoundError extends ApiError {
  constructor(message) {
    super(404, message, true);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message, true);
  }
} 