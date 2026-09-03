export const VENUE_STATUS = {
  DRAFT: "Draft",
  PENDING_REVIEW: "PendingReview",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
  INACTIVE: "Inactive",
} as const;

export const ADMIN_VENUE_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  ACTIVE: "active",
  REJECTED: "rejected",
  DEACTIVATED: "deactivated",
} as const;
