import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";

export class UserGetBookingByIdUsecase {
    constructor(bookingRepository) {
        this._bookingRepository = bookingRepository;
    }

    async execute(userId, bookingId) {

        const booking =
            await this._bookingRepository.getUserBookingById(
                userId,
                bookingId
            );

        if (!booking) {
            throw new NotFoundError(
                BookingMessages.error.BOOKING_NOT_FOUND
            );
        }

        return booking;
    }
}