import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";

export class UserUpdateAccountStatusUsecase {

    constructor(userRepository){
        this._userRepository = userRepository;
    }

    async execute(userId, isActive){

        const user = await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError("User not found");
        }

        if(user.isBlocked){
            throw new ValidationError(
                "Blocked users cannot update account status"
            );
        }

        if(user.isActive === isActive){
            throw new ValidationError(
                isActive
                    ? "Account is already active"
                    : "Account is already inactive"
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