import { ApiError } from "../utils/ApiError.js";
import { toPublicBooking } from "../utils/bookingMapper.js";
import { bookingRepository } from "../repositories/bookingRepository.js";
import { venueRepository } from "../repositories/venueRepository.js";

function parseDate(value, fieldName) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, `Invalid ${fieldName} date`, "VALIDATION_ERROR");
  }

  return date;
}

function validateBookingWindow(bookingFrom, bookingTo) {
  const now = new Date();

  if (bookingTo <= bookingFrom) {
    throw new ApiError(400, "bookingTo must be after bookingFrom", "VALIDATION_ERROR");
  }

  if (bookingFrom < now) {
    throw new ApiError(400, "Cannot book in the past", "VALIDATION_ERROR");
  }
}

function calculateTotalPrice(pricePerHour, bookingFrom, bookingTo) {
  const MS_PER_SECOND = 1000;
  const SECONDS_PER_MINUTE = 60;
  const MINUTES_PER_HOUR = 60;
  const MS_PER_HOUR = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

  // .getTime() returns milliseconds since Unix epoch; difference = booking duration in ms.
  // Divide by ms in one hour to get billable hours, then multiply by venue price per hour.
  // now we are storing the duration in hours in the database, so we need to convert the duration to hours.
  const hours = (bookingTo.getTime() - bookingFrom.getTime()) / MS_PER_HOUR;
  return Number(pricePerHour) * hours;
}

export const bookingService = {
  async getVenueAvailability(venueId, fromRaw, toRaw) {
    const venue = await venueRepository.findById(venueId);

    if (!venue) {
      throw new ApiError(404, "Venue not found", "VENUE_NOT_FOUND");
    }

    const from = parseDate(fromRaw, "from");
    const to = parseDate(toRaw, "to");

    if (to <= from) {
      throw new ApiError(400, "to must be after from", "VALIDATION_ERROR");
    }

    const busyBookings = await bookingRepository.findConfirmedInRange(venueId, from, to);

    return {
      venueId,
      from,
      to,
      busySlots: busyBookings.map((booking) => ({
        bookingFrom: booking.bookingFrom,
        bookingTo: booking.bookingTo,
        status: booking.status,
      })),
    };
  },

  async createBooking(userId, { venueId, bookingFrom: fromRaw, bookingTo: toRaw }) {
    const venue = await venueRepository.findById(venueId);

    if (!venue) {
      throw new ApiError(404, "Venue not found", "VENUE_NOT_FOUND");
    }

    //bookingFrom and bookingTo are in the format of 2026-06-29T10:00:00.000Z,
    //need to convert them to Date objects and make sure they are in utc time (WORLD TIME).
    const bookingFrom = parseDate(fromRaw, "bookingFrom");
    const bookingTo = parseDate(toRaw, "bookingTo");

    validateBookingWindow(bookingFrom, bookingTo);

    const totalPrice = calculateTotalPrice(venue.pricePerHour, bookingFrom, bookingTo);

    const result = await bookingRepository.createInTransaction(venueId, userId, bookingFrom, bookingTo, totalPrice);

    if (result.conflict) {
      throw new ApiError(409, "Slot already booked", "SLOT_UNAVAILABLE");
    }

    return toPublicBooking(result.booking);
  },

  async listMyBookings(userId) {
    const bookings = await bookingRepository.findByUserId(userId);
    return bookings.map(toPublicBooking);
  },

  async cancelBooking(bookingId, userId) {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new ApiError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    if (booking.userId !== userId) {
      throw new ApiError(403, "You can only cancel your own bookings", "FORBIDDEN");
    }

    if (booking.status === "CANCELLED") {
      throw new ApiError(400, "Booking is already cancelled", "ALREADY_CANCELLED");
    }

    const updated = await bookingRepository.updateStatus(bookingId, "CANCELLED");
    return toPublicBooking(updated);
  },
};
