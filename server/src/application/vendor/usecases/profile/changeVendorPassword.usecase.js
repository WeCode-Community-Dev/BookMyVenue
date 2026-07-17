import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { VendorMessages } from "../../../../shared/constants/messages/vendorMessages.js";

export class ChangeVendorPasswordUsecase {

    constructor(
        vendorRepository,
        hashService
    ) {

        this._vendorRepository = vendorRepository;
        this._hashService = hashService;

    }

    async execute({

        vendorId,

        currentPassword,

        newPassword,

        confirmPassword

    }) {

        const vendor =
            await this._vendorRepository.findByIdWithPassword(
                vendorId
            );

        if (!vendor) {

            throw new NotFoundError(
                VendorMessages.error.VENDOR_NOT_FOUND
            );

        }

        const isPasswordCorrect =
            await this._hashService.compare(
                currentPassword,
                vendor.password
            );

        if (!isPasswordCorrect) {

            throw new ValidationError( 
                VendorMessages.error.INVALID_CURRENT_PASSWORD
            );

        }

        if (newPassword !== confirmPassword) {

            throw new ValidationError(
                VendorMessages.error.PASSWORD_MISMATCH
            );

        }

        const samePassword =
            await this._hashService.compare(
                newPassword,
                vendor.password
            );

        if (samePassword) {

            throw new ValidationError(
                VendorMessages.error.SAME_PASSWORD
            );

        }

        const hashedPassword =
            await this._hashService.hash(
                newPassword
            );

        await this._vendorRepository.updatePassword(

            vendorId,

            hashedPassword

        );

        return null;

    }

}