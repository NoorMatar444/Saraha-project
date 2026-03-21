// src/Common/response/errorResponse.js
export function notFoundException(message) {
  throw new Error(message, { cause: { statusCode: 404 } });
}
export function conflictException(message) {
  throw new Error(message, { cause: { statusCode: 409 } });
}
export function unAuthorizedException(message) {
  throw new Error(message, { cause: { statusCode: 401 } });
}
export function forbiddenException(message) {
  throw new Error(message, { cause: { statusCode: 403 } });
}
export function badRequestException(message) {
  throw new Error(message, { cause: { statusCode: 400 } });
}

export function errorHandling(error, req, res, next) {
  // <-- use statusCode (consistent with the rest of the code)
  const status = error.cause?.statusCode || 500;

  return res.status(status).json({
    success: false,
    message:
      status === 500 && process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message || "Something went wrong",
    // include stack in development
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    // include validation/details if present
    details: error.cause?.details
  });
}