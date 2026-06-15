import { NotFoundError } from '../../../../domain/errors/NotFoundError.js'
import { ConflictError } from '../../../../domain/errors/ConflictError.js'
import { VendorMessages } from '../../../../shared/constants/messages/vendorMessages.js'

export class VendorUpdateProfileUsecase {

    constructor(VendorRepository) {
        this._vendorRepository = VendorRepository
    }

    async execute({
        vendorId,
        fullName,
        phone
    }) {

        const vendor =
            await this._vendorRepository.findById(vendorId)

        if (!vendor) {
            throw new NotFoundError(
                VendorMessages.error.VENDOR_NOT_FOUND
            )
        }

        if (phone && phone !== vendor.phone) {

            const existingVendor =
                await this._vendorRepository.findByPhone(phone)

            if (existingVendor) {
                throw new ConflictError(
                    VendorMessages.error.PHONE_ALREADY_EXISTS
                )
            }
        }

        vendor.fullName = fullName
        vendor.phone = phone

        const updatedVendor =
            await this._vendorRepository.update(
                vendor.id,
                vendor
            )

        return updatedVendor
    }
}