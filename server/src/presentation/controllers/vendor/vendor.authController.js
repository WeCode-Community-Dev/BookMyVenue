import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";
import { authMessages } from "../../../shared/constants/messages/authMessages.js";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class VendorAuthController {
    constructor(
        registerVendorUseCase, 
        loginVendorUseCase,
        verifyVendorRegisterOtp,
        resendVendorOtpUsecase,
        vendorRefreshTokenUsecase,
        vendorForgotPasswordUsecase,
        vendorResetPasswordUsecase,
    ) {
        this._registerVendorUseCase = registerVendorUseCase;
        this._loginVendorUseCase = loginVendorUseCase;
        this._verifyVendorRegisterOtp = verifyVendorRegisterOtp;
        this._resendVendorOtp = resendVendorOtpUsecase;
        this._refreshTokenUsecase = vendorRefreshTokenUsecase;
        this._forgotPasswordUsecase = vendorForgotPasswordUsecase;
        this._resetPasswordUseCase = vendorResetPasswordUsecase;
    }

    register = asyncHandler(async (req, res) => {
        await this._registerVendorUseCase.execute({...req.body});
        return sendSuccess(res, statusCode.CREATED, '');
    });

    verifyOtp = asyncHandler(async (req, res) => {
        await this._verifyVendorRegisterOtp.execute({...req.body});
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_VERIFIED);
    });

    login = asyncHandler(async (req, res) => {
        const { accessToken, refreshToken, vendor } = await this._loginVendorUseCase.execute({...req.body});
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, '', { accessToken, vendor });
    });

    resendOtp = asyncHandler(async (req, res) => {
        await this.this._resendVendorOtp.execute({email: req.body.email});
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_RESENT);
    });

    refreshToken = asyncHandler(async (req, res) => {
        const token = req.cookies?.refreshToken;
        const { accessToken, refreshToken } = await this._refreshTokenUseCase.execute(token);
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.TOKEN_REFRESHED, { accessToken });
    });

    forgotPassword = asyncHandler(async (req, res) => {
        await this._forgotPasswordUseCase.execute({email: req.body.email});
        return sendSuccess(res, statusCode.OK, authMessages.success.FORGOT_PASSWORD);
    });

    resetPassword = asyncHandler(async (req, res) => {
        const { email, resetToken, newPassword } = req.body;
        await this._resetPasswordUseCase.execute(email, resetToken, newPassword);
        return sendSuccess(res, statusCode.OK, authMessages.success.RESET_PASSWORD);
    });
}
