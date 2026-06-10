import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'
import { NotFoundError } from '../../../../domain/errors/NotFoundError.js'
import { ForbiddenError } from '../../../../domain/errors/forbidden.error.js'

export class VendorDeleteVenueUsecase {
    constructor (
        venueRepository,
        // ownerRepository
    ) {
        this._venueRepository = venueRepository
        // this._ownerRepository = ownerRepository
    }

    async execute(ownerId, venueId) {
        // const owner = await this._ownerRepository.findById(ownerId)
        // if(!owner){
        //     throw new AppError(authMessages.error.OWNER_NOT_FOUND, statusCode.NOT_FOUND)
        // }
        const venue = await this._venueRepository.findById(venueId)
        if(!venue){
            throw new NotFoundError(VenueMessages.error.VENUE_NOT_FOUND)
        }
        if(venue.ownerId !== ownerId){
            throw new ForbiddenError(VenueMessages.error.FORBIDDEN)
        }

        if(venue.isDeleted){
            throw new NotFoundError(VenueMessages.error.VENUE_NOT_FOUND)
        }

        return await this._venueRepository.delete(venue.id)
    }
}