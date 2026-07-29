import { VenueStatus } from '../../../../domain/enums/Venue.enum.js'
import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'
import { NotFoundError } from '../../../../domain/errors/NotFoundError.js'
import { ForbiddenError } from '../../../../domain/errors/forbidden.error.js'


export class UserGetVenueByIdUsecase {
    constructor (
        venueRepository
    ) {
        this._venueRepository = venueRepository
    }

    async execute(venueId){
        const venue = await this._venueRepository.findById(venueId)
        if(!venue){
            throw new NotFoundError(VenueMessages.error.VENUE_NOT_FOUND)
        }
        if(venue.isDeleted){
            throw new NotFoundError(VenueMessages.error.VENUE_NOT_FOUND)
        }
        if(venue.approvalStatus !== VenueStatus.ACTIVE){
            throw new ForbiddenError(VenueMessages.error.NOT_ACTIVE_VENUE)
        }
        return venue
    }
    
}