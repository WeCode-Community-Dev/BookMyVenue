import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

export class AdminBookingController {

    constructor(
        adminGetAllBookingsUsecase,
        adminGetBookingByIdUsecase,
        adminGetBookingStatisticsUsecase
    ) {

        this._adminGetAllBookingsUsecase =
            adminGetAllBookingsUsecase;

        this._adminGetBookingByIdUsecase =
            adminGetBookingByIdUsecase;

        this._adminGetBookingStatisticsUsecase =
            adminGetBookingStatisticsUsecase;

    }

    getAllBookings = asyncHandler(

        async (req, res) => {

            const {

                search,

                status,

                paymentStatus,

                page,

                limit,

                sortBy,

                bookingDate

            } = req.validatedQuery;

            const result =
                await this
                    ._adminGetAllBookingsUsecase
                    .execute(

                        search,

                        status,

                        paymentStatus,

                        page,

                        limit,

                        sortBy,

                        bookingDate

                    );

            return sendSuccess(

                res,

                statusCode.OK,

                "",

                result

            );

        }

    );

    getBookingById = asyncHandler(

        async (req, res) => {

            const booking =
                await this
                    ._adminGetBookingByIdUsecase
                    .execute(
                        req.params.bookingId
                    );

            return sendSuccess(

                res,

                statusCode.OK,

                "",

                booking

            );

        }

    );

    getBookingStatistics = asyncHandler(

        async (req, res) => {

            const statistics =
                await this
                    ._adminGetBookingStatisticsUsecase
                    .execute();

            return sendSuccess(

                res,

                statusCode.OK,

                "",

                statistics

            );

        }

    );

}