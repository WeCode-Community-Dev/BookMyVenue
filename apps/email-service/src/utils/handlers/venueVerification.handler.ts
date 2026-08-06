import { VenueVerificationUpdatedEvent } from "@bookmyvenue/types";
import sendMail from "../mailer";



export const handleVenueVerificationUpdated = async (event: VenueVerificationUpdatedEvent): Promise<void> => {
    const { venueName, status, reason, owner } = event;

    if (status === "APPROVED") {
        await sendMail({
            email: owner.email,
            subject: "Your venue has been approved",
            text: `
Hello ${owner.name},

Great news! Your venue "${venueName}" has been approved.
Your venue is now available for users to view and book.

Thank you for using BookMyVenue.
            `.trim(),
        });

        return;
    }

    await sendMail({
        email: owner.email,
        subject: "Your venue has been rejected",
        text: `
Hello ${owner.name},

Your venue "${venueName}" could not be approved.

Reason:
${reason ?? "No reason provided"}
Please update your venue details and submit it again for verification.

Thank you for using BookMyVenue.
        `.trim(),
    });
};
