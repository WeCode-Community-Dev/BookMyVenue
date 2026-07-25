import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

export class UserAccountController {

    constructor(userUpdateAccountStatusUsecase){
        this._userUpdateAccountStatusUsecase =
            userUpdateAccountStatusUsecase;
    }

    updateAccountStatus = asyncHandler(async(req,res)=>{

        const userId = req.user.userId;

        const { isActive } = req.body;

        const updatedUser =
            await this._userUpdateAccountStatusUsecase.execute(
                userId,
                isActive
            );

        return sendSuccess(
            res,
            statusCode.OK,
            "Account status updated successfully",
            updatedUser
        );
    });

}