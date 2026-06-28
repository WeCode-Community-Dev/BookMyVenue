import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";

export class UserGetProfileUsecase{
    constructor(userRepository){
        this._userRepository=userRepository
    }
    async execute(userId){
        const user=await this._userRepository.findById(userId)

        if(!user){
            throw new NotFoundError("User Not Found")
        }

        if(user.isBlocked){
            throw new NotFoundError("User account is blocked")
        }

        return user
    }
}