import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";

export class UserRemoveProfileImageUsecase{

    constructor(userRepository){
        this._userRepository=userRepository;
    }

    async execute(userId){

        const user=await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        );
        }

        if(user.isBlocked){
            throw new ValidationError(
            UserMessage.error.USER_BLOCKED_REMOVE_PROFILE_IMAGE
        );
        }

        if(!user.profileImage){
            throw new ValidationError(
            UserMessage.error.PROFILE_IMAGE_NOT_FOUND
        );
        }

        return await this._userRepository.removeProfileImage(userId);
    }
}