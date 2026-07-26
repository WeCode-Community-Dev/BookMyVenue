import { VenueStatus } from "../../../../domain/enums/Venue.enum.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { ConflictError } from "../../../../domain/errors/ConflictError.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";

import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";

export class UserReserveBookingUsecase {
  constructor(bookingRepository, venueRepository, reservationService) {
    this._bookingRepository = bookingRepository;
    this._venueRepository = venueRepository;
    this._reservationService = reservationService;
  }

  async execute(userId, bookingData) {
    let  {
      venueId,
      bookingDate,
      startTime,
      endTime,
      guestCount,
      bookingType,
    } = bookingData;

    // ===== Venue validation =====
    const venue = await this._venueRepository.findById(venueId);
    if (!venue) throw new NotFoundError(BookingMessages.error.VENUE_NOT_FOUND);
    if (venue.isDeleted) throw new ValidationError(BookingMessages.error.VENUE_DELETED);
    if (venue.isBlocked) throw new ValidationError(BookingMessages.error.VENUE_BLOCKED);
    if (venue.approvalStatus !== VenueStatus.ACTIVE) {
      throw new ValidationError(BookingMessages.error.VENUE_NOT_APPROVED);
    }

    // ===== Date validation =====
    if (!bookingDate) throw new ValidationError(BookingMessages.error.BOOKING_DATE_REQUIRED);

    const today = new Date();
    const selectedDate = new Date(bookingDate);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      throw new ValidationError(BookingMessages.error.BOOKING_DATE_INVALID);
    }

    let bookingDuration = 0;

    // ===== Time validation only for hourly bookings =====
    if (bookingType === "hourly") {
      if (!startTime || !endTime) {
        throw new ValidationError(BookingMessages.error.BOOKING_TIME_REQUIRED);
      }

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const bookingStartMinutes = startHour * 60 + startMinute;
      const bookingEndMinutes = endHour * 60 + endMinute;

      const currentDate = new Date();
      const isToday = currentDate.toDateString() === selectedDate.toDateString();

      if (isToday) {
        const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
        if (bookingStartMinutes <= currentMinutes) {
          throw new ValidationError(BookingMessages.error.BOOKING_TIME_INVALID);
        }
      }

      // Venue open/close validation
      const [openHour, openMinute] = venue.availabilityRules.openTime.split(":").map(Number);
      const [closeHour, closeMinute] = venue.availabilityRules.closeTime.split(":").map(Number);

      const venueOpenMinutes = openHour * 60 + openMinute;
      const venueCloseMinutes = closeHour * 60 + closeMinute;

      if (
        bookingStartMinutes < venueOpenMinutes ||
        bookingEndMinutes > venueCloseMinutes ||
        bookingStartMinutes >= bookingEndMinutes
      ) {
        throw new ValidationError(BookingMessages.error.BOOKING_TIME_INVALID);
      }

      bookingDuration = (bookingEndMinutes - bookingStartMinutes) / 60;
      if (bookingDuration < venue.minimumBookingHours) {
        throw new ValidationError(BookingMessages.error.MINIMUM_BOOKING_HOURS);
      }
    } else if (bookingType === "daily") {
      startTime="00:00";
      endTime="23:59";
      bookingDuration=24;
    } else {
      throw new ValidationError(BookingMessages.error.INVALID_BOOKING_TYPE);
    }

    // ===== Closed days validation =====
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    if (venue.availabilityRules.closedDays.includes(dayName)) {
      throw new ValidationError(BookingMessages.error.VENUE_CLOSED);
    }

    // ===== Capacity validation =====
    const maxCapacity = Math.max(venue.seatingCapacity, venue.standingCapacity);
    if (guestCount > maxCapacity) {
      throw new ValidationError(BookingMessages.error.CAPACITY_EXCEEDED);
    }

    // ===== Overlap check =====
    const hasOverlappingBooking = await this._bookingRepository.hasOverlappingBooking(
      venueId,
      selectedDate,
      startTime,
      endTime
    );
    if (hasOverlappingBooking) {
      throw new ConflictError(BookingMessages.error.SLOT_ALREADY_BOOKED);
    }

    // ===== Temporary reservation check =====
    
const reservationKey = `reservation:${venueId}:${bookingDate}`;

    const reservations = await this._reservationService.getReservation(reservationKey);
    if (reservations && reservations.length > 0) {
      const hasOverlappingReservation = reservations.some(
        (reservation) => reservation.startTime < endTime && reservation.endTime > startTime
      );
      if (hasOverlappingReservation) {
        throw new ConflictError(BookingMessages.error.SLOT_TEMPORARILY_RESERVED);
      }
    }

    // ===== Pricing =====
    let bookingAmount;
    if (bookingType === "hourly") {
      bookingAmount = bookingDuration * venue.pricePerHour;
    } else {
      bookingAmount = venue.pricePerDay;
    }

    const bookingDay = selectedDate.getDay();
    const isWeekend = bookingDay === 0 || bookingDay === 6;
    const weekendCharge = isWeekend ? venue.weekendSurcharge || 0 : 0;
    const securityDeposit = venue.securityDeposit || 0;

    const totalAmount = bookingAmount + weekendCharge + securityDeposit;

    // Advance payment calculation
    const hoursDifference = (selectedDate - today) / (1000 * 60 * 60);
    let advanceAmount;
    let remainingAmount;

    if (hoursDifference > 72) {
      advanceAmount = Math.round(totalAmount * 0.2);
      remainingAmount = totalAmount - advanceAmount;
    } else {
      advanceAmount = totalAmount;
      remainingAmount = 0;
    }

    const reservationId = this._reservationService.generateReservationId();
    const expiresAt = new Date(Date.now() + 600 * 1000);

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

    const reservationList = reservations || [];
    reservationList.push(reservationData);

    await this._reservationService.reserveSlot(reservationKey, reservationList, 600);

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
