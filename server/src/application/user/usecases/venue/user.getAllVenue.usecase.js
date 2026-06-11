import { VenueStatus } from "../../../../domain/enums/Venue.enum.js"

export class UserGetAllVenuesUsecase {
    constructor (
        venueRepository
    ) {
        this._venueRepository = venueRepository
    }

    async execute(search, category,rating, amenities, minPrice, maxPrice, page, limit) {
        const { data, totalPages, totalCount } = await this._venueRepository.findAllFiltered({search, category, rating, amenities, minPrice, maxPrice, page, limit})
        return {
            data,
            totalPages,
            totalCount
        }
    }
}