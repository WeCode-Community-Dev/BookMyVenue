import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { BadRequestError } from "../../../../domain/errors/BadRequestError.js";
import { VendorMessages } from "../../../../shared/constants/messages/vendorMessages.js";
import { VendorApprovalStatus } from "../../../../domain/enums/VendorApprovalStatus.enum.js";
import { vendorApprovalTemplate } from "../../../../infrastructure/emailTemplates/admin.vendorApprovalTemplate.js";
import { sendMail } from "../../../../infrastructure/services/MailService.js";
import { vendorRejectionTemplate } from "../../../../infrastructure/emailTemplates/admin.vendorRejectionTemplate.js";
export class AdminUpdateVendorApprovalStatusUsecase {

    constructor(vendorRepository) {
        this._vendorRepository = vendorRepository
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
        if (status === VendorApprovalStatus.REJECTED && !reason) {
            throw new BadRequestError(VendorMessages.error.REJECTION_REASON_REQUIRED)
        }

        const updatedVendor = await
            this._vendorRepository
                .updateApprovalStatus(
                    vendorId,
                    status,
                    reason
                )
                console.log("usecase:",updatedVendor)
        //send email 
          if (status === VendorApprovalStatus.APPROVED) {
        const { subject, html } = vendorApprovalTemplate({
            vendorName: updatedVendor.fullName
        });

        try {
            await sendMail(updatedVendor.email, subject, html);
        } catch (error) {
            console.log("Approval email failed:", error.message);
        }
    }

    if (status === VendorApprovalStatus.REJECTED) {
        const { subject, html } = vendorRejectionTemplate({
            vendorName: updatedVendor.fullName,
            reason
        });

        try {
            await sendMail(updatedVendor.email, subject, html);
        } catch (error) {
            console.log("Rejection email failed:", error.message);
        }
    }
    return updatedVendor
    }
}