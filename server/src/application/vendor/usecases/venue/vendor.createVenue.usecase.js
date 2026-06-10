import { VenueMessages } from '../../../../shared/constants/messages/venueMessages.js'
import { VenueEntity } from '../../../../domain/entities/Venue.js'
import { VenueStatus } from '../../../../domain/enums/Venue.enum.js'
import { ValidationError } from '../../../../domain/errors/ValidationError.js'
import { ConflictError } from '../../../../domain/errors/ConflictError.js'

export class VendorCreateVenueUsecase {
    constructor (
        venueRepository,
        // ownerRepository,
    ) {
        this._venueRepository = venueRepository;
        // this._ownerRepository = ownerRepository;
    }

    async execute({
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
        // const owner = await this._ownerRepository.findById(ownerId)
        // if(!owner){
        //     throw new AppError(authMessages.error.OWNER_NOT_FOUND, statusCode.NOT_FOUND)
        // }
        // if(owner.role !== 'OWNER'){
        //     throw new AppError(VenueMessages.error.CANNOT_ADD_VENUE, statusCode.BAD_REQUEST)
        // }
        const existing = await this._venueRepository.findByOwnerAndName(ownerId, name)
        if(existing){
            throw new ConflictError(VenueMessages.error.ALREADY_EXISTING)
        }
        
        if(images.length < 3){
            throw new ValidationError(VenueMessages.error.REQUIRE_ATLEAST_THREE_IMAGES)
        }

        const newVenue = new VenueEntity({
            id: '',
            name,
            ownerId,
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
            status: VenueStatus.PENDING,
            isDeleted: false,
            rating: 0,
            reviews: [],
            isAdminVerified: false
        })

        const savedVenue =  await this._venueRepository.create(newVenue)
        return {
            venue: savedVenue
        }
    }
}