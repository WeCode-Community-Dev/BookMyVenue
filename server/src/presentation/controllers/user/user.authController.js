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
        console.log("access:", accessToken)
        console.log("refresh:", refreshToken)
        console.log("user:", user)
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.LOGIN, { accessToken, user });
    });

    refreshToken = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        const { accessToken, refreshToken: newRefreshToken } =await this._refreshTokenUseCase.execute(refreshToken);
        res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.TOKEN_REFRESHED, { accessToken });
    });

    forgotPassword = asyncHandler(async (req, res) => {
        const result = await this._forgotPasswordUseCase.execute(req.body);
        return sendSuccess(res, statusCode.OK, authMessages.success.FORGOT_PASSWORD, result);
    });

    resetPassword = asyncHandler(async (req, res) => {
        const { email, resetToken, newPassword } = req.body;
        const result = await this._resetPasswordUseCase.execute(email, resetToken, newPassword);
        return sendSuccess(res, statusCode.OK, authMessages.success.RESET_PASSWORD, { email: result.email });
    });

    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        await this._logoutUseCase.execute(refreshToken);
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

    // Called after passport verifies the Google token — req.user is set by passport
    // googleAuthCallback = asyncHandler(async (req, res) => {
    //     const user = req.user;

    //     const payload = { id: user.id, role: user.role };
    //     const accessToken = TokenService.generateAccessToken(payload);
    //     const refreshToken = TokenService.generateRefreshToken(payload);

    //     await req.userRepository?.updateRefreshToken(user.id, refreshToken);

    //     res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    //     // Redirect to frontend with token in query param
    //     const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/success?accessToken=${accessToken}`;
    //     return res.redirect(redirectUrl);
    // });


    // adminLogin = asyncHandler(async (req, res) => {
    //     const { email, password } = req.body;
    //     if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    //         throw new UnauthorizedError(authMessages.error.INVALID_ADMIN_CREDENTIALS);
    //     }
    //     const payload = { userId: "admin", role: "ADMIN" };
    //     const accessToken = this._tokenService.generateAccessToken(payload);
    //     const refreshToken = this._tokenService.generateRefreshToken(payload);
    //     res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    //     return sendSuccess(res, statusCode.OK, authMessages.success.ADMIN_LOGIN, {
    //         accessToken,
    //         user: { id: "admin", email: ADMIN_EMAIL, role: "ADMIN" }
    //     });
    // });

    // TODO: Google Auth - temporarily disabled
    // googleAuthCallback = asyncHandler(async (req, res) => { ... });
}
