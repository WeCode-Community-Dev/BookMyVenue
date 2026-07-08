import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class VendorAuthController {
    constructor(
        registerVendorUseCase, 
        loginVendorUseCase
    ) {
        this._registerVendorUseCase = registerVendorUseCase;
        this._loginVendorUseCase = loginVendorUseCase;
    }

    register = asyncHandler(async (req, res) => {
        const vendor = await this._registerVendorUseCase.execute({...req.body});
        return sendSuccess(res, statusCode.CREATED, '', vendor);
    });

    login = asyncHandler(async (req, res) => {
        const { accessToken, refreshToken, vendor } = await this._loginVendorUseCase.execute({...req.body});
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
        return sendSuccess(res, statusCode.OK, '', { accessToken, vendor });
    });
}
