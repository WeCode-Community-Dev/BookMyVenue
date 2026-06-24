import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ForbiddenError } from "../../../../domain/errors/forbidden.error.js";

export class RejectBookingUsecase {
  constructor(bookingRepository, createNotificationUsecase) {
    this._bookingRepository = bookingRepository;
    this._createNotificationUsecase = createNotificationUsecase;
  }

  async execute({ bookingId, ownerId, reason }) {
    const booking = await this._bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError(BookingMessages.error.BOOKING_NOT_FOUND);
    }

    if (booking.ownerId.toString() !== ownerId) {
      throw new ForbiddenError(BookingMessages.error.FORBIDDEN);
    }

    booking.reject(reason);

    const updatedBooking = await this._bookingRepository.update(
      booking.id,

      booking
    );

    await this._createNotificationUsecase.execute({
      userId: booking.userId,

      title: "Booking Rejected",

      message: `Your booking has been rejected. Reason: ${reason}`,
    });

    return updatedBooking;
  }
}
