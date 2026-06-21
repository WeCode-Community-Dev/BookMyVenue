import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js"
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js"
import { ForbiddenError } from "../../../../domain/errors/forbidden.error.js"

export class RejectBookingUsecase {

    constructor(
        bookingRepository
    ) {

        this._bookingRepository =
            bookingRepository

    }

    async execute({

        bookingId,

        ownerId

    }) {

        const booking =

            await this._bookingRepository
                .findById(bookingId)

        if (!booking) {

            throw new NotFoundError(

                BookingMessages.error.BOOKING_NOT_FOUND

            )

        }

        if (booking.ownerId.toString() !== ownerId) {

            throw new ForbiddenError(

                BookingMessages.error.FORBIDDEN

            )

        }

        booking.reject()

        const updatedBooking =

            await this._bookingRepository
                .update(

                    booking.id,

                    booking

                )

        return updatedBooking

    }

}