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
    let profileImage;
    if(req.file){
     profileImage = {
      publicId: req.file.filename,
      url: req.file.path,
    };}


    const vendor = await this._updateVendorProfileUsecase.execute({
      vendorId,profileImage,

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
    const vendorId = req.user.id;

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
