const ERROR_MESSAGES = {
  VALIDATION_ERROR:       'Please check your input and try again.',
  UNAUTHORIZED:           'You must be logged in to do this.',
  INVALID_CREDENTIALS:    'Incorrect email or password.',
  FORBIDDEN:              'You do not have permission to do this.',
  ACCOUNT_DISABLED:       'Your account has been disabled. Contact support.',
  NOT_FOUND:              'The requested resource was not found.',
  VENUE_NOT_FOUND:        'This venue does not exist.',
  BOOKING_NOT_FOUND:      'This booking does not exist.',
  EMAIL_EXISTS:           'An account with this email already exists.',
  ALREADY_BOOKED:         'This venue is already booked for the selected date.',
  ALREADY_PAID:           'This booking has already been paid.',
  ACTIVE_BOOKINGS_EXIST:  'Cannot delete a venue with active bookings.',
  UNPROCESSABLE:          'This action cannot be completed.',
  PAYMENT_FAILED:         'Payment failed. Please try again.',
  INVALID_SIGNATURE:      'Payment verification failed.',
  CANCELLATION_NOT_ALLOWED: 'This booking can no longer be cancelled.',
  INTERNAL_ERROR:         'Something went wrong on our end. Please try again.',
};

export const getFriendlyError = (code) =>
  ERROR_MESSAGES[code] ?? ERROR_MESSAGES.INTERNAL_ERROR;

/** Map known API error codes; leave free-text details unchanged. */
export const resolveApiError = (detail) => {
  if (typeof detail !== "string" || !detail) {
    return ERROR_MESSAGES.INTERNAL_ERROR;
  }
  return ERROR_MESSAGES[detail] ?? detail;
};