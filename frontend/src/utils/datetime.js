/**
 * Datetime helpers for booking.
 *
 * MVP rule: user picks dates/times in IST (India). Backend expects UTC ISO strings ending in Z.
 * We hard-code IST offset (+05:30) because this app targets Indian venues only for now.
 */

const IST_TIMEZONE = 'Asia/Kolkata';
/** India Standard Time offset. Hard-coded for MVP — not multi-timezone yet. */
const IST_UTC_OFFSET = '+05:30';

/**
 * Turn an IST calendar date + hour into a UTC ISO string for the API.
 *
 * @example
 * convertIstDateHourToUtcIso('2026-07-10', 10)
 * // => '2026-07-10T04:30:00.000Z'  (10:00 IST = 04:30 UTC)
 */
export function convertIstDateHourToUtcIso(dateString, hourInIst) {
  const hourPadded = String(hourInIst).padStart(2, '0');
  return new Date(`${dateString}T${hourPadded}:00:00${IST_UTC_OFFSET}`).toISOString();
}

/**
 * Today's date as YYYY-MM-DD in IST (what the user sees on their calendar).
 *
 * Uses Intl — built-in browser API for locale-aware dates (see README conventions).
 *
 * @example
 * getTodayDateStringInIst()
 * // => '2026-07-07'  (when "now" is July 7 in India)
 */
export function getTodayDateStringInIst() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: IST_TIMEZONE }).format(new Date());
}

/**
 * Add days to a YYYY-MM-DD string. Used for "end of day" availability ranges.
 *
 * @example
 * addDaysToDateString('2026-07-31', 1)
 * // => '2026-08-01'
 */
export function addDaysToDateString(dateString, daysToAdd) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return date.toISOString().slice(0, 10);
}

/**
 * UTC from/to for fetching availability for an entire calendar month.
 * Passed to GET /venues/:id/availability?from=&to=
 *
 * @example
 * getMonthUtcRangeForAvailabilityQuery(2026, 7)
 * // => { from: '2026-06-30T18:30:00.000Z', to: '2026-07-31T18:30:00.000Z', ... }
 */
export function getMonthUtcRangeForAvailabilityQuery(year, monthOneToTwelve) {
  // pad is eg : if date is 1 add 0 to its front => 01
  const monthPadded = String(monthOneToTwelve).padStart(2, '0');
  const firstDayOfMonth = `${year}-${monthPadded}-01`;

  /**
   * in js months start form 0 , so if month is 7 its not july its actually aug , then monthOneToTwelve is 6 actually
   * below is a technique to get the days in the month
   * Date.UTc(year, month, 0) => there is no day called 0 , so js return last day of previous month ,  so we are getting the last day of the previous month
   * then getUTCDate() will give the last day of the month
   * 
   * eg : if month is 7(in js is 0 index its calculated as aug which is 8) , and day is 0 , then it will return last day of 6 which is actually 7 june 
   */
  const daysInMonth = new Date(Date.UTC(year, monthOneToTwelve, 0)).getUTCDate();
  const lastDayOfMonth = `${year}-${monthPadded}-${String(daysInMonth).padStart(2, '0')}`;

  return {
    from: convertIstDateHourToUtcIso(firstDayOfMonth, 0),
    to: convertIstDateHourToUtcIso(addDaysToDateString(lastDayOfMonth, 1), 0),
    firstDayOfMonth,
    lastDayOfMonth,
  };
}

/**
 * UTC from/to for one IST day (midnight to midnight IST).
 *
 * @example
 * getDayUtcRangeForAvailabilityQuery('2026-07-10')
 * // => { from: '2026-07-09T18:30:00.000Z', to: '2026-07-10T18:30:00.000Z' }
 */
export function getDayUtcRangeForAvailabilityQuery(dateString) {
  return {
    from: convertIstDateHourToUtcIso(dateString, 0),
    to: convertIstDateHourToUtcIso(addDaysToDateString(dateString, 1), 0),
  };
}

/**
 * Format a UTC ISO string for display in IST.
 *
 * @example
 * formatUtcForIstDisplay('2026-07-10T04:30:00.000Z', { hour: 'numeric', hour12: true })
 * // => '10:00 am'
 */
export function formatUtcForIstDisplay(utcIsoString, formatOptions = {}) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    ...formatOptions,
  }).format(new Date(utcIsoString));
}

/**
 * Human-readable booking range for My Bookings list.
 *
 * @example
 * formatBookingRangeForDisplay('2026-07-10T04:30:00.000Z', '2026-07-10T08:30:00.000Z')
 * // => 'Fri, 10 Jul 2026 · 10:00 am – 2:00 pm IST'
 */
export function formatBookingRangeForDisplay(bookingFromUtc, bookingToUtc) {
  const datePart = formatUtcForIstDisplay(bookingFromUtc, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const startTime = formatUtcForIstDisplay(bookingFromUtc, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const endTime = formatUtcForIstDisplay(bookingToUtc, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart} · ${startTime} – ${endTime} IST`;
}

/**
 * Hour number (0–23) as 12-hour label for slot buttons.
 *
 * @example
 * formatHourAsAmPm(14)
 * // => '2:00 PM'
 */
export function formatHourAsAmPm(hourIn24Format) {
  const suffix = hourIn24Format >= 12 ? 'PM' : 'AM';
  const hourIn12Format = hourIn24Format % 12 === 0 ? 12 : hourIn24Format % 12;
  return `${hourIn12Format}:00 ${suffix}`;
}
