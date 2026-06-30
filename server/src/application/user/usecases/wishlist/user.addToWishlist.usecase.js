import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { VenueStatus } from "../../../../domain/enums/Venue.enum.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";
import { VenueMessages } from "../../../../shared/constants/messages/venueMessages.js";

export class UserAddToWishlistUsecase {

    constructor(userRepository, venueRepository){
        this._userRepository = userRepository;
        this._venueRepository = venueRepository;
    }

    async execute(userId, venueId){

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

        const venue = await this._venueRepository.findById(venueId);

        if(!venue){
            throw new NotFoundError(
            VenueMessages.error.VENUE_NOT_FOUND
        );
        }

        if(venue.isDeleted){
            throw new NotFoundError(
            VenueMessages.error.VENUE_NOT_FOUND
        );
        }

        if(!venue.isAdminVerified){
            throw new ValidationError(
            VenueMessages.error.NOT_ADMIN_VERIFIED
        );
        }

        if(venue.status !== VenueStatus.ACTIVE){
            throw new ValidationError(
            VenueMessages.error.NOT_ACTIVE_VENUE
        );
        }

        const result = await this._userRepository.addToWishlist(
            userId,
            venueId
        );

        if(result?.alreadyExists){
            throw new ValidationError(
            UserMessage.error.WISHLIST_ALREADY_EXISTS
        );;
        }

        return result;
    }
}