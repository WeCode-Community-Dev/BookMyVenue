import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'



export class UserVenueController {
    constructor (
        userGetAllVenuesUsecase,
        userGetVnueByIdUsecase,
        userGetTopVenuesUsecase,
        userGetSimilarVenuesUsecase,
    ) {
        this._userGetAllVenues = userGetAllVenuesUsecase
        this._userGetVenueById = userGetVnueByIdUsecase
        this._userGetTopVenues = userGetTopVenuesUsecase
        this._userGetSimilarVenues = userGetSimilarVenuesUsecase
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

    getTopVenues = asyncHandler( async (req, res) => {
        const venues = await this._userGetTopVenues.execute()
        // console.log('venue: ', venues)
        return sendSuccess(res, statusCode.OK,'', venues)
    })

    getSimilarVenues = asyncHandler( async (req, res) => {
        const userId = "6a5c82d2a4cb28be7d10521f";
        const venueId = req.params.venueId
        const venues = await this._userGetSimilarVenues.execute(userId, venueId)
        return sendSuccess(res, statusCode.OK, '', venues)
    })
}