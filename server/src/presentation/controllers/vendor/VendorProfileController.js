import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";
import { VendorMessages } from "../../../shared/constants/messages/vendorMessages.js";

export class VendorProfileController {
  constructor(
    GetVendorProfileUsecase,
    UpdateVendorProfileUsecase,
    ChangeVendorPasswordUsecase
  ) {
    this._getVendorProfileUsecase = GetVendorProfileUsecase;

    this._updateVendorProfileUsecase = UpdateVendorProfileUsecase;

    this._changeVendorPasswordUsecase = ChangeVendorPasswordUsecase;
  }

  getProfile = asyncHandler(async (req, res) => {
    const vendorId = req.user.id;
    const vendor = await this._getVendorProfileUsecase.execute(vendorId);

    return sendSuccess(
      res,
      statusCode.OK,
      VendorMessages.success.PROFILE_FETCHED,
      vendor
    );
  });

  updateProfile = asyncHandler(async (req, res) => {
    const vendorId = req.user.id;
    const vendor = await this._updateVendorProfileUsecase.execute({
      vendorId,

      ...req.body,
    });

    return sendSuccess(
      res,
      statusCode.OK,
      VendorMessages.success.PROFILE_UPDATED,
      vendor
    );
  });

  changePassword = asyncHandler(async (req, res) => {
    const vendorId = "6a58e836080d38065f2fe547";

    await this._changeVendorPasswordUsecase.execute({
      vendorId,

      ...req.body,
    });

    return sendSuccess(
      res,

      statusCode.OK,

      VendorMessages.success.PASSWORD_CHANGED
    );
  });
}
