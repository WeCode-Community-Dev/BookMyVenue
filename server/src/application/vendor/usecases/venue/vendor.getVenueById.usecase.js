import { AppError } from '../../../../domain/errors/app.error.js'
import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'
import { authMessages } from '../../../../shared/constants/messages/authMessages.js'
import { statusCode } from '../../../../shared/constants/enums/statusCode.js'


export class VendorGetVenueByIdUsecase {
    constructor (
        vendorRepository,
        // ownerRepository
    ) {
        this._vendorRepository = vendorRepository
        // this._ownerRepository = ownerRepository
    }

    async execute(ownerId, venueId) {
        // const owner = await this._ownerRepository.findById(ownerId)
        // if(!owner){
        //     throw new AppError(authMessages.error.OWNER_NOT_FOUND, statusCode.NOT_FOUND)
        // }
        console.log('from usecase venueid', venueId)
        const venue = await this._vendorRepository.findById(venueId)
        if(!venue){
            throw new AppError(VenueMessages.error.VENUE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(venue.isDeleted){
            throw new AppError(VenueMessages.error.DELETED_VENUE, statusCode.BAD_REQUEST)
        }
        return venue
    }
}