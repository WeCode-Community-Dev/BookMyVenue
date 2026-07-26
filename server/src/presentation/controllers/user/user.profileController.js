import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";
// import { ValidationError } from "../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../shared/constants/messages/userMessages.js";

export class UserProfileController {
  constructor(
    userGetProfileUsecase,
    userUpdateProfileUsecase,
    requestEmailChangeOtpUsecase,
    verifyEmailChangeOtpUsecase,
    resendEmailChangeOtpUsecase,
    userUpdateProfileImageUsecase,
    userRemoveProfileImageUsecase,
    userChangePasswordUsecase
  ) {
    this._userGetProfileUsecase = userGetProfileUsecase;
    this._userUpdateProfileUsecase = userUpdateProfileUsecase;
    this._requestEmailChangeOtpUsecase = requestEmailChangeOtpUsecase;
    this._verifyEmailChangeOtpUsecase = verifyEmailChangeOtpUsecase;
    this._resendEmailChangeOtpUsecase = resendEmailChangeOtpUsecase;
    this._userUpdateProfileImageUsecase = userUpdateProfileImageUsecase;
    this._userRemoveProfileImageUsecase = userRemoveProfileImageUsecase;
    this._userChangePasswordUsecase = userChangePasswordUsecase;
  }

  getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    // const userId = "6a5c82d2a4cb28be7d10521f";

    const user = await this._userGetProfileUsecase.execute(userId);

    return sendSuccess(
      res,
      statusCode.OK,
      UserMessage.success.PROFILE_FETCHED,
      user
    );
  });

  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { fullName, phone } = req.body;
    const updatedUser = await this._userUpdateProfileUsecase.execute(
      userId,
      fullName,
      phone
    );

    return sendSuccess(
      res,
      statusCode.OK,
      UserMessage.success.PROFILE_UPDATED,
      updatedUser
    );
  });

  requestEmailChangeOtp = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { newEmail } = req.body;
    const result = await this._requestEmailChangeOtpUsecase.execute(
      userId,
      newEmail
    );
    return sendSuccess(res, statusCode.OK, result.message);
  });

  verifyEmailChangeOtp = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { otp } = req.body;
    const updatedUser = await this._verifyEmailChangeOtpUsecase.execute(
      userId,
      otp
    );

    return sendSuccess(
      res,
      statusCode.OK,
      UserMessage.success.EMAIL_UPDATED,
      updatedUser
    );
  });
  
  resendEmailChangeOtp = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await this._resendEmailChangeOtpUsecase.execute(userId);

    return sendSuccess(
      res,
      statusCode.OK,
      UserMessage.success.PROFILE_FETCHED,
    );
  });
  
  
  
  updateProfileImage = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profileImage = {
      publicId: req.file.filename,
      url: req.file.path,
    };
    const updatedUser = await this._userUpdateProfileImageUsecase.execute(
      userId,
      profileImage
    );

    return sendSuccess(
      res,
      statusCode.OK,
      UserMessage.success.PROFILE_IMAGE_UPDATED,
      updatedUser
    );
  });

  removeProfileImage = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const updatedUser = await this._userRemoveProfileImageUsecase.execute(
      userId
    );

    return sendSuccess(
      res,
      statusCode.OK,
      UserMessage.success.PROFILE_IMAGE_REMOVED,
      updatedUser
    );
  });

  changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await this._userChangePasswordUsecase.execute({ userId, ...req.body });
    return sendSuccess(
      res,
      statusCode.OK,
      UserMessage.success.PASSWORD_CHANGED
    );
  });
}
