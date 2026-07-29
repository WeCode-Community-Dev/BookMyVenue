import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { BadRequestError } from "../../../../domain/errors/BadRequestError.js";
import { VendorMessages } from "../../../../shared/constants/messages/vendorMessages.js";
import { VendorApprovalStatus } from "../../../../domain/enums/VendorApprovalStatus.enum.js";

export class AdminRejectVendorUsecase {

    constructor(vendorRepository, mailService) {
        this._vendorRepository = vendorRepository;
        this._mailService = mailService;
    }

    async execute(vendorId, reason) {

        const vendor =
            await this._vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError(
                VendorMessages.error.VENDOR_NOT_FOUND
            );
        }

        if (!reason?.trim()) {
            throw new BadRequestError(
                VendorMessages.error.REJECTION_REASON_REQUIRED
            );
        }

        if (vendor.approvalStatus === VendorApprovalStatus.REJECTED) {
            throw new BadRequestError(
                VendorMessages.error.VENDOR_ALREADY_REJECTED
            );
        }

        const rejectedVendor =
            await this._vendorRepository.rejectVendor(
                vendorId,
                reason
            );

        if (!rejectedVendor) {
            throw new NotFoundError(
                VendorMessages.error.VENDOR_NOT_FOUND
            );
        }

        try {
            await this._mailService.sendVendorRejectionMail(
                rejectedVendor,
                reason
            );
        } catch (error) {
            console.log(
                "Rejection email sending failed:",
                error.message
            );
        }

        return rejectedVendor;
    }
}