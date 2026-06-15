import { NotFoundError } from '../../../../domain/errors/NotFoundError.js'
import { VendorMessages } from '../../../../shared/constants/messages/vendorMessages.js'

export class GetVendorProfileUsecase {

    constructor(VendorRepository) {
        this._vendorRepository = VendorRepository
    }

    async execute(vendorId) {

        const vendor =
            await this._vendorRepository.findById(vendorId)

        if (!vendor) {
            throw new NotFoundError(
                VendorMessages.error.VENDOR_NOT_FOUND
            )
        }

        return vendor
    }
}