import { MailService } from "../../application/services/mailService.js";
import { transporter } from "../config/mail.config.js";
import { vendorApprovalTemplate } from "../emailTemplates/admin.vendorApprovalTemplate.js";
import { vendorApprovalTemplate } from "../emailTemplates/admin.vendorApprovalTemplate.js";

export class MailServiceImpl extends MailService {

    async sendVendorApprovalMail(vendor) {

        const { subject, html } =
            vendorApprovalTemplate({
                vendorName: vendor.fullName
            });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: vendor.email,
            subject,
            html
        });

        console.log("Approval mail sent.");
    }


    async sendVendorRejectionMail(vendor, reason) {

        const { subject, html } =
            vendorRejectionTemplate({
                vendorName: vendor.fullName,
                reason
            });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: vendor.email,
            subject,
            html
        });

        console.log("Rejection mail sent.");
    }

}