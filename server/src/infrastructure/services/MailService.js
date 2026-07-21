import { MailService } from "../../application/services/mailService.js";
import { transporter } from "../config/mail.config.js";
import { vendorApprovalTemplate } from "../emailTemplates/admin.vendorApprovalTemplate.js";
import { vendorRejectionTemplate } from "../emailTemplates/admin.vendorRejectionTemplate.js";
import { adminVenueApprovalTemplate } from "../emailTemplates/admin.venueApprovalTemplate.js";
import { adminVenueRejectionTemplate } from "../emailTemplates/admin.venueRejectionTemplate.js";
import { forgotPasswordTemplate } from "../emailTemplates/forgotPasswordTemplate.js";
import { VerifyRegisterotpTemplate } from "../emailTemplates/verifyRegisterOtpTemplate.js";
import { emailChangeOtpTemplate } from "../emailTemplates/user.emailChangeOtpTemplate.js";

// General-purpose send function used by auth use cases
// export const sendMail = async (to, subject, html) => {
//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         html
//     });
// };

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

    async sendVerifiyRegisterOtp(email, name, otpCode) {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your BookMyVenue OTP Code - Verify Your Email',
            html: VerifyRegisterotpTemplate(name, otpCode)
        });

        console.log("OTP mail sent.");
    }

    async sendEmailChangeOtp(email,name, otp) {
        console.log('email : ', email);
        console.log('name : ', name);
        console.log('otp : ', otp);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Email change OTP',
            html: emailChangeOtpTemplate(name, otp)
        })
    }

}