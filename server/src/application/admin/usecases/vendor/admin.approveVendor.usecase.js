import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { BadRequestError } from "../../../../domain/errors/BadRequestError.js";
import { VendorMessages } from "../../../../shared/constants/messages/vendorMessages.js";
import { VendorApprovalStatus } from "../../../../domain/enums/VendorApprovalStatus.enum.js";

export class AdminApproveVendorUsecase {

    constructor(vendorRepository, mailService) {
        this._vendorRepository = vendorRepository;
        this._mailService = mailService;
    }

    async execute(vendorId) {

        const vendor =
            await this._vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError(
                VendorMessages.error.VENDOR_NOT_FOUND
            );
        }

        if (vendor.approvalStatus === VendorApprovalStatus.APPROVED) {
            throw new BadRequestError(
                VendorMessages.error.VENDOR_ALREADY_APPROVED
            );
        }

        const approvedVendor =
            await this._vendorRepository.approveVendor(vendorId);

        if (!approvedVendor) {
            throw new NotFoundError(
                VendorMessages.error.VENDOR_NOT_FOUND
            );
        }

        try {
            await this._mailService.sendVendorApprovalMail(
                approvedVendor
            );
        } catch (error) {
            console.log(
                "Approval email sending failed:",
                error.message
            );
        }

        return approvedVendor;
    }
}