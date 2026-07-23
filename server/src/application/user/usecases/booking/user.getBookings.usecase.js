import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";

export class UserGetBookingsUsecase {
    constructor(bookingRepository) {
        this._bookingRepository = bookingRepository;
    }

    async execute(userId) {

        const bookings =
            await this._bookingRepository.getUserBookings(userId);

        if (!bookings || bookings.length === 0) {
            throw new NotFoundError(
                BookingMessages.error.BOOKINGS_NOT_FOUND
            );
        }

        return bookings;
    }
}