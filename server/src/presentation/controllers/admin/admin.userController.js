import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";
import { UserMessage } from "../../../shared/constants/messages/userMessages.js";

export class AdminUserController {

    constructor(
        adminGetAllUsersUsecase,
        adminUpdateUserStatusUsecase,
    ){
        this._adminGetAllUsersUsecase = adminGetAllUsersUsecase,
        this._adminUpdateUserStatusUsecase = adminUpdateUserStatusUsecase
    }

    getAllUsers = asyncHandler(async(req,res) => {

        const {
            search ,
            isBlocked,
            page ,
            limit 
        } = req.validatedQuery;

        const { data, totalCount, totalPages } =
            await this._adminGetAllUsersUsecase.execute(
                search,
                isBlocked,
                page,
                limit
            )

        return sendSuccess(
            res,
            statusCode.OK,
            UserMessage.success.USERS_FETCHED,
            { data, totalCount, totalPages }
        )
    })

    updateUserStatus = asyncHandler(async(req,res) => {

        const { userId } = req.params;
        const { isBlocked } = req.body;

        const user =
            await this._adminUpdateUserStatusUsecase.execute(userId, isBlocked)

        return sendSuccess(
            res,
            statusCode.OK,
            isBlocked?UserMessage.success.USER_BLOCKED:UserMessage.success.USER_UNBLOCKED,
            user
        )
    })

}