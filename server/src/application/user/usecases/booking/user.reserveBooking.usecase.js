
import { VenueStatus } from "../../../../domain/enums/Venue.enum.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { ConflictError } from "../../../../domain/errors/ConflictError.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";

import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";

const CLEANING_BUFFER_HOURS = 1;

export class UserReserveBookingUsecase {
  constructor(bookingRepository, venueRepository, reservationService) {
    this._bookingRepository = bookingRepository;
    this._venueRepository = venueRepository;
    this._reservationService = reservationService;
  }

  async execute(userId, bookingData) {
    let {
      venueId,
      bookingDate,
      startTime,
      endTime,
      guestCount,
      bookingType,
    } = bookingData;

    // ===== Venue validation =====
    const venue = await this._venueRepository.findById(venueId);

    if (!venue) {
      throw new NotFoundError(
        BookingMessages.error.VENUE_NOT_FOUND
      );
    }

    if (venue.isDeleted) {
      throw new ValidationError(
        BookingMessages.error.VENUE_DELETED
      );
    }

    if (venue.isBlocked) {
      throw new ValidationError(
        BookingMessages.error.VENUE_BLOCKED
      );
    }

    if (venue.approvalStatus !== VenueStatus.ACTIVE) {
      throw new ValidationError(
        BookingMessages.error.VENUE_NOT_APPROVED
      );
    }

    // ===== Date validation =====
    if (!bookingDate) {
      throw new ValidationError(
        BookingMessages.error.BOOKING_DATE_REQUIRED
      );
    }

    const today = new Date();

    const todayUTC = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
      )
    );

    const selectedDate = new Date(
      `${bookingDate}T00:00:00.000Z`
    );

    if (selectedDate < todayUTC) {
      throw new ValidationError(
        BookingMessages.error.BOOKING_DATE_INVALID
      );
    }

    let bookingDuration = 0;

    // ===== Time validation for hourly bookings =====
    if (bookingType === "hourly") {
      if (!startTime || !endTime) {
        throw new ValidationError(
          BookingMessages.error.BOOKING_TIME_REQUIRED
        );
      }

      const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const bookingStartMinutes = timeToMinutes(startTime);
      const bookingEndMinutes = timeToMinutes(endTime);

      // ===== Validate booking duration =====
      bookingDuration =
        (bookingEndMinutes - bookingStartMinutes) / 60;

      if (bookingStartMinutes >= bookingEndMinutes) {
        throw new ValidationError(
          BookingMessages.error.BOOKING_TIME_INVALID
        );
      }

      if (
        bookingDuration <
        venue.minimumBookingHours
      ) {
        throw new ValidationError(
          BookingMessages.error.MINIMUM_BOOKING_HOURS
        );
      }

      // ===== Venue open/close validation =====
      const venueOpenMinutes = timeToMinutes(
        venue.availabilityRules.openTime
      );

      const venueCloseMinutes = timeToMinutes(
        venue.availabilityRules.closeTime
      );

      if (
        bookingStartMinutes < venueOpenMinutes ||
        bookingEndMinutes > venueCloseMinutes
      ) {
        throw new ValidationError(
          BookingMessages.error.BOOKING_TIME_INVALID
        );
      }

      // ===== Today time validation =====
      const currentDate = new Date();

      const isToday =
        currentDate.getUTCFullYear() ===
          selectedDate.getUTCFullYear() &&
        currentDate.getUTCMonth() ===
          selectedDate.getUTCMonth() &&
        currentDate.getUTCDate() ===
          selectedDate.getUTCDate();

      if (isToday) {
        const currentMinutes =
          currentDate.getUTCHours() * 60 +
          currentDate.getUTCMinutes();

        if (bookingStartMinutes <= currentMinutes) {
          throw new ValidationError(
            BookingMessages.error.BOOKING_TIME_INVALID
          );
        }
      }

      // ===== Validate slot follows venue's slot pattern =====
      const slotSize =
        venue.minimumBookingHours * 60 +
        CLEANING_BUFFER_HOURS * 60;

      const offsetFromOpening =
        bookingStartMinutes - venueOpenMinutes;

      if (offsetFromOpening % slotSize !== 0) {
        throw new ValidationError(
          BookingMessages.error.BOOKING_TIME_INVALID
        );
      }
    } else if (bookingType === "daily") {
      startTime = "00:00";
      endTime = "23:59";
      bookingDuration = 24;
    } else {
      throw new ValidationError(
        BookingMessages.error.INVALID_BOOKING_TYPE
      );
    }

    // ===== Closed days validation =====
    const dayName = selectedDate.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        timeZone: "UTC",
      }
    );

    if (
      venue.availabilityRules.closedDays.includes(dayName)
    ) {
      throw new ValidationError(
        BookingMessages.error.VENUE_CLOSED
      );
    }

    // ===== Capacity validation =====
    const maxCapacity =
      (venue.seatingCapacity || 0) +
      (venue.standingCapacity || 0);

    if (guestCount > maxCapacity) {
      throw new ValidationError(
        BookingMessages.error.CAPACITY_EXCEEDED
      );
    }

    // ============================================================
    // ===== Existing DB booking overlap + cleaning buffer =====
    // ============================================================

    const hasOverlappingBooking =
      await this._bookingRepository.hasOverlappingBooking(
        venueId,
        selectedDate,
        startTime,
        endTime
      );

    if (hasOverlappingBooking) {
      throw new ConflictError(
        BookingMessages.error.SLOT_ALREADY_BOOKED
      );
    }

    // ============================================================
    // ===== Temporary Redis reservation overlap + buffer =====
    // ============================================================

    const reservationKey =
      `reservation:${venueId}:${bookingDate}`;

    const reservations =
      await this._reservationService.getReservation(
        reservationKey
      );

    if (
      reservations &&
      reservations.length > 0
    ) {
      const timeToMinutes = (time) => {
        const [hours, minutes] =
          time.split(":").map(Number);

        return hours * 60 + minutes;
      };

      const newStart =
        timeToMinutes(startTime);

      const newEnd =
        timeToMinutes(endTime);

      const hasOverlappingReservation =
        reservations.some((reservation) => {
          if (
            !reservation.startTime ||
            !reservation.endTime
          ) {
            return false;
          }

          const existingStart =
            timeToMinutes(
              reservation.startTime
            );

          const existingEnd =
            timeToMinutes(
              reservation.endTime
            );

          const protectedExistingEnd =
            existingEnd +
            CLEANING_BUFFER_HOURS * 60;

          return (
            newStart < protectedExistingEnd &&
            newEnd > existingStart
          );
        });

      if (hasOverlappingReservation) {
        throw new ConflictError(
          BookingMessages.error.SLOT_TEMPORARILY_RESERVED
        );
      }
    }

    // ===== Pricing =====
    let bookingAmount;

    if (bookingType === "hourly") {
      bookingAmount =
        bookingDuration * venue.pricePerHour;
    } else {
      bookingAmount = venue.pricePerDay;
    }

    const bookingDay = selectedDate.getUTCDay();

    const isWeekend =
      bookingDay === 0 || bookingDay === 6;

    const weekendCharge =
      isWeekend
        ? venue.weekendSurcharge || 0
        : 0;

    const securityDeposit =
      venue.securityDeposit || 0;

    const totalAmount =
      bookingAmount +
      weekendCharge +
      securityDeposit;

    // ===== Advance payment calculation =====
    const hoursDifference =
      (selectedDate - todayUTC) /
      (1000 * 60 * 60);

    let advanceAmount;
    let remainingAmount;

    if (hoursDifference > 72) {
      advanceAmount =
        Math.round(totalAmount * 0.2);

      remainingAmount =
        totalAmount - advanceAmount;
    } else {
      advanceAmount = totalAmount;
      remainingAmount = 0;
    }

    // ===== Create temporary reservation =====
    const reservationId =
      this._reservationService.generateReservationId();

    const expiresAt =
      new Date(Date.now() + 600 * 1000);

    const reservationData = {
      reservationId,
      userId,
      venueId,
      bookingDate,
      startTime,
      endTime,
      guestCount,
      bookingType,
      totalAmount,
      advanceAmount,
      remainingAmount,
      expiresAt,
      vendorId: venue.vendorId,
    };

    const reservationList =
      reservations || [];

    reservationList.push(
      reservationData
    );

    await this._reservationService.reserveSlot(
      reservationKey,
      reservationList,
      600
    );

    return {
      reservationId,
      venueId,
      bookingDate,
      startTime,
      endTime,
      guestCount,
      bookingType,
      totalAmount,
      advanceAmount,
      remainingAmount,
      expiresAt,
    };
  }
}

