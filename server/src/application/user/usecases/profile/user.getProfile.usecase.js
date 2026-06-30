import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";

export class UserGetProfileUsecase{
    constructor(userRepository){
        this._userRepository=userRepository
    }
    async execute(userId){
        const user=await this._userRepository.findById(userId)

        if(!user){
            throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        )
        }

        if(user.isBlocked){
            throw new NotFoundError(
            UserMessage.error.USER_ACCOUNT_BLOCKED
        )
        }

        return user
    }
}