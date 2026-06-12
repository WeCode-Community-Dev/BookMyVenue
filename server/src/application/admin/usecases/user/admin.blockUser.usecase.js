import { AppError } from "../../../../domain/errors/app.error.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { statusCode } from "../../../../shared/constants/enums/statusCode.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";
import { UserEntity } from "../../../../domain/entities/User.js";
import { ConflictError } from "../../../../domain/errors/ConflictError.js";


export class AdminBlockUserUsecase {
    constructor(userRepository){
        this._userRepository = userRepository;
    }

    async execute(userId){
        const user = await this._userRepository.findById(userId);
        if(!user){
            throw new NotFoundError(UserMessage.error.USER_NOT_FOUND);
        }
        if(user.isBlocked) {
            throw new ConflictError(UserMessage.error.USER_ALREADY_BLOCKED,statusCode.BAD_REQUEST);
        }
        const blockedUser = await this._userRepository.unblockUser(userId);
        return blockedUser;
    }
}