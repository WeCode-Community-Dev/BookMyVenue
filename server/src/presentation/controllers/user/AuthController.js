import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class AuthController {
    constructor(
        registerUserUseCase,
        loginUserUseCase,
        logoutUseCase,
        refreshTokenUseCase
    ) {
        this._registerUserUseCase = registerUserUseCase;
        this._loginUserUseCase = loginUserUseCase;
        this._logoutUseCase = logoutUseCase;
        this._refreshTokenUseCase = refreshTokenUseCase;
    }

    register = asyncHandler(async (req, res) => {
        const user = await this._registerUserUseCase.execute(req.body);
        return sendSuccess(res, statusCode.CREATED, "User registered successfully", user);
    });

    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } =
            await this._loginUserUseCase.execute(email, password);

        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, "Login successful", { accessToken, user });
    });

    refreshToken = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        const { accessToken, refreshToken: newRefreshToken } =
            await this._refreshTokenUseCase.execute(refreshToken);

        res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, "Token refreshed", { accessToken });
    });

    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        await this._logoutUseCase.execute(refreshToken);

        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, "Logged out successfully");
    });
}
