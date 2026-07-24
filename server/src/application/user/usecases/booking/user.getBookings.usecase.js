
import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";

export class UserGetBookingsUsecase {

    constructor(bookingRepository) {
        this._bookingRepository = bookingRepository;
    }

    async execute(
        userId,
        page,
        limit,
        status,
        search,
        sortBy
    ) {

        return await this._bookingRepository.getUserBookings(
            userId,
            {
                page,
                limit,
                status,
                search,
                sortBy
            }
        );

    }

}