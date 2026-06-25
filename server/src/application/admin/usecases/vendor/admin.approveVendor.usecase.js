import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { BadRequestError } from "../../../../domain/errors/BadRequestError.js";
import { VendorMessages } from "../../../../shared/constants/messages/vendorMessages.js";
import { VendorApprovalStatus } from "../../../../domain/enums/VendorApprovalStatus.enum.js";
import { vendorApprovalTemplate } from "../../../../infrastructure/emailTemplates/admin.vendorApprovalTemplate.js";
import { sendMail } from "../../../../infrastructure/services/MailService.js";

export class AdminApproveVendorUsecase {

    constructor(vendorRepository) {
        this._vendorRepository = vendorRepository
    }

    async execute(vendorId) {
        const vendor = await this._vendorRepository.findById(vendorId);

        if (!vendor) {
            throw new NotFoundError(
                VendorMessages.error.VENDOR_NOT_FOUND
            );
        }

        if (vendor.approvalStatus === VendorApprovalStatus.APPROVED ) {
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

        // Send approval email
        const { subject, html } = vendorApprovalTemplate({
            vendorName: approvedVendor.fullName
        });

        try {
            await sendMail(
                approvedVendor.email,
                subject,
                html
            );
        } catch (error) {
            console.log("Approval email sending failed:", error.message);
        }

        return approvedVendor;
    }
}