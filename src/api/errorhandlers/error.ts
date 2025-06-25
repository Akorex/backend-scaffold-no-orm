export class CustomError extends Error {
  public success: boolean;
  public message: string;
  public code: number;
  public data: any; // Ensure consistency

  constructor(code: number, message: string, data: any = null) {
    super(message);
    this.success = false;
    this.code = code;
    this.message = message;
    this.data = data;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  static wrap(error: any): CustomError {
    if (error instanceof CustomError) {
      return error; // Already wrapped
    }

    if (error.name === "EntityMetadataNotFoundError") {
      return new CustomError(
        500,
        "Entity metadata not found. Ensure the entity is registered and database is initialized."
      );
    }

    if (error.message?.includes("ECONNREFUSED")) {
      return new CustomError(
        500,
        "Database connection refused. Ensure the database is running."
      );
    }

    if (
      error.message?.includes("relation") &&
      error.message?.includes("does not exist")
    ) {
      return new CustomError(
        500,
        "A required database table is missing. Run migrations."
      );
    }

    if (error.message?.includes("timeout")) {
      return new CustomError(
        500,
        "Database request timeout. Check your connection."
      );
    }

    if (error.message?.includes("Connection terminated unexpectedly")) {
      return new CustomError(
        500,
        "Database connection was lost. Restart the database."
      );
    }

    // 🔥 Log the full error stack for debugging
    console.error("Unhandled error:", error);

    return CustomError.InternalServerError();
  }

  static NotFound(message?: string) {
    return new CustomError(404, message || `Requested resource not found`);
  }

  static BadRequest(message: string) {
    return new CustomError(400, message);
  }

  static InternalServerError() {
    return new CustomError(500, `Internal Server Error`);
  }

  static Unauthorized() {
    return new CustomError(401, `Unauthorized`);
  }

  static Forbidden() {
    return new CustomError(403, `Forbidden`);
  }

  static JwtTokenError() {
    return new CustomError(403, `Invalid or expired token`);
  }

  static QueryFailedError(message?: string) {
    return new CustomError(400, message || `Database query error`);
  }

  static DuplicateKeyError(message?: string) {
    return new CustomError(409, message || `Duplicate key error`);
  }
}
