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
        phone,
        profileImage,
        companyName,
        address,
        bio
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

        vendor.fullName = fullName??vendor.fullName
        vendor.phone = phone??vendor
        if (profileImage) {
        vendor.profileImage = {
            publicId:profileImage.publicId ?? vendor.profileImage.publicId,
            url: profileImage ?? vendor.profileImage.url}};
        vendor.companyName = companyName ?? vendor.companyName;
        if(address){
        vendor.address = {
              addressLine1: address?.addressLine1 || vendor.address.addressLine1,
            city: address?.city || vendor.address.city,
            state: address?.state || vendor.address.state,
            pincode: address?.pincode || vendor.address.pincode,

        };}
        vendor.bio = bio ?? vendor.bio;

        const updatedVendor =
            await this._vendorRepository.update(
                vendor.id,
                vendor
            )

        return updatedVendor
    }
}