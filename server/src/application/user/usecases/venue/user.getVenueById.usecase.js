import { VenueStatus } from '../../../../domain/enums/Venue.enum.js'
import { AppError } from '../../../../domain/errors/app.error.js'
import { statusCode } from '../../../../shared/constants/enums/statusCode.js'
import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'


export class UserGetVenueByIdUsecase {
    constructor (
        venueRepository
    ) {
        this._venueRepository = venueRepository
    }

    async execute(venueId){
        const venue = await this._venueRepository.findById(venueId)
        if(!venue){
            throw new AppError(VenueMessages.error.VENUE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(venue.isDeleted){
            throw new AppError(VenueMessages.error.DELETED_VENUE, statusCode.BAD_REQUEST)
        }
        if(venue.status !== VenueStatus.ACTIVE){
            throw new AppError(VenueMessages.error.NOT_ACTIVE_VENUE, statusCode.BAD_REQUEST)
        }
        if(!venue.isAdminVerified){
            throw new AppError(VenueMessages.error.NOT_ADMIN_VERIFIED, statusCode.BAD_REQUEST)
        }
        return venue
    }
    
}