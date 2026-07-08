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

export class UserAuthController {
    constructor(
        registerUserUseCase,
        loginUserUseCase,
        logoutUseCase,
        refreshTokenUseCase,
        verifyOtpUseCase,
        resendOtpUseCase,
        forgotPasswordUseCase,
        resetPasswordUseCase,
    ) {
        this._registerUserUseCase = registerUserUseCase;
        this._loginUserUseCase = loginUserUseCase;
        this._logoutUseCase = logoutUseCase;
        this._refreshTokenUseCase = refreshTokenUseCase;
        this._verifyOtpUseCase = verifyOtpUseCase;
        this._resendOtpUseCase = resendOtpUseCase;
        this._forgotPasswordUseCase = forgotPasswordUseCase;
        this._resetPasswordUseCase = resetPasswordUseCase;
    }

    register = asyncHandler(async (req, res) => {
        await this._registerUserUseCase.execute({...req.body});
        return sendSuccess(res, statusCode.CREATED, authMessages.success.REGISTERED);
    });

    login = asyncHandler(async (req, res) => {
        const { accessToken, refreshToken, user } = await this._loginUserUseCase.execute({...req.body});
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.LOGIN, { accessToken, user });
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

    logout = asyncHandler(async (req, res) => {
        const accessToken = req.headers.authorization?.split(' ')[1]
        const refreshToken = req.cookies?.refreshToken;
        await this._logoutUseCase.execute(refreshToken, accessToken);
        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.LOGOUT);
    });

    verifyOtp = asyncHandler(async (req, res) => {
        await this._verifyOtpUseCase.execute({...req.body});
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_VERIFIED);
    });

    resendOtp = asyncHandler(async (req, res) => {
        await this._resendOtpUseCase.execute({email: req.body.email});
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_RESENT);
    });
}
