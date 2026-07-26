export interface User {
  [key: string]: unknown;
  _id: string;
  username: string;
  email: string;
  status: "active" | "suspended" | "banned";
  createdAt: string;
}

export interface Owner {
  [key: string]: unknown;
  _id: string;
  username: string;
  email: string;
  status: "active" | "suspended" | "banned";
  venuesCount: number;
  createdAt: string;
}

export interface Admin {
  [key: string]: unknown;
  _id: string;
  username: string;
  email: string;
  role: "admin" | "superAdmin";
  createdAt: string;
}

export interface Venue {
  [key: string]: unknown;
  _id: string;
  name: string;
  venueType: string;
  maxCapacity: number;
  status:
    | "Draft"
    | "PendingReview"
    | "Approved"
    | "Rejected"
    | "Suspended"
    | "Inactive";
  city: string;
  ownerUserId: {
    _id: string;
    username: string;
    email: string;
  };
  avgRating?: number;
  reviewCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  submissionCount?: number;
  lastSubmittedAt?: string;
  createdAt: string;
  updatedAt?: string;
  currentEditDeadline?: string;
  rejectionHistory?: Array<{
    reason: string;
    rejectedAt: string;
    rejectedBy?: string;
    submissionNumber: number;
    editDeadline: string;
    extendedAt?: string;
    extendedBy?: string;
    originalDeadline?: string;
  }>;
  pendingReview?: {
    intent: string;
    requestedAt: string;
    details?: {
      changedFields?: string[];
      previousSnapshot?: Record<string, unknown>;
      reason?: string;
    };
  };
  inactivity?: {
    requestedAt?: string;
    approvedAt?: string;
    blockedAfterDate?: string;
    inactiveAt?: string;
    lastInactiveAt?: string;
    withdrawalRequestedAt?: string;
  };
  temporaryBlockAfterDate?: string;
}

export interface MyVenue {
  [key: string]: unknown;
  _id: string;
  name: string;
  status: "active" | "pending" | "rejected" | "deactivated" | "draft";
  category: string;
  rating?: number;
  totalBookings?: number;
}

export interface Booking {
  [key: string]: unknown;
  _id: string;
  bookingRefId: string;
  venueId: string;
  venue?: {
    _id: string;
    name: string;
    city?: string;
    district?: string;
    address?: string;
  };
  date: string;
  startTime: number;
  endTime: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus?: "pending" | "paid" | "refunded";
  uiStatus?: "confirmed" | "completed" | "cancelled" | "in_progress";
  price: number;
  createdAt: string;
  bookerName?: string;
  bookerPhone?: string;
  bookerEmail?: string;
  paymentMethod?: string;
  userId?: string;
  user?: { _id: string; username: string; email: string; phone?: string };
  eventType?: string;
}

export interface BookerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Review {
  [key: string]: unknown;
  _id: string;
  userId: { username: string; email: string };
  rating: number;
  comment?: string;
  status: "visible" | "flagged" | "removed";
  hideRequestStatus: "none" | "pending" | "approved" | "rejected";
  ownerReply?: { text: string; repliedAt: string | Date };
  hideRequestReason?: string;
  createdAt: string;
}

export interface Log {
  [key: string]: unknown;
  _id: string;
  adminId: { username: string; email: string };
  action: string;
  targetModel: string;
  targetId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface BanRecord {
  [key: string]: unknown;
  _id: string;
  scope: string;
  reason: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface MonthData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface BlockedDate {
  dateObj: Date;
  isPast: boolean;
  date: string;
  venueId: string;
}
