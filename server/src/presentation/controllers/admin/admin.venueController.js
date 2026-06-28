import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

export class AdminVenueController {

    constructor(
        adminGetAllVenuesUsecase,
        adminGetVenueByIdUsecase,
        adminApproveVenueUsecase,
        adminRejectVenueUsecase,
        adminUpdateVenueBlockStatusUsecase
    ) {

        this._adminGetAllVenuesUsecase =
            adminGetAllVenuesUsecase;

        this._adminGetVenueByIdUsecase =
            adminGetVenueByIdUsecase;

        this._adminApproveVenueUsecase =
            adminApproveVenueUsecase;

        this._adminRejectVenueUsecase =
            adminRejectVenueUsecase;

        this._adminUpdateVenueBlockStatusUsecase =
            adminUpdateVenueBlockStatusUsecase;
    }

    getAllVenues = asyncHandler(

        async (req, res) => {

            const {

                search,
                category,
                approvalStatus,
                isBlocked,
                page,
                limit

            } = req.validatedQuery;

            const result =
                await this
                    ._adminGetAllVenuesUsecase
                    .execute(
                        search,
                        category,
                        approvalStatus,
                        isBlocked,
                        page,
                        limit
                    );

            return sendSuccess(
                res,
                statusCode.OK,
                "",
                result
            );

        }

    );

    getVenueById = asyncHandler(

        async (req, res) => {

            const venue =
                await this
                    ._adminGetVenueByIdUsecase
                    .execute(
                        req.params.venueId
                    );

            return sendSuccess(
                res,
                statusCode.OK,
                "",
                venue
            );

        }

    );

    approveVenue = asyncHandler(

        async (req, res) => {

            const venue =
                await this
                    ._adminApproveVenueUsecase
                    .execute(
                        req.params.venueId
                    );

            return sendSuccess(
                res,
                statusCode.OK,
                "",
                venue
            );

        }

    );

    rejectVenue = asyncHandler(

        async (req, res) => {

            const venue =
                await this
                    ._adminRejectVenueUsecase
                    .execute(
                        req.params.venueId,
                        req.body.reason
                    );

            return sendSuccess(
                res,
                statusCode.OK,
                "",
                venue
            );

        }

    );

    updateBlockStatus = asyncHandler(

        async (req, res) => {

            const venue =
                await this
                    ._adminUpdateVenueBlockStatusUsecase
                    .execute({

                        venueId:
                            req.params.venueId,

                        isBlocked:
                            req.body.isBlocked

                    });

            return sendSuccess(
                res,
                statusCode.OK,
                "",
                venue
            );

        }

    );

}