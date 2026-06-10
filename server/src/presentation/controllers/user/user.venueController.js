import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'



export class UserVenueController {
    constructor (
        userGetAllVenuesUsecase
    ) {
        this._userGetAllVenues = userGetAllVenuesUsecase
    }

    getAllVenues = asyncHandler( async (req, res ) => {
        const { search, category, rating, amenities, minPrice, maxPrice, page, limit,} = req.validatedQuery
        const { data, totalPages, totalCount } = await this._userGetAllVenues.execute(search, category, rating, amenities, minPrice, maxPrice, page, limit)
        return sendSuccess(res, statusCode.OK, '', { data, totalCount, totalPages })
    })
}