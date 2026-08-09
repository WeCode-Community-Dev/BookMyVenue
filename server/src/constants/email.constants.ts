export type EmailIntentType = (typeof EmailIntent)[keyof typeof EmailIntent];
export type EmailTaskStatusType = (typeof EmailTaskStatus)[keyof typeof EmailTaskStatus];

export const EmailIntent = {
  PASSWORD_RESET: 'password_reset',
  ADMIN_PASSWORD_RESET: 'admin_password_reset',
  SECURITY_ALERT: 'security_alert',
  BOOKING_CONFIRMATION: 'booking_confirmation',
  BOOKING_REFUND: 'booking_refund',
  BOOKING_CANCELLATION: 'booking_cancellation',
  VENUE_APPROVED: 'venue_approved',
  VENUE_REJECTED: 'venue_rejected',
  VENUE_SUSPENDED: 'venue_suspended',
  VENUE_UNSUSPENDED: 'venue_unsuspended',
  VENUE_DEADLINE_EXTENDED: 'venue_deadline_extended',
  USER_BANNED: 'user_banned',
  USER_UNBANNED: 'user_unbanned',
  REVIEW_REMOVED: 'review_removed',
  REVIEW_RESTORED: 'review_restored',
} as const;

export const EmailTaskStatus = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING: 'pending',
  QUEUED: 'queued',
} as const;

export const EmailConstants = {
  MAX_RETRIES: 3,
  POLL_INTERVAL_MS: 5000, // 5 seconds
  STALE_CUTOFF_MS: 5 * 60 * 1000, // 5 minutes
} as const;
