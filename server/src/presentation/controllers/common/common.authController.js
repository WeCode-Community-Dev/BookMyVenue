import { statusCode } from "../../../shared/constants/enums/statusCode.js"
import { sendSuccess } from "../../../shared/utils/apiResponse.js"
import { asyncHandler } from "../../../shared/utils/asyncHandler.js"

export class UnifiedAuthController {
    constructor (
       getMeUsecase
    ) {
       this._getMeUsecase = getMeUsecase
    }

    getMe = asyncHandler ( async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        console.log("from unified: ", refreshToken)
        const {accessToken, user} = await this._getMeUsecase.execute(refreshToken)
        return sendSuccess(res, statusCode.OK, '', { accessToken, user})
    })
}