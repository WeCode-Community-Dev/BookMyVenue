import mongoose from 'mongoose';
import Availability from '@/models/availability.model';
import Booking from '@/models/booking.model';
import { BookingStatus } from '@/constants/booking';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';
import { IAvailability } from '@/types/availability.types';


export const validateVenueAvailability = async (
  venueId: string,
  startDateTime: Date,
  endDateTime: Date,
  session?: mongoose.ClientSession
): Promise<IAvailability> => {
  const now = new Date();

  //Basic cases
  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    throw new AppError('Invalid start or end date format', HTTP_STATUS.BAD_REQUEST);
  }
  if (startDateTime >= endDateTime) {
    throw new AppError('End date must be after the start date', HTTP_STATUS.BAD_REQUEST);
  }

  // 1. Past Date & Minimum Lead-Time (2 Hours)
  const minLeadTimeMs = 2 * 60 * 60 * 1000;
  if (startDateTime.getTime() - now.getTime() < minLeadTimeMs) {
    throw new AppError('Bookings must be placed at least 2 hours in advance', HTTP_STATUS.BAD_REQUEST);
  }

  // 2. Maximum Future Booking Window Horizon (365 Days)
  const maxFutureDate = new Date();
  maxFutureDate.setDate(maxFutureDate.getDate() + 365);
  if (startDateTime > maxFutureDate) {
    throw new AppError('Bookings cannot be placed more than 365 days in advance', HTTP_STATUS.BAD_REQUEST);
  }

  // 3. 15-Minute Slot Alignment Check (10:34 not valid)
  if (startDateTime.getMinutes() % 15 !== 0 || endDateTime.getMinutes() % 15 !== 0) {
    throw new AppError('Booking start and end times must align to 15-minute slot intervals', HTTP_STATUS.BAD_REQUEST);
  }

  // Fetch venue availability config
  const query =  Availability.findOne({ venueId });
  if (session) query.session(session);
  const availability = await query;

  if (!availability) {
    throw new AppError('Venue availability is not configured', HTTP_STATUS.NOT_FOUND);
  }

  // 4. Operating Days Validation (0 = Sunday, 6 = Saturday)
  if (availability.availableDays && availability.availableDays.length > 0) {
    const startDay = startDateTime.getDay();
    const endDay = endDateTime.getDay();
    if (!availability.availableDays.includes(startDay) || !availability.availableDays.includes(endDay)) {
      throw new AppError('Venue is closed on the selected operating day(s)', HTTP_STATUS.BAD_REQUEST);
    }
  }

  // 5. Operating Hours Validation (HH:mm format)
  if (availability.openingTime && availability.closingTime) {
    const startHHMM = startDateTime.toTimeString().slice(0, 5);
    const endHHMM = endDateTime.toTimeString().slice(0, 5);

    if (startHHMM < availability.openingTime || endHHMM > availability.closingTime) {
      throw new AppError(
        `Venue operates strictly between ${availability.openingTime} and ${availability.closingTime}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  // 6. Min / Max Booking Duration Validation
  const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

  if (availability.minBookingDuration && durationHours < availability.minBookingDuration) {
    throw new AppError(
      `Minimum booking duration for this venue is ${availability.minBookingDuration} hour(s)`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (availability.maxBookingDuration && durationHours > availability.maxBookingDuration) {
    throw new AppError(
      `Maximum booking duration for this venue is ${availability.maxBookingDuration} hour(s)`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // 7. Blackout Dates Validation
  if (availability.blackoutDates && availability.blackoutDates.length > 0) {
    const isBlackedOut = availability.blackoutDates.some((b: any) => {
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      return startDateTime.getTime() < bEnd && endDateTime.getTime() > bStart;
    });

    if (isBlackedOut) {
      throw new AppError('Venue is unavailable due to a scheduled blackout period', HTTP_STATUS.BAD_REQUEST);
    }
  }

  // 8. Turnaround Buffer Time & Overlap Validation
  const bufferMs = (availability.bufferTime || 0) * 60 * 1000;
  const bufferedStart = new Date(startDateTime.getTime() - bufferMs);
  const bufferedEnd = new Date(endDateTime.getTime() + bufferMs);

  const overlapQuery = Booking.findOne({
    venue: venueId,
    bookingStatus: { $in: [BookingStatus.RESERVED, BookingStatus.CONFIRMED] },
    startDateTime: { $lt: bufferedEnd },
    endDateTime: { $gt: bufferedStart },
  });

  if (session) overlapQuery.session(session);

  const overlappingBooking = await overlapQuery;
  if (overlappingBooking) {
    throw new AppError('Venue is already reserved or buffered during the requested time slot', HTTP_STATUS.CONFLICT);
  }

  return availability;
};
