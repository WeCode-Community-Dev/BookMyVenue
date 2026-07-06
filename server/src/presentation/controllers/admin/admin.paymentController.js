import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

export class AdminPaymentController {

    constructor(

        adminGetAllPaymentsUsecase,

        adminGetPaymentByIdUsecase,

        adminGetPaymentStatisticsUsecase

    ) {

        this._adminGetAllPaymentsUsecase =
            adminGetAllPaymentsUsecase;

        this._adminGetPaymentByIdUsecase =
            adminGetPaymentByIdUsecase;

        this._adminGetPaymentStatisticsUsecase =
            adminGetPaymentStatisticsUsecase;

    }

    getAllPayments = asyncHandler(

        async (req, res) => {

            const {

                search,
                paymentStatus,
                paymentMethod,
                paymentType,
                sortBy,
                page,
                limit

            } = req.validatedQuery;

            const result =
                await this
                    ._adminGetAllPaymentsUsecase
                    .execute(

                        search,
                        paymentStatus,
                        paymentMethod,
                        paymentType,
                        sortBy,
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

    getPaymentById = asyncHandler(

        async (req, res) => {

            const payment =
                await this
                    ._adminGetPaymentByIdUsecase
                    .execute(
                        req.params.paymentId
                    );

            return sendSuccess(

                res,

                statusCode.OK,

                "",

                payment

            );

        }

    );

    getPaymentStatistics = asyncHandler(

        async (req, res) => {

            const statistics =
                await this
                    ._adminGetPaymentStatisticsUsecase
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