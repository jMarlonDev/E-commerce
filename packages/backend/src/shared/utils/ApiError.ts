export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string) {
    return new ApiError(message, 400);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(message, 403);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(message, 404);
  }

  static conflict(message: string) {
    return new ApiError(message, 409);
  }

  static internal(message = "Internal server error") {
    return new ApiError(message, 500, false);
  }
}
