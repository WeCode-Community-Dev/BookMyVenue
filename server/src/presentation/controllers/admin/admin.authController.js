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
        console.log("login usecase: ", this._loginusecase)
        const { accessToken, refreshToken, user } = await this._loginusecase.execute({...req.body});
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, '', { accessToken, user });
    })

    refreshToken = asyncHandler(async (req, res) => {
        const token = req.cookies?.refreshToken;
        const { accessToken, refreshToken, user } = await this._refreshTokenUseCase.execute(token);
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.TOKEN_REFRESHED, { accessToken, user });
    });

    logout = asyncHandler(async (req, res) => {
        const accessToken = req.headers.authorization?.split(' ')[1]
        const refreshToken = req.cookies?.refreshToken;
        await this._logoutUsecase.execute(refreshToken, accessToken);
        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, authMessages.success.LOGOUT);
    });
}