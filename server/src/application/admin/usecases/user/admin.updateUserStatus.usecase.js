import { AppError } from "../../../../domain/errors/app.error.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { statusCode } from "../../../../shared/constants/enums/statusCode.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";
import { UserEntity } from "../../../../domain/entities/User.js";

export class AdminUpdateUserStatusUsecase {
    constructor(userRepository){
        this._userRepository = userRepository;
    }

    async execute(userId, isBlocked){
        const user = await this._userRepository.findById(userId);
        if(!user){
            throw new NotFoundError(UserMessage.error.USER_NOT_FOUND);
        }
        const updatedUser = await this._userRepository.updateBlockStatus(userId, isBlocked);
        return updatedUser;
    }
}