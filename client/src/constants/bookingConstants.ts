export const BOOKING_UI_STATUS = {
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress',
} as const;

export const CANCELLATION_POLICIES = {
  REFUNDABLE: 'refundable',
  NON_REFUNDABLE: 'nonRefundable',
} as const;

export const REFUND_TYPES = {
  FULL: 'fullRefund',
  TIME_BASED: 'timeBasedRefund',
} as const;

export const BOOKING_REDIRECT_COUNTDOWN_SECONDS = 5;
