import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'
import { BookingMessages } from '../../../shared/constants/messages/bookingMessages.js'

export class VendorBookingController {

    constructor(
        getVendorBookingsUsecase,
        getBookingByIdUsecase
    ) {

        this._getVendorBookingsUsecase =
            getVendorBookingsUsecase
        this._getBookingByIdUsecase =
            getBookingByIdUsecase

    }

    getBookings = asyncHandler(

        async (req, res) => {

            const ownerId = req.user.id;

            const bookings =
                await this._getVendorBookingsUsecase
                    .execute({ownerId, ...req.query})
            return sendSuccess(
                res,
                statusCode.OK,
                BookingMessages.success.BOOKINGS_FETCHED,
                bookings
            )
        }
    )


    getBookingById = asyncHandler(

        async (req, res) => {
            const { bookingId } = req.params

            const ownerId = req.user.id;

                const booking =
                await this._getBookingByIdUsecase
                    .execute({bookingId, ownerId})
            return sendSuccess(
                res,
                statusCode.OK,
                BookingMessages.success.BOOKING_FETCHED,
                booking
            )
        }
    )
}