import * as repo from './owner.repository';
import * as service from './owner.service';
import type { IBooking } from '../booking/booking.types';

export async function getVenueAvailabilityCalendarWorkflow(venueId: string): Promise<{
  bookedDates: string[];
  blockedDates: string[];
  workingDays: unknown;
  temporaryBlockAfterDate: string | null;
  inactivityBlockedAfterDate: string | null;
} | null> {
  const venue = await repo.getVenueBlockedDatesAndWorkingDays(venueId);
  if (!venue) {
    return null;
  }

  const dateThreshold = service.getDateThreshold(30);

  const bookings = await repo.getConfirmedBookingsAfterDate(venueId, dateThreshold);

  const bookedDates = [...new Set(bookings.map((b: IBooking) => b.date))];

  // Blocked dates - YYYY-MM-DD strings
  const blockedDates = venue.blockedDates.map((d: Date) => new Date(d).toISOString().split('T')[0]);

  const toDateStr = (d: Date | undefined | null): string | null => {
    if (!d) return null;
    const date = new Date(d);
    return date.toISOString().split('T')[0];
  };

  return {
    bookedDates,
    blockedDates,
    workingDays: venue.workingDays,
    temporaryBlockAfterDate: toDateStr(venue.temporaryBlockAfterDate),
    inactivityBlockedAfterDate: toDateStr(venue.inactivity?.blockedAfterDate),
  };
}
