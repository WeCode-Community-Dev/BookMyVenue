import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";
import { VenueMessages } from "../../../../shared/constants/messages/venueMessages.js";

export class UserRemoveWishlistUsecase{

    constructor(userRepository,venueRepository){
        this._userRepository=userRepository;
        this._venueRepository=venueRepository;
    }

    async execute(userId,venueId){

        const user=await this._userRepository.findById(userId);

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

        const venue=await this._venueRepository.findById(venueId);

        if(!venue){
           throw new NotFoundError(
            VenueMessages.error.VENUE_NOT_FOUND
        );
        }

        const result=await this._userRepository.removeWishlist(
            userId,
            venueId
        );

        if(result?.notFound){
            throw new ValidationError(
            UserMessage.error.WISHLIST_NOT_FOUND
        );
        }

        return result;
    }
}