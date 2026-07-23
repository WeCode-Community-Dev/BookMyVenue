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
        // const vendorId = req.user.id
        const vendorId = '6a2d96f9bd24251e9e502c04'
        console.log('files', req.files)
        const images = (req.files.images || []).map(file => ({
            publicId: file.filename,
            url: file.path
        }))
        const license = (req.files.license || []).map(file => ({
            publicId: file.filename,
            url: file.path
        }))
        const venue = await this._vendorCreateVenueUsecase.execute({vendorId,...req.body, images, license})
        return sendSuccess(res, statusCode.OK, VenueMessages.success.VENUE_CREATED, venue)
    })

    updateVenue = asyncHandler( async(req, res) => {
        const vendorId = req.user.id
        const venueId = req.params.venueId
        const newImages = (req.files.images || []).map(file => ({
            publicId: file.filename,
            url: file.path
        }))

        const newLicense = (req.files.license || []).map(file => ({
            publicId: file.filename,
            url: file.path
        }))

        const venue = await this._vendorEditVenueUsecase.execute({vendorId, venueId, newImages, newLicense, ...req.body})
        return sendSuccess(res, statusCode.OK, '', venue)
    })

    getById = asyncHandler( async (req, res) => {
        const vendorId = req.user.id
        const venueId = req.params.venueId
        const venue = await this._vendorGetVenueByIdUsecase.execute(vendorId,venueId)
        return sendSuccess(res, statusCode.OK, '', venue)
    })

    getAllVenues = asyncHandler( async (req, res) => {
        const vendorId = req.user.id
        const { page, limit, category, search, status, price} = req.validatedQuery
        const { data, totalCount, totalPages }= await this._vendorGetAllVenuesUsecase.execute(vendorId, page, limit, category, search, status, price)
        return sendSuccess(res, statusCode.OK, '', {data, totalCount, totalPages})
    })

    deleteVenue = asyncHandler( async (req, res) => {
        const vendorId = req.user.id
        const venueId = req.params.venueId
        await this._vendorDeleteVenueUsecase.execute(vendorId,venueId)
        return sendSuccess(res, statusCode.OK, '')
    })

    updateVenueStatus = asyncHandler( async (req, res) => {
        const vendorId = req.user.id
        const venueId = req.params.venueId
        await this._vendorUpdateVenueStatusUsecase.execute({vendorId, venueId, status: req.body.status})
        return sendSuccess(res, statusCode.OK, '')
    })
    
}