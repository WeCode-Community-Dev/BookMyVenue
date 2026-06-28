import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";

export class UserRemoveWishlistUsecase{

    constructor(userRepository,venueRepository){
        this._userRepository=userRepository;
        this._venueRepository=venueRepository;
    }

    async execute(userId,venueId){

        const user=await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError("User not found");
        }

        if(user.isBlocked){
            throw new ValidationError("User account is blocked");
        }

        const venue=await this._venueRepository.findById(venueId);

        if(!venue){
            throw new NotFoundError("Venue not found");
        }

        const result=await this._userRepository.removeFromWishlist(
            userId,
            venueId
        );

        if(result?.notFound){
            throw new ValidationError(
                "Venue not found in wishlist"
            );
        }

        return result;
    }
}