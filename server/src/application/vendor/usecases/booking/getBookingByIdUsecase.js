import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ForbiddenError } from "../../../../domain/errors/forbidden.error.js";

export class GetBookingByIdUsecase {
  constructor(bookingRepository) {
    this._bookingRepository = bookingRepository;
  }

  async execute({ bookingId, vendorId }) {
    const booking =
      await this._bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError(
        BookingMessages.error.BOOKING_NOT_FOUND
      );
    }

    // Get the actual vendor ID
    const bookingVendorId =
      booking.vendorId?.id ||
      booking.vendorId?._id ||
      booking.vendorId;

    // Compare both as strings
    if (
      bookingVendorId.toString() !==
      vendorId.toString()
    ) {
      throw new ForbiddenError(
        BookingMessages.error.FORBIDDEN
      );
    }

    return {
      booking: {
        id: booking._id,
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        guestCount: booking.guestCount,
        status: booking.status,
      },

      customer: {
        id: booking.userId._id,
        name: booking.userId.fullName,
        email: booking.userId.email,
        phone: booking.userId.phone,
      },

      venue: {
        id: booking.venueId._id,
        name: booking.venueId.name,
        category: booking.venueId.category,
        address: booking.venueId.address,
      },

      payment: {
        totalAmount: booking.totalAmount,
        advanceAmount: booking.advanceAmount,
        paidAmount: booking.paidAmount,
        remainingAmount: booking.remainingAmount,
        paymentStatus: booking.paymentStatus,
      },
    };
  }
}