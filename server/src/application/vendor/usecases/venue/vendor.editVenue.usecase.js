import { VenueStatus } from "../../../../domain/enums/Venue.enum.js"
import { AppError } from "../../../../domain/errors/app.error.js"
import { statusCode } from "../../../../shared/constants/enums/statusCode.js"
import { VenueMessages } from "../../../../shared/constants/messages/venueMessages.js"

export class VendorEditVenueUsecase  {
    constructor (
        VenueRepository
    )  {
        this._venueRepository = VenueRepository
    }

    async execute({ 
        venueId,
        ownerId,
        name,
        description,
        category,
        websiteUrl,
        addressLine1,
        city,
        state,
        country,
        phone,
        pincode,
        googleMapLink,
        seatingCapacity = 0,
        standingCapacity = 0,
        pricePerHour = 0,
        pricePerDay = 0,
        securityDeposit = 0,
        availabilityRules = {},
        weekendSurcharge = 0,
        minimumBookingHours = 0,
        amenities = [],
        images = [],
    }) {
            const venue = await this._venueRepository.findById(venueId)
            if(!venue){
                throw new AppError(VenueMessages.error.VENUE_NOT_FOUND, statusCode.NOT_FOUND)
            }
            console.log('venue from usecase', venue)
            console.log('userId', ownerId)
            if(venue.ownerId !== ownerId){
                throw new AppError(VenueMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
            }

            if(venue.isDeleted){
                throw new AppError(VenueMessages.error.CANNOT_UPDATE_DELETED_VENUE, statusCode.BAD_REQUEST)
            }
            if(venue.status !== VenueStatus.ACTIVE && venue.status !== VenueStatus.DRAFT){
                throw new AppError(VenueMessages.error.CANNOT_UPDATE_INACTIVE_VENUE, statusCode.BAD_REQUEST)
            }

            venue.name = name
            venue.description = description
            venue.category = category
            venue.websiteUrl = websiteUrl
            venue.addressLine1 = addressLine1
            venue.city = city
            venue.state = state
            venue.country = country
            venue.pincode = pincode
            venue.phone = phone
            venue.googleMapLink = googleMapLink
            venue.seatingCapacity = seatingCapacity
            venue.standingCapacity = standingCapacity
            venue.pricePerDay = pricePerDay
            venue.pricePerHour = pricePerHour
            venue.securityDeposit = securityDeposit
            venue.availabilityRules = availabilityRules
            venue.weekendSurcharge = weekendSurcharge
            venue.minimumBookingHours = minimumBookingHours
            venue.amenities = amenities
            venue.images = images

            return await this._venueRepository.update(venue.id, venue)
        }
}