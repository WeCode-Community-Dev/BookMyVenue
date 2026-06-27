import { MailService } from "../../application/services/mailService.js";
import { transporter } from "../config/mail.config.js";
import { vendorApprovalTemplate } from "../emailTemplates/admin.vendorApprovalTemplate.js";
import { vendorRejectionTemplate } from "../emailTemplates/admin.vendorRejectionTemplate.js";
import { adminVenueApprovalTemplate } from "../emailTemplates/admin.venueApprovalTemplate.js";
import { adminVenueRejectionTemplate } from "../emailTemplates/admin.venueRejectionTemplate.js";

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

    async sendVenueApprovalMail(venue){

    const { subject, html } =
        adminVenueApprovalTemplate({

            venueName: venue.name,
            vendorName: venue.vendorId.fullName

        });

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: venue.vendorId.email,

        subject,

        html

    });

}

async sendVenueRejectionMail(venue, reason) {

    const { subject, html } =
        adminVenueRejectionTemplate({

            venueName: venue.name,
            vendorName: venue.vendorId.fullName,
            reason

        });

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: venue.vendorId.email,

        subject,

        html

    });

    console.log("Venue rejection mail sent.");

}

}