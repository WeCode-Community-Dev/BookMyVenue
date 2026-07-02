export enum BookingStatus {
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  DEPOSIT_PAID = 'DEPOSIT_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  CASH = 'cash',
  WALLET = 'wallet',
}

export enum BookingScenario {
  ADVANCE = 'ADVANCE', // > 7 days — pay platform-defined advance now, remaining balance later
  IMMEDIATE = 'IMMEDIATE', // <= 7 days — pay 100% now
}

export enum CancellationType {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
}

export enum RefundStatus {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Platform-wide reservation policy constants
export const RESERVATION_POLICY = {
  DEPOSIT_PERCENTAGE: 0.2,
  GST_PERCENTAGE: 0.18,
  PLATFORM_FEE_PERCENTAGE: 0.12,
  ADVANCE_THRESHOLD_DAYS: 7,
  SCHEDULING_RATIO: 0.5, // due at midpoint of booking window
  SCHEDULING_MIN_DAYS: 5, // latest possible due date (5 days before event)
  SCHEDULING_MAX_DAYS: 30, // earliest possible due date (30 days before event)
  GRACE_PERIOD_HOURS: 24, // hours to pay balance after deadline before auto-cancellation
};
