import { fetchActiveConflicts } from '../booking/booking.repository';

/**
 * Fetches all active time-slot conflicts (Locks + confirmed Bookings)
 * for a given venue and date.
 *
 * Delegates to `booking.repository.fetchActiveConflicts` which is the
 * single source of truth for this query, shared by both the availability
 * check and the webhook collision re-check.
 */
export const fetchConflictsForDate = async (
  venueId: string,
  date: string
): Promise<{ start: number; end: number }[]> => {
  return fetchActiveConflicts(venueId, date);
};
