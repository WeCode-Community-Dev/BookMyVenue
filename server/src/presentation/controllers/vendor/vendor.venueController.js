import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'
import { VenueMessages } from '../../../shared/constants/messages/venueMessages.js'


export class VendorVenueController {
    constructor (
        VendorCreateVenueUsecase
    ){
        this._vendorCreateVenueUsecase = VendorCreateVenueUsecase
    }

    createVenue = asyncHandler( async (req, res) => {
        const ownerId = req.body.ownerId
        const images = (req.files || []).map(file => ({
            publicId: file.filename,
            url: file.path
        }))
        const venue = await this._vendorCreateVenueUsecase.execute({ownerId,...req.body, images})
        return sendSuccess(res, statusCode.OK, VenueMessages.success.VENUE_CREATED, venue)
    })
}