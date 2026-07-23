/**
 * Venue slot availability (8 AM – 10 PM IST).
 * Uses busySlots from GET /venues/:id/availability — same overlap rule as backend.
 */

import { convertIstDateHourToUtcIso, getTodayDateStringInIst } from '@/utils/datetime';

export const VENUE_OPEN_HOUR = 8;
export const VENUE_CLOSE_HOUR = 22;

/**
 * Hours a booking can START on: 8, 9, … 21 (last start is 9 PM, ending 10 PM).
 * End is exclusive, so starting at 21 pairs with the 22 (10 PM) close.
 */
export function getVenueOperatingHourNumbers() {
  return Array.from({ length: VENUE_CLOSE_HOUR - VENUE_OPEN_HOUR }, (_, index) => VENUE_OPEN_HOUR + index);
}

/**
 * Hours a booking can END on: 9, 10, … 22 (10 PM close). End is exclusive,
 * so the latest end is the closing hour itself.
 */
export function getVenueBookingEndHourNumbers() {
  return Array.from({ length: VENUE_CLOSE_HOUR - VENUE_OPEN_HOUR }, (_, index) => VENUE_OPEN_HOUR + 1 + index);
}

/**
 * True if two time ranges overlap (half-open intervals: [start, end)).
 * Same logic as backend: bookingFrom < otherEnd AND bookingTo > otherStart.
 *
 * @example
 * doTimeRangesOverlap(
 *   new Date('2026-07-10T10:00:00Z'), new Date('2026-07-10T11:00:00Z'),
 *   new Date('2026-07-10T10:30:00Z'), new Date('2026-07-10T12:00:00Z'),
 * )
 * // => true (10–11 overlaps 10:30–12)
 */
export function doTimeRangesOverlap(rangeOneStart, rangeOneEnd, rangeTwoStart, rangeTwoEnd) {
  return rangeOneStart < rangeTwoEnd && rangeOneEnd > rangeTwoStart;
}

/**
 * Is this one-hour slot already taken by a confirmed booking?
 */
export function isHourBlockedByExistingBooking(dateString, hourInIst, busySlots) {
  const slotStart = new Date(convertIstDateHourToUtcIso(dateString, hourInIst));
  const slotEnd = new Date(convertIstDateHourToUtcIso(dateString, hourInIst + 1));

  return busySlots.some((busySlot) => doTimeRangesOverlap(slotStart, slotEnd, new Date(busySlot.bookingFrom), new Date(busySlot.bookingTo)));
}

/** Which operating hours are free on this day? */
export function getAvailableHoursForDay(dateString, busySlots) {
  return getVenueOperatingHourNumbers().filter((hour) => !isHourBlockedByExistingBooking(dateString, hour, busySlots));
}

/** Is this calendar day before today (IST)? */
export function isDateBeforeToday(dateString) {
  return dateString < getTodayDateStringInIst();
}

/** Every operating hour is blocked (or day is in the past). */
export function isDateFullyBooked(dateString, busySlots) {
  if (isDateBeforeToday(dateString)) return true;
  return getAvailableHoursForDay(dateString, busySlots).length === 0;
}

/** Some hours free, some taken — show dot on calendar. */
export function isDatePartiallyBooked(dateString, busySlots) {
  if (isDateBeforeToday(dateString)) return false;
  const freeHourCount = getAvailableHoursForDay(dateString, busySlots).length;
  const totalOperatingHours = getVenueOperatingHourNumbers().length;
  return freeHourCount > 0 && freeHourCount < totalOperatingHours;
}

/** Would any hour in [startHour, endHour) conflict with existing bookings? */
export function isHourRangeBlockedByExistingBooking(dateString, startHourInIst, endHourInIst, busySlots) {
  for (let hour = startHourInIst; hour < endHourInIst; hour += 1) {
    if (isHourBlockedByExistingBooking(dateString, hour, busySlots)) {
      return true;
    }
  }
  return false;
}

/** How many hours between start and end (end is exclusive). */
export function countHoursBetween(startHourInIst, endHourInIst) {
  return endHourInIst - startHourInIst;
}

/**
 * Calendar grid cells for a month: null for padding, 'YYYY-MM-DD' for each day.
 */
export function buildCalendarDaysForMonth(year, monthOneToTwelve) {
  const firstWeekday = new Date(Date.UTC(year, monthOneToTwelve - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthOneToTwelve, 0)).getUTCDate();
  const monthPadded = String(monthOneToTwelve).padStart(2, '0');

  const cells = [];

  for (let padding = 0; padding < firstWeekday; padding += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${year}-${monthPadded}-${String(day).padStart(2, '0')}`);
  }

  return cells;
}

/** Which month/year to show when the calendar first opens. */
export function getCurrentMonthYearInIst() {
  const todayDateString = getTodayDateStringInIst();
  const [year, month] = todayDateString.split('-').map(Number);
  return { year, month };
}
