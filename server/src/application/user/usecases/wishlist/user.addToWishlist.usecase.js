import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { VenueStatus } from "../../../../domain/enums/Venue.enum.js";

export class UserAddToWishlistUsecase {

    constructor(userRepository, venueRepository){
        this._userRepository = userRepository;
        this._venueRepository = venueRepository;
    }

    async execute(userId, venueId){

        const user = await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError("User not found");
        }

        if(user.isBlocked){
            throw new ValidationError("User account is blocked");
        }

        const venue = await this._venueRepository.findById(venueId);

        if(!venue){
            throw new NotFoundError("Venue not found");
        }

        if(venue.isDeleted){
            throw new ValidationError("Venue is no longer available");
        }

        if(!venue.isAdminVerified){
            throw new ValidationError("Venue is not approved");
        }

        if(venue.status !== VenueStatus.ACTIVE){
            throw new ValidationError("Venue is currently unavailable");
        }

        const result = await this._userRepository.addToWishlist(
            userId,
            venueId
        );

        if(result?.alreadyExists){
            throw new ValidationError(
                "Venue already exists in wishlist"
            );
        }

        return result;
    }
}