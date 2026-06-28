import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";

export class UserGetWishlistUsecase {

    constructor(userRepository){
        this._userRepository = userRepository;
    }

    async execute(userId){

        const user = await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError("User not found");
        }

        if(user.isBlocked){
            throw new ValidationError("User account is blocked");
        }

        const wishlist = await this._userRepository.getWishlist(userId);

        return wishlist.wishlist;
    }
}