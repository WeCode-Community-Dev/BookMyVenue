import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'
import { NotFoundError } from '../../../../domain/errors/NotFoundError.js'
import { UnauthorizedError } from '../../../../domain/errors/UnauthorizedError.js'
import { authMessages } from '../../../../shared/constants/messages/authMessages.js'


export class VendorGetVenueByIdUsecase {
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
        if(venue.isDeleted){
            throw new NotFoundError(VenueMessages.error.DELETED_VENUE)
        }
        return venue
    }
}