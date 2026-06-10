import { asyncHandler } from '../../../shared/utils/asyncHandler.js'
import { sendSuccess } from '../../../shared/utils/apiResponse.js'
import { statusCode } from '../../../shared/constants/enums/statusCode.js'
import { VenueMessages } from '../../../shared/constants/messages/venueMessages.js'


export class VendorVenueController {
    constructor (
        VendorCreateVenueUsecase,
        VendorEditVenueUsecase,
        VendorGetVenueByIdUsecase,
        VendorGetAllVenuesUsecase,
        VendorDeleteVenueUsecase,
        VendorUpdateVenueStatusUsecase,
    ){
        this._vendorCreateVenueUsecase = VendorCreateVenueUsecase
        this._vendorEditVenueUsecase = VendorEditVenueUsecase
        this._vendorGetVenueByIdUsecase = VendorGetVenueByIdUsecase
        this._vendorGetAllVenuesUsecase = VendorGetAllVenuesUsecase
        this._vendorDeleteVenueUsecase = VendorDeleteVenueUsecase
        this._vendorUpdateVenueStatusUsecase = VendorUpdateVenueStatusUsecase
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

    updateVenue = asyncHandler( async(req, res) => {
        const ownerId = req.body.ownerId
        const venueId = req.params.venueId
        const newImages = (req.files || []).map(file => ({
            publicId: file.filename,
            url: file.path
        }))
        console.log('venueid: ', venueId)
        await this._vendorEditVenueUsecase.execute({ownerId, venueId, newImages, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    getById = asyncHandler( async (req, res) => {
        const ownerId = req.params.ownerId
        const venueId = req.params.venueId
        const venue = await this._vendorGetVenueByIdUsecase.execute(ownerId,venueId)
        return sendSuccess(res, statusCode.OK, '', venue)
    })

    getAllVenues = asyncHandler( async (req, res) => {
        // const ownerId = req.params.ownerId
        const { ownerId, page, limit, category, search, status, price} = req.validatedQuery
        const { data, totalCount, totalPages }= await this._vendorGetAllVenuesUsecase.execute(ownerId, page, limit, category, search, status, price)
        return sendSuccess(res, statusCode.OK, '', {data, totalCount, totalPages})
    })

    deleteVenue = asyncHandler( async (req, res) => {
        const ownerId = req.params.ownerId
        const venueId = req.params.venueId
        await this._vendorDeleteVenueUsecase.execute(ownerId,venueId)
        return sendSuccess(res, statusCode.OK, '')
    })

    updateVenueStatus = asyncHandler( async (req, res) => {
        const ownerId = req.params.ownerId
        const venueId = req.params.venueId
        await this._vendorUpdateVenueStatusUsecase.execute({ownerId,venueId, status: req.body.status})
        return sendSuccess(res, statusCode.OK, '')
    })
    
}