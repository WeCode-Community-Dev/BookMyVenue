import { VenueStatus } from "../../../../domain/enums/Venue.enum.js"

export class UserGetAllVenuesUsecase {
    constructor (
        venueRepository
    ) {
        this._venueRepository = venueRepository
    }

    async execute(search, category,rating, amenities, capacityType, capacity, priceType, minPrice, maxPrice, page, limit) {
        const { data, totalPages, totalCount } = await this._venueRepository.findAllFiltered({search, category, rating, amenities, capacityType, capacity, priceType, minPrice, maxPrice,isBlocked: false, approvalStatus: VenueStatus.ACTIVE, page, limit})
        return {
            data,
            totalPages,
            totalCount
        }
    }
}