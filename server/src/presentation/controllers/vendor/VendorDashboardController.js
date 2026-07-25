import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

export class VendorDashboardController {
  constructor(getDashboardStatsUsecase) {
    this._getDashboardStatsUsecase = getDashboardStatsUsecase;
  }

  getDashboard = asyncHandler(async (req, res) => {
    //const vendorId = req.user.id;
        const vendorId = '6a2d96f9bd24251e9e502c04';


    const dashboard = await this._getDashboardStatsUsecase.execute(vendorId);

    return sendSuccess(
      res,

      statusCode.OK,

      "Dashboard fetched successfully",

      dashboard
    );
  });
}
