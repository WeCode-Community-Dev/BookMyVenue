import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'
import { VenueEntity } from '../../../../domain/entities/Venue.js'
import { VenueStatus } from '../../../../domain/enums/Venue.enum.js'
import { ValidationError } from '../../../../domain/errors/ValidationError.js'
import { UnauthorizedError } from '../../../../domain/errors/UnauthorizedError.js'
import { ConflictError } from '../../../../domain/errors/ConflictError.js'
import { authMessages } from '../../../../shared/constants/messages/authMessages.js'
import { UserRole } from '../../../../domain/enums/UserRole.enum.js'

export class VendorCreateVenueUsecase {
    constructor (
        venueRepository,
        vendorRepository
    ) {
        this._venueRepository = venueRepository;
        this._vendorRepository = vendorRepository;
    }

    async execute({
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
        images = [],
        license = []

    }) {
        const vendor = await this._vendorRepository.findById(vendorId)
        if(!vendor){
            throw new UnauthorizedError(authMessages.error.OWNER_NOT_FOUND)
        }
        if(vendor.role !== UserRole.VENDOR){
            throw new UnauthorizedError(VenueMessages.error.CANNOT_ADD_VENUE)
        }
        const existing = await this._venueRepository.findByVendorAndName(vendorId, name)
        if(existing){
            throw new ConflictError(VenueMessages.error.ALREADY_EXISTING)
        }
        
        if(images.length < 3){
            throw new ValidationError(VenueMessages.error.REQUIRE_ATLEAST_THREE_IMAGES)
        }

        if(license.length < 1){
            throw new ValidationError(VenueMessages.error.VENUE_LICENSE_REQUIRED)
        }

        const newVenue = new VenueEntity({
            id: '',
            name,
            vendorId,
            description,
            category,
            websiteUrl,
            address: {
                addressLine1,
                city,
                state,
                country,
                pincode,
                phone,
                googleMapLink
            },
            seatingCapacity,
            standingCapacity,
            pricePerHour,
            pricePerDay,
            securityDeposit,
            availabilityRules,
            weekendSurcharge,
            minimumBookingHours,
            amenities,
            images,
            license,
            isDeleted: false,
            rating: 0,
            reviews: [],
            approvalStatus: VenueStatus.PENDING
        })

        const savedVenue =  await this._venueRepository.create(newVenue)
        return {
            venue: savedVenue
        }
    }
}