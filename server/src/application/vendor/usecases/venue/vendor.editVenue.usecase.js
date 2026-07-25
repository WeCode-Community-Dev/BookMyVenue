import { VenueStatus } from "../../../../domain/enums/Venue.enum.js"
import { VenueMessages } from "../../../../shared/constants/messages/venueMessages.js"
import { NotFoundError } from '../../../../domain/errors/NotFoundError.js'
import { ConflictError } from '../../../../domain/errors/ConflictError.js'
import { ForbiddenError } from '../../../../domain/errors/forbidden.error.js'
import { ValidationError } from '../../../../domain/errors/ValidationError.js'
import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js"
import { authMessages } from "../../../../shared/constants/messages/authMessages.js"


export class VendorEditVenueUsecase  {
    constructor (
        VenueRepository,
        cloudinaryService,
        vendorRepository,
    )  {
        this._venueRepository = VenueRepository
        this._cloudinaryService = cloudinaryService
        this._vendorRepository = vendorRepository
    }

    async execute({ 
        venueId,
        vendorId,
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
        newImages = [],
        newLicense = [],
        deletedImages = [],
        deletedLicense = []
    }) {
            const vendor = await this._vendorRepository.findById(vendorId)
            if(!vendor){
                throw new UnauthorizedError(authMessages.error.VENDOR_NOT_FOUND)
            }
            const venue = await this._venueRepository.findById(venueId)
            if(!venue){
                throw new NotFoundError(VenueMessages.error.VENUE_NOT_FOUND)
            }

            if(venue.vendorId.id.toString() !== vendorId){
                throw new ForbiddenError(VenueMessages.error.FORBIDDEN)
            }

            if(venue.isDeleted){
                throw new NotFoundError(VenueMessages.error.CANNOT_UPDATE_DELETED_VENUE)
            }
            if(venue.approvalStatus === VenueStatus.INACTIVE || venue.approvalStatus === VenueStatus.SUSPENDED){
                throw new ConflictError(VenueMessages.error.CANNOT_UPDATE_INACTIVE_VENUE)
            }

            const remainingImages = venue.images.filter(image => !deletedImages.includes(image.publicId))
            const remainingLicense = venue.license.filter(l => !deletedLicense.includes(l.publicId))
            const finalLicense = [...remainingLicense, ...newLicense]


            if(finalLicense.length === 0){
                throw new ValidationError(VenueMessages.error.VENUE_LICENSE_REQUIRED)
            }

            const finalImages = [...remainingImages, ...newImages]
            if(finalImages.length < 3){
                throw new ValidationError(VenueMessages.error.REQUIRE_ATLEAST_THREE_IMAGES)
            }

            venue.name = name
            venue.description = description
            venue.category = category
            venue.websiteUrl = websiteUrl
            venue.address.addressLine1 = addressLine1
            venue.address.city = city
            venue.address.state = state
            venue.address.country = country
            venue.address.pincode = pincode
            venue.address.phone = phone
            venue.address.googleMapLink = googleMapLink
            venue.seatingCapacity = seatingCapacity
            venue.standingCapacity = standingCapacity
            venue.pricePerDay = pricePerDay
            venue.pricePerHour = pricePerHour
            venue.securityDeposit = securityDeposit
            venue.availabilityRules = availabilityRules
            venue.weekendSurcharge = weekendSurcharge
            venue.minimumBookingHours = minimumBookingHours
            venue.amenities = amenities
            venue.images = [...remainingImages, ...newImages]
            venue.license = finalLicense

            const updatedVenue = await this._venueRepository.update(venue.id, venue)

            if(deletedImages.length){
                await this._cloudinaryService.deleteImages(deletedImages)
            }
            if(deletedLicense.length){
                await this._cloudinaryService.deleteImages(deletedLicense)
            }

            return updatedVenue
        }
}