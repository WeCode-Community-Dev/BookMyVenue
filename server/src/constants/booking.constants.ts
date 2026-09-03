export type BookingStatusType = (typeof BookingStatus)[keyof typeof BookingStatus];

export const BookingStatus = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
} as const;
