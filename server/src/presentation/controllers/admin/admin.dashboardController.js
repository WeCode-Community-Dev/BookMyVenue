import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

export class AdminDashboardController {
  constructor(adminDashboardStatisticsUsecase) {
    this._adminDashboardStatisticsUsecase =
      adminDashboardStatisticsUsecase;
  }

  getDashboardStatistics = asyncHandler(async (req, res) => {
    const statistics =
      await this._adminDashboardStatisticsUsecase.execute();

    return sendSuccess(
      res,
      statusCode.OK,
      "",
      statistics
    );
  });
}