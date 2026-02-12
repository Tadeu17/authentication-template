/**
 * Application constants
 * Centralized error codes, HTTP status codes, and other constants
 */

// =============================================================================
// Error Codes
// =============================================================================

export const ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  INVALID_VERIFICATION_TOKEN: "INVALID_VERIFICATION_TOKEN",
  VERIFICATION_TOKEN_EXPIRED: "VERIFICATION_TOKEN_EXPIRED",
  INVALID_RESET_TOKEN: "INVALID_RESET_TOKEN",
  RESET_TOKEN_EXPIRED: "RESET_TOKEN_EXPIRED",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",

  // Generic errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// =============================================================================
// HTTP Status Codes
// =============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// =============================================================================
// Error Translation Keys
// Maps error codes to translation keys in the errors namespace
// =============================================================================

export const ERROR_TRANSLATION_KEYS: Record<ErrorCode, string> = {
  [ERROR_CODES.UNAUTHORIZED]: "errors.unauthorized",
  [ERROR_CODES.FORBIDDEN]: "errors.forbidden",
  [ERROR_CODES.EMAIL_NOT_VERIFIED]: "errors.emailNotVerified",
  [ERROR_CODES.INVALID_VERIFICATION_TOKEN]: "errors.invalidVerificationToken",
  [ERROR_CODES.VERIFICATION_TOKEN_EXPIRED]: "errors.verificationTokenExpired",
  [ERROR_CODES.INVALID_RESET_TOKEN]: "errors.invalidResetToken",
  [ERROR_CODES.RESET_TOKEN_EXPIRED]: "errors.resetTokenExpired",
  [ERROR_CODES.VALIDATION_ERROR]: "errors.validationError",
  [ERROR_CODES.NOT_FOUND]: "errors.notFound",
  [ERROR_CODES.USER_NOT_FOUND]: "errors.userNotFound",
  [ERROR_CODES.INTERNAL_ERROR]: "errors.internalError",
  [ERROR_CODES.RATE_LIMITED]: "errors.rateLimited",
} as const;

// =============================================================================
// Default Error Messages (English fallback for API responses)
// These are used in API routes where translations aren't available
// =============================================================================

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.UNAUTHORIZED]: "You must be logged in to access this endpoint",
  [ERROR_CODES.FORBIDDEN]: "You do not have permission to perform this action",
  [ERROR_CODES.EMAIL_NOT_VERIFIED]: "Please verify your email before logging in",
  [ERROR_CODES.INVALID_VERIFICATION_TOKEN]: "Invalid verification token",
  [ERROR_CODES.VERIFICATION_TOKEN_EXPIRED]: "Verification token has expired",
  [ERROR_CODES.INVALID_RESET_TOKEN]: "Invalid or expired reset token",
  [ERROR_CODES.RESET_TOKEN_EXPIRED]: "Password reset token has expired",
  [ERROR_CODES.VALIDATION_ERROR]: "Invalid request data",
  [ERROR_CODES.NOT_FOUND]: "Resource not found",
  [ERROR_CODES.USER_NOT_FOUND]: "User not found",
  [ERROR_CODES.INTERNAL_ERROR]: "An unexpected error occurred",
  [ERROR_CODES.RATE_LIMITED]: "Too many requests. Please try again later.",
};

// =============================================================================
// UI Constants
// =============================================================================

export const CARD_HOVER_CLASSES = "hover:shadow-lg transition-shadow";

// =============================================================================
// Async Operation Status
// =============================================================================

export const ASYNC_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type AsyncStatus = (typeof ASYNC_STATUS)[keyof typeof ASYNC_STATUS];
