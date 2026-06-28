import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";

export class UserRemoveProfileImageUsecase{

    constructor(userRepository){
        this._userRepository=userRepository;
    }

    async execute(userId){

        const user=await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError("User not found");
        }

        if(user.isBlocked){
            throw new ValidationError("Blocked users cannot remove profile image");
        }

        if(!user.profileImage){
            throw new ValidationError("No profile image found");
        }

        return await this._userRepository.removeProfileImage(userId);
    }
}