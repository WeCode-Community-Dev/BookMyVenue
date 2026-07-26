import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";



export class UserBookingController {

    constructor(
        userReserveBookingUsecase,
        userConfirmBookingUsecase,
        userGetBookingsUsecase,
        userGetBookingByIdUsecase,
         userCancelBookingUsecase
    ) {
        this._userReserveBookingUsecase = userReserveBookingUsecase;
        this._userConfirmBookingUsecase = userConfirmBookingUsecase;
         this._userGetBookingsUsecase = userGetBookingsUsecase;
        this._userGetBookingByIdUsecase = userGetBookingByIdUsecase;
         this._userCancelBookingUsecase = userCancelBookingUsecase;
    }

    reserveBooking = asyncHandler(async (req, res) => {

       const userId = req.user.id;
        const result =
            await this._userReserveBookingUsecase.execute(
                userId,
                req.body
            );

        return sendSuccess(
            res,
            statusCode.CREATED,
            "Booking reserved successfully.",
            result
        );

    });

    confirmBooking = asyncHandler(async (req, res) => {

        const result =
            await this._userConfirmBookingUsecase.execute({
                reservationId: req.body.reservationId,
                venueId: req.body.venueId,
                bookingDate: req.body.bookingDate
            });

        return sendSuccess(
            res,
            statusCode.OK,
            "Booking confirmed successfully.",
            result
        );

    });
    
    getBookings = asyncHandler(async (req, res) => {

        const userId = req.user.id;

        const {
            page,
            limit,
            status,
            search,
            sortBy
        } = req.query;

        const result =
            await this._userGetBookingsUsecase.execute(
                userId,
                Number(page) || 1,
                Number(limit) || 10,
                status,
                search,
                sortBy
            );

        return sendSuccess(
            res,
            statusCode.OK,
            "Bookings fetched successfully.",
            result
        );

    });
    getBookingById = asyncHandler(async (req, res) => {

        const userId = req.user.id;


        const { bookingId } = req.params;

        const result =
            await this._userGetBookingByIdUsecase.execute(
                userId,
                bookingId
            );

        return sendSuccess(
            res,
            statusCode.OK,
            "Booking fetched successfully.",
            result
        );

    });
   
    cancelBooking = asyncHandler(async (req, res) => {

        const userId = req.user.id;

        const { bookingId } = req.params;

        const { cancellationReason } = req.body;

        const result =
            await this._userCancelBookingUsecase.execute(
                userId,
                bookingId,
                cancellationReason
            );

        return sendSuccess(
            res,
            statusCode.OK,
            "Booking cancelled successfully.",
            result
        );

    });

}