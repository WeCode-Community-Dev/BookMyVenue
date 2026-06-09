import { AppError } from '../../../../domain/errors/app.error.js'
import { authMessages } from '../../../../shared/constants/messages/authMessages.js'
import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'
import { statusCode } from '../../../../shared/constants/enums/statusCode.js'


export class VendorUpdateVenueStatusUsecase {
    constructor (
        venueRepository,
        ownerRepository
    ) {
        this._venueRepository = venueRepository
        this._ownerRepository = ownerRepository
    }

    async execute({ownerId, venueId, status}) {
        // const owner = await this._ownerRepository.findById(ownerId)
        // if(!owner){
        //     throw new AppError(authMessages.error.OWNER_NOT_FOUND, statusCode.NOT_FOUND)
        // }
        const venue = await this._venueRepository.findById(venueId)
        if(!venue){
            throw new AppError(VenueMessages.error.VENUE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(venue.ownerId !== ownerId) {
            throw new AppError(VenueMessages.error.UNAUTHORIZED, statusCode.FORBIDDEN)
        }
        console.log('FROM STATUS: ', ownerId, venueId, status)
        if(venue.isDeleted){
            throw new AppError(VenueMessages.error.DELETED_VENUE, statusCode.BAD_REQUEST)
        }
        if(venue.status === status) {
            throw new AppError(VenueMessages.error.STATUS_ALREADY_SET, statusCode.BAD_REQUEST)
        }
        venue.status = status
        return await this._venueRepository.update(venue.id, venue)
    }
}