export const VENUE_CONSTANTS = {
  MAX_SUBMISSION_ATTEMPTS: 10,
  EDIT_WINDOW_DAYS: 30,
  MAX_EXTENDED_DAYS: 120,
  AUTO_SUSPEND_REASON:
    "Auto-suspended: Owner did not resubmit within 30 days after rejection",
} as const;
