import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../shared/constants/messages/authMessages.js";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bookmyvenue.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

export class AuthController {
    constructor(
        registerUserUseCase,
        loginUserUseCase,
        logoutUseCase,
        refreshTokenUseCase,
        verifyOtpUseCase,
        resendOtpUseCase,
        forgotPasswordUseCase,
        resetPasswordUseCase,
        tokenService
    ) {
        this._registerUserUseCase = registerUserUseCase;
        this._loginUserUseCase = loginUserUseCase;
        this._logoutUseCase = logoutUseCase;
        this._refreshTokenUseCase = refreshTokenUseCase;
        this._verifyOtpUseCase = verifyOtpUseCase;
        this._resendOtpUseCase = resendOtpUseCase;
        this._forgotPasswordUseCase = forgotPasswordUseCase;
        this._resetPasswordUseCase = resetPasswordUseCase;
        this._tokenService = tokenService;
    }

    register = asyncHandler(async (req, res) => {
        const user = await this._registerUserUseCase.execute(req.body);
        return sendSuccess(res, statusCode.CREATED, authMessages.success.REGISTERED, {
            email: user.email,
            isOtpVerified: user.isOtpVerified
        });
    });

    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } =
            await this._loginUserUseCase.execute(email, password);
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.LOGIN, { accessToken, user });
    });

    refreshToken = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        const { accessToken, refreshToken: newRefreshToken } =
            await this._refreshTokenUseCase.execute(refreshToken);
        res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.TOKEN_REFRESHED, { accessToken });
    });

    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.body;
        const result = await this._forgotPasswordUseCase.execute(email);
        return sendSuccess(res, statusCode.OK, authMessages.success.FORGOT_PASSWORD, result);
    });

    resetPassword = asyncHandler(async (req, res) => {
        const { email, resetToken, newPassword } = req.body;
        const result = await this._resetPasswordUseCase.execute(email, resetToken, newPassword);
        return sendSuccess(res, statusCode.OK, authMessages.success.RESET_PASSWORD, { email: result.email });
    });

    forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await this._forgotPasswordUseCase.execute(email);

    return sendSuccess(
        res,
        statusCode.OK,
        "Password reset link sent successfully.",
        result
    );
});

resetPassword = asyncHandler(async (req, res) => {
    const { email, resetToken, newPassword } = req.body;

    const result = await this._resetPasswordUseCase.execute(
        email,
        resetToken,
        newPassword
    );

    return sendSuccess(
        res,
        statusCode.OK,
        result.message,
        {
            email: result.email
        }
    );
});

    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        await this._logoutUseCase.execute(refreshToken);
        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.LOGOUT);
    });

    verifyOtp = asyncHandler(async (req, res) => {
        const { email, otpCode } = req.body;
        await this._verifyOtpUseCase.execute(email, otpCode);
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_VERIFIED);
    });

    resendOtp = asyncHandler(async (req, res) => {
        const { email } = req.body;
        const result = await this._resendOtpUseCase.execute(email);
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_RESENT, result);
    });

    // Called after passport verifies the Google token — req.user is set by passport
    googleAuthCallback = asyncHandler(async (req, res) => {
        const user = req.user;

        const payload = { id: user.id, role: user.role };
        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        await req.userRepository?.updateRefreshToken(user.id, refreshToken);

        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

        // Redirect to frontend with token in query param
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/success?accessToken=${accessToken}`;
        return res.redirect(redirectUrl);
    });

    verifyOtp = asyncHandler(async (req, res) => {
        const { email, otpCode } = req.body;

        await this._verifyOtpUseCase.execute(email, otpCode);

        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_VERIFIED);
    });

    resendOtp = asyncHandler(async (req, res) => {
        const { email } = req.body;

        const result = await this._resendOtpUseCase.execute(email);

        return sendSuccess(res, statusCode.OK, "OTP resent successfully. Check your email.", result);
    });

    adminLogin = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            throw new UnauthorizedError(authMessages.error.INVALID_ADMIN_CREDENTIALS);
        }
        const payload = { userId: "admin", role: "ADMIN" };
        const accessToken = this._tokenService.generateAccessToken(payload);
        const refreshToken = this._tokenService.generateRefreshToken(payload);
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.ADMIN_LOGIN, {
            accessToken,
            user: { id: "admin", email: ADMIN_EMAIL, role: "ADMIN" }
        });
    });

    // TODO: Google Auth - temporarily disabled
    // googleAuthCallback = asyncHandler(async (req, res) => { ... });
}
