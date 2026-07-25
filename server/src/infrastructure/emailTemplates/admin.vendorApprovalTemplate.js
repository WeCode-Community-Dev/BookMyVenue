export const vendorApprovalTemplate = ({ vendorName }) => {
    return {
        subject: "Vendor Account Approved",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hello ${vendorName},</h2>
                <p>Congratulations! 🎉</p>
                <p>Your vendor account has been <strong>approved</strong> by the admin.</p>
                <p>You can now log in and continue using the platform as an approved vendor.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>BookMyVenue Team</strong></p>
            </div>
        `
    };
};