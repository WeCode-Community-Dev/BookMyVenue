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
        vendorLogoutUsecase,
    ) {
        this._registerVendorUseCase = registerVendorUseCase;
        this._loginVendorUseCase = loginVendorUseCase;
        this._verifyVendorRegisterOtp = verifyVendorRegisterOtp;
        this._resendVendorOtp = resendVendorOtpUsecase;
        this._refreshTokenUsecase = vendorRefreshTokenUsecase;
        this._forgotPasswordUsecase = vendorForgotPasswordUsecase;
        this._resetPasswordUseCase = vendorResetPasswordUsecase;
        this._logoutUseCase = vendorLogoutUsecase;
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
        const { accessToken, refreshToken, user } = await this._loginVendorUseCase.execute({...req.body});
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, '', { accessToken, user });
    });

    resendOtp = asyncHandler(async (req, res) => {
        await this._resendVendorOtp.execute({email: req.body.email});
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_RESENT);
    });

    refreshToken = asyncHandler(async (req, res) => {
        const token = req.cookies?.refreshToken;
        const { accessToken, refreshToken, vendor } = await this._refreshTokenUseCase.execute(token);
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.TOKEN_REFRESHED, { accessToken, vendor });
    });

    forgotPassword = asyncHandler(async (req, res) => {
        await this._forgotPasswordUsecase.execute({email: req.body.email});
        return sendSuccess(res, statusCode.OK, authMessages.success.FORGOT_PASSWORD);
    });

    resetPassword = asyncHandler(async (req, res) => {
        const { token, password } = req.body;
        await this._resetPasswordUseCase.execute(token, password);
        return sendSuccess(res, statusCode.OK, authMessages.success.RESET_PASSWORD);
    });

    logout = asyncHandler(async (req, res) => {
        const accessToken = req.headers.authorization?.split(' ')[1]
        const refreshToken = req.cookies?.refreshToken;
        await this._logoutUseCase.execute(refreshToken, accessToken);
        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.LOGOUT);
    });
}
