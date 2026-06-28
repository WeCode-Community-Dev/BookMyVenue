import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";


export class UserUpdateProfileUsecase{
    constructor(userRepository){
        this._userRepository=userRepository
    }
    async execute(userId,fullName,phone){
        const user=await this._userRepository.findById(userId)

        if(!user){
            throw new NotFoundError("User not found")
        }
        if(user.isBlocked){
            throw new NotFoundError("User Account is blocked")
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