import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";


export class UserUpdateProfileImageUsecase {

    constructor(userRepository){
        this._userRepository = userRepository;
    }

    async execute(userId, profileImage){

        const user = await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        );
        }

        if(user.isBlocked){
            throw new ValidationError(
            UserMessage.error.USER_BLOCKED_UPDATE_PROFILE_IMAGE
        );
        }

        if(!profileImage){
            throw new ValidationError(
            UserMessage.error.PROFILE_IMAGE_REQUIRED
        );
        }

        const updatedUser = await this._userRepository.updateProfileImage(
            userId,
            profileImage
        );

        return updatedUser;
    }
}