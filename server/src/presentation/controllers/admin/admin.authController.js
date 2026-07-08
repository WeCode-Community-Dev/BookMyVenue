import { statusCode } from "../../../shared/constants/enums/statusCode";
import { sendSuccess } from "../../../shared/utils/apiResponse";
import { asyncHandler } from "../../../shared/utils/asyncHandler"


const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class AdminAuthController {
    constructor (
        adminLoginUsecase
    ) {
        this._loginusecase = adminLoginUsecase
    }

    login = asyncHandler ( async (req, res) => {
        const { accessToken, refreshToken, admin } = await this._loginUsecase.execute({...req.body});
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, '', { accessToken, admin });
    })
}