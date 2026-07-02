import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";

export class UserUpdateAccountStatusUsecase {

    constructor(userRepository){
        this._userRepository = userRepository;
    }

    async execute(userId, isActive){

        const user = await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        );
        }

        if(user.isBlocked){
            throw new ValidationError(
            UserMessage.error.USER_BLOCKED_UPDATE_ACCOUNT_STATUS
        );
        }

        if(user.isActive === isActive){
            throw new ValidationError(
                isActive
                    ? UserMessage.error.ACCOUNT_ALREADY_ACTIVE
                    : UserMessage.error.ACCOUNT_ALREADY_INACTIVE
            );
        }

        const updatedUser =
            await this._userRepository.updateAccountStatus(
                userId,
                isActive
            );

        return updatedUser;
    }
}