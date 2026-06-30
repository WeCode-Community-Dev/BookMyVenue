import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'



export class UserVenueController {
    constructor (
        userGetAllVenuesUsecase,
        userGetVnueByIdUsecase
    ) {
        this._userGetAllVenues = userGetAllVenuesUsecase
        this._userGetVenueById = userGetVnueByIdUsecase
    }

    getAllVenues = asyncHandler( async (req, res ) => {
        const { search, category, rating, amenities, capacityType, capacity, priceType, minPrice, maxPrice, page, limit,} = req.validatedQuery
        const { data, totalPages, totalCount } = await this._userGetAllVenues.execute(search, category, rating, amenities, capacityType, capacity, priceType, minPrice, maxPrice, page, limit)
        return sendSuccess(res, statusCode.OK, '', { data, totalCount, totalPages })
    })

    getVenueById = asyncHandler( async (req, res ) => {
        const venueId = req.params.venueId
        const venue = await this._userGetVenueById.execute(venueId)
        return sendSuccess(res, statusCode.OK, '', venue)
    })
}