import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";
import { UserMessage } from "../../../shared/constants/messages/userMessages.js";

export class AdminUserController {

    constructor(
        adminGetAllUsersUsecase,
        adminBlockUserUsecase,
        adminUnblockUserUsecase
    ){
        this._adminGetAllUsersUsecase = adminGetAllUsersUsecase
        this._adminBlockUserUsecase = adminBlockUserUsecase
        this._adminUnblockUserUsecase = adminUnblockUserUsecase
    }

    getAllUsers = asyncHandler(async(req,res) => {

        const {
            search = '',
            page = 1,
            limit = 10
        } = req.query

        const { data, totalCount, totalPages } =
            await this._adminGetAllUsersUsecase.execute(
                search,
                Number(page),
                Number(limit)
            )

        return sendSuccess(
            res,
            statusCode.OK,
            UserMessage.success.USERS_FETCHED,
            { data, totalCount, totalPages }
        )
    })

    blockUser = asyncHandler(async(req,res) => {

        const { userId } = req.params

        const user =
            await this._adminBlockUserUsecase.execute(userId)

        return sendSuccess(
            res,
            statusCode.OK,
            UserMessage.success.USER_BLOCKED,
            user
        )
    })

    unblockUser = asyncHandler(async(req,res) => {

        const { userId } = req.params

        const user =
            await this._adminUnblockUserUsecase.execute(userId)

        return sendSuccess(
            res,
            statusCode.OK,
            UserMessage.success.USER_UNBLOCKED,
            user
        )
    })
}