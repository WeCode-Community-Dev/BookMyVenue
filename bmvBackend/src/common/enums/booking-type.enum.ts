/**
 * How the venue accepts bookings.
 *   FULL_DAY  — entire day is booked as one unit
 *   TIME_SLOT — owner defines specific time slots (morning / evening etc.)
 */
export enum BookingType {
  FULL_DAY = 'FULL_DAY',
  TIME_SLOT = 'TIME_SLOT',
}
