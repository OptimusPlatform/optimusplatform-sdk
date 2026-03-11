export class OptimusError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = 'OptimusError';
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, OptimusError.prototype);
  }
}

export class AuthenticationError extends OptimusError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class RateLimitError extends OptimusError {
  public readonly retryAfter?: number;

  constructor(message = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class ValidationError extends OptimusError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends OptimusError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class NetworkError extends OptimusError {
  constructor(message = 'Network request failed') {
    super(message, undefined, 'NETWORK_ERROR');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
