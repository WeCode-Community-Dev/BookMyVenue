import { NotFoundError } from "../../../../domain/errors/NotFoundError.js"
import { authMessages } from "../../../../shared/constants/messages/authMessages.js"
import { VenueMessages } from "../../../../shared/constants/messages/venueMessages.js"

export class UserGetSimilarVenuesUsecase {
    constructor (
        venueRepository,
        userRepository
    ){
        this._venueRepository = venueRepository
        this._userRepository = userRepository
    }

    async execute(userId, venueId) {
        const user = await this._userRepository.findById(userId)
        if(!user){
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND)
        }

        const venue = await this._venueRepository.findById(venueId)
        if(!venue){
            throw new NotFoundError(VenueMessages.error.VENUE_NOT_FOUND)
        }

        const similarVenues = await this._venueRepository.findSimilarVenues(venue.id, venue.category)
        console.log("similar venues: ", similarVenues)
        return {
            similarVenues
        }
    }
}