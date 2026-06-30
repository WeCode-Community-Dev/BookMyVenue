import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";

export class UserUpdateProfileUsecase{
    constructor(userRepository){
        this._userRepository=userRepository
    }
    async execute(userId,fullName,phone){
        const user=await this._userRepository.findById(userId)

        if(!user){
            throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        )
        }
        if(user.isBlocked){
            throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        )
        }
        const updatedUser=await this._userRepository.update(
            userId,
            {
                fullName,
                phone
            }
        )
        return updatedUser
    }
}