export class MailService {

    async sendVendorApprovalMail(vendor) {
        throw new Error("Method not implemented");
    }

    async sendVendorRejectionMail(vendor, reason) {
        throw new Error("Method not implemented");
    }

    async sendVenueApprovalMail(venue) {
        throw new Error("Method not implemented");
    }

    async sendVenueRejectionMail(venue, reason) {
        throw new Error("Method not implemented");
    }

    async sendForgotPasswordMail(user, resetLink) {
        throw new Error("Method not implemented");
    }
    async sendEmailChangeOtp(email, name, otp) {
        throw new Error("Method not implemented");
    }

    // async resendEmailChangeOtp(email, otp) {
    //     throw new Error("Method not implemented");
    // }

    async verifiyRegisterOtp(email, name, otp) {
        throw new Error("Method not implemented")
    }
}