import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ForbiddenError } from "../../../../domain/errors/forbidden.error.js";

export class AcceptBookingUsecase {
  constructor(bookingRepository, createNotificationUsecase) {
    this._bookingRepository = bookingRepository;
    this._createNotificationUsecase = createNotificationUsecase;
  }

  async execute({
    bookingId,

    ownerId,
  }) {
    const booking = await this._bookingRepository.findById(bookingId);

    console.log("booking :", booking);

    if (!booking) {
      throw new NotFoundError(BookingMessages.error.BOOKING_NOT_FOUND);
    }

    if (booking.ownerId.toString() !== ownerId) {
      throw new ForbiddenError(BookingMessages.error.FORBIDDEN);
    }

    booking.confirm();

    const updatedBooking = await this._bookingRepository.update(
      booking.id,

      booking
    );

    await this._createNotificationUsecase.execute({
      userId: booking.userId,

      title: "Booking Confirmed",

      message: "Your booking has been confirmed by the venue owner.",
    });

    return updatedBooking;
  }
}
