import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

export class VendorDashboardController {
  constructor(getDashboardStatsUsecase) {
    this._getDashboardStatsUsecase = getDashboardStatsUsecase;
  }

  getDashboard = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;

    const dashboard = await this._getDashboardStatsUsecase.execute(ownerId);

    return sendSuccess(
      res,

      statusCode.OK,

      "Dashboard fetched successfully",

      dashboard
    );
  });
}
