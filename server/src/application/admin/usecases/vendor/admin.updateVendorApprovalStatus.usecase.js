import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { BadRequestError } from "../../../../domain/errors/BadRequestError.js";
import { VendorMessages } from "../../../../shared/constants/messages/vendorMessages.js";

export class AdminUpdateVendorApprovalStatusUsecase {

    constructor(vendorRepository) {
        this._vendorRepository =
            vendorRepository
    }

    async execute({
        vendorId,
        status,
        reason
    }) {

        const vendor =
            await this._vendorRepository
                .findById(vendorId)

        if (!vendor) {
            throw new NotFoundError(VendorMessages.error.VENDOR_NOT_FOUND);
        }
        if (status === "REJECTED" && !reason) {
            throw new BadRequestError(VendorMessages.error.REJECTION_REASON_REQUIRED)
        }

        return await
            this._vendorRepository
                .updateApprovalStatus(
                    vendorId,
                    status,
                    reason
                )
    }
}