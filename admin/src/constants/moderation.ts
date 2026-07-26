export const REVIEW_ACTIONS = {
  REMOVE: "remove",
  APPROVE_HIDE: "approve_hide",
  REJECT_HIDE: "reject_hide",
  RESTORE: "restore",
  FLAG: "flag",
} as const;

export const BAN_SCOPES = {
  FULL: "full",
  COMMENTING: "commenting",
  OWNER_DASHBOARD: "owner_dashboard",
  VENUE_CREATION: "venue_creation",
} as const;

export const BAN_DURATIONS = {
  PERMANENT: "permanent",
  ONE_DAY: "1day",
  SEVEN_DAYS: "7days",
  THIRTY_DAYS: "30days",
  CUSTOM: "custom",
} as const;

export const MIN_REASON_LENGTH = 10;
export const DAY_MS = 24 * 60 * 60 * 1000;

export const LOG_ACTION_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ban_user: "destructive",
  unban_user: "default",
  suspend_venue: "destructive",
  unsuspend_venue: "default",
  remove_review: "secondary",
  restore_review: "outline",
};

export const LOG_ACTION_LABELS: Record<string, string> = {
  ban_user: "Ban User",
  unban_user: "Unban User",
  suspend_venue: "Suspend Venue",
  unsuspend_venue: "Unsuspend Venue",
  remove_review: "Remove Review",
  restore_review: "Restore Review",
};
