import { statusCode } from "../../../shared/constants/enums/statusCode.js";
import { authMessages } from "../../../shared/constants/messages/authMessages.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js"


const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class AdminAuthController {
    constructor (
        adminLoginUsecase,
        adminLogoutUsecase,
        adminRefreshToken,
    ) {
        this._loginusecase = adminLoginUsecase;
        this._logoutUsecase = adminLogoutUsecase;
        this._refreshTokenUseCase = adminRefreshToken;
    }

    login = asyncHandler ( async (req, res) => {
        const { accessToken, refreshToken, admin } = await this._loginUsecase.execute({...req.body});
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, '', { accessToken, admin });
    })

    refreshToken = asyncHandler(async (req, res) => {
        const token = req.cookies?.refreshToken;
        const { accessToken, refreshToken } = await this._refreshTokenUseCase.execute(token);
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.TOKEN_REFRESHED, { accessToken });
    });

    logout = asyncHandler(async (req, res) => {
        const accessToken = req.headers.authorization?.split(' ')[1]
        const refreshToken = req.cookies?.refreshToken;
        await this._logoutUseCase.execute(refreshToken, accessToken);
        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.LOGOUT);
    });
}