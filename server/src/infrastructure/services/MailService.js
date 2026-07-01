import { MailService } from "../../application/services/mailService.js";
import { transporter } from "../config/mail.config.js";
import { vendorApprovalTemplate } from "../emailTemplates/admin.vendorApprovalTemplate.js";
import { vendorRejectionTemplate } from "../emailTemplates/admin.vendorRejectionTemplate.js";
import { adminVenueApprovalTemplate } from "../emailTemplates/admin.venueApprovalTemplate.js";
import { adminVenueRejectionTemplate } from "../emailTemplates/admin.venueRejectionTemplate.js";
import { forgotPasswordTemplate } from "../emailTemplates/forgotPasswordTemplate.js";
import { otpTemplate } from "../emailTemplates/otpTemplate.js";

// General-purpose send function used by auth use cases
export const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    });
};

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

    async sendForgotPasswordMail(user, resetLink) {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Reset Your BookMyVenue Password',
            html: forgotPasswordTemplate(user.fullName, resetLink)
        });

        console.log("Forgot password mail sent.");
    }

    async sendOtpMail(user, otpCode) {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your BookMyVenue OTP Code - Verify Your Email',
            html: otpTemplate(user.fullName, otpCode)
        });

        console.log("OTP mail sent.");
    }

}