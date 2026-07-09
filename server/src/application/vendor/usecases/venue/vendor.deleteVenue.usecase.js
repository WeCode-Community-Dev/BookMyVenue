import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'
import { NotFoundError } from '../../../../domain/errors/NotFoundError.js'
import { ForbiddenError } from '../../../../domain/errors/forbidden.error.js'
import { UnauthorizedError } from '../../../../domain/errors/UnauthorizedError.js'
import { authMessages } from '../../../../shared/constants/messages/authMessages.js'

export class VendorDeleteVenueUsecase {
    constructor (
        venueRepository,
        vendorRepository
    ) {
        this._venueRepository = venueRepository
        this._vendorRepository = vendorRepository
    }

    async execute(vendorId, venueId) {
        const vendor = await this._vendorRepository.findById(vendorId)
        if(!vendor){
            throw new UnauthorizedError(authMessages.error.VENDOR_NOT_FOUND)
        }
        const venue = await this._venueRepository.findById(venueId)
        if(!venue){
            throw new NotFoundError(VenueMessages.error.VENUE_NOT_FOUND)
        }
        if(venue.vendorId !== vendorId){
            throw new ForbiddenError(VenueMessages.error.FORBIDDEN)
        }

        if(venue.isDeleted){
            throw new NotFoundError(VenueMessages.error.VENUE_NOT_FOUND)
        }

        return await this._venueRepository.delete(venue.id)
    }
}