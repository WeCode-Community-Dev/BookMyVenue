import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

export class UserBookingController {

    constructor(
        userReserveBookingUsecase
    ) {
        this._userReserveBookingUsecase = userReserveBookingUsecase;
    }

    reserveBooking = asyncHandler(async (req, res) => {

    const userId = req.user.userId;

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

}