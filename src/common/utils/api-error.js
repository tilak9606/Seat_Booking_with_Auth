class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(412, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, message);
  }

  static notVerified(message = "Email not verified") {
    return new ApiError(403, message);
  }

  static alreadyBooked(message = "Seat is already booked") {
    return new ApiError(400, message);
  }

  static notBooked(message = "Seat is not booked") {
    return new ApiError(400, message);
  }

  static failedToFetchSeat(message = "Failed to fetch seat") {
    return new ApiError(500, message);
  }

  static failedToBookSeat(message = "Failed to book seat") {
    return new ApiError(500, message);
  }

  static failedToCancelSeat(message = "Failed to cancel seat") {
    return new ApiError(500, message);
  }

  static unauthorizedToCancelSeat(
    message = "Unauthorized to cancel this seat",
  ) {
    return new ApiError(403, message);
  }

  static internalServerError(message = "Internal server error") {
    return new ApiError(500, message);
  }

  static seatNotFound(message = "Seat not found") {
    return new ApiError(404, message);
  }

  static userNotAuthorized(message = "User not authorized") {
    return new ApiError(401, message);
  }
}

export default ApiError;
