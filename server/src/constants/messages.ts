export const MESSAGES = {
  SUCCESS: 'Success',

  // auth
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token expired',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_VERIFIED: 'User verified successfully',

  // user
  USER_NOT_FOUND: 'User not found',
  USER_CREATED: 'User created successfully',

  // venue
  VENUE_NOT_FOUND: 'Venue not found',
  FORBIDDEN_VENUE_ACCESS: 'You are not authorized to access this venue',
  VENUE_CREATED: 'Venue created successfully',
  VENUE_UPDATED: 'Venue updated successfully',
  VENUE_DELETED: 'Venue deleted successfully',
  VENUES_FETCHED: 'Venues fetched successfully',
  VENUE_APPROVED: 'Venue approved successfully',
  VENUE_REJECTED: 'Venue rejected successfully',

  // general
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',

  // OTP
  OTP_EMAIL_FAIL: 'Failed to send OTP email',
  OTP_NOT_FOUND: 'OTP not found or expired',
  OTP_MAX_ATTEMPTS: 'Maximum verification attempts reached. Please request a new OTP',
  OTP_INVALID: 'Invalid OTP',
  OTP_RESEND_LIMIT: 'Maximum resend limit reached',
  OTP_RESEND_COOLDOWN: 'OTP resend cooldown period active',
  OTP_RESENT: 'OTP resent successfully',
};
