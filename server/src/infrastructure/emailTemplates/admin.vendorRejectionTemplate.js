export const vendorRejectionTemplate = ({ vendorName, reason }) => {
    return {
        subject: "Vendor Application Rejected",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hello ${vendorName},</h2>
                <p>We regret to inform you that your vendor application has been <strong>rejected</strong>.</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p>Please review the reason and resubmit your application if applicable.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>BookMyVenue Team</strong></p>
            </div>
        `
    };
};