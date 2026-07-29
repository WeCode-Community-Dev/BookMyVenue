import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";
import { VenueMessages } from "../../../../shared/constants/messages/venueMessages.js";

export class UserGetWishlistUsecase {

    constructor(userRepository){
        this._userRepository = userRepository;
    }

    async execute(userId){

        const user = await this._userRepository.findById(userId);

        if(!user){
           throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        );
        }

        if(user.isBlocked){
            throw new ValidationError(
            UserMessage.error.USER_ACCOUNT_BLOCKED
        );
        }

        const wishlist = await this._userRepository.getWishlist(userId);

        return wishlist.wishlist;
    }
}