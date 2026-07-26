export const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Approved: "default",
  Confirmed: "default",
  CONFIRMED: "default",
  PAID: "default",
  IN_PROGRESS: "default",
  visible: "default",

  PendingReview: "secondary",
  Completed: "secondary",
  PENDING: "secondary",
  flagged: "secondary",

  Rejected: "destructive",
  Cancelled: "destructive",
  CANCELLED: "destructive",
  removed: "destructive",

  Suspended: "outline",
  REFUNDED: "outline",
};

export const HIDE_REQUEST_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  none: "outline",
  pending: "secondary",
  approved: "destructive",
  rejected: "outline",
};
