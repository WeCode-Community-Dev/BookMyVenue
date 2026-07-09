import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js"
import { authMessages } from "../../../../shared/constants/messages/authMessages.js"

export class VendorGetAllVenuesUsecase {
    constructor (
        venueRepository,
        vendorRepository
    ) {
        this._venueRepository = venueRepository
        this._vendorRepository = vendorRepository
    }

    async execute(vendorId, page, limit, category, status, search) {
        const vendor = await this._vendorRepository.findById(vendorId)
        if(!vendor){
            throw new UnauthorizedError(authMessages.error.VENDOR_NOT_FOUND)
        }
        const { data, totalPages, totalCount } = await this._venueRepository.findAllFiltered({vendorId, search, category, status, page, limit})

        return {
            data,
            totalPages,
            totalCount
        }

    }
}