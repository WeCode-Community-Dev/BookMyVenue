import { UserCreatedEvent } from "@bookmyvenue/types";
import sendMail from "../mailer";

export const handleUserCreated = async (event: UserCreatedEvent): Promise<void> => {
    const { email, name, role } = event;

    const roleMessage =
        role === "OWNER"
            ? "You can now add your venues and start receiving bookings."
            : "You can now discover venues and book the perfect place for your events.";

    await sendMail({
        email,
        subject: "Welcome to BookMyVenue 🎉",
        text: `
Hello ${name},

Welcome to BookMyVenue!
${roleMessage}
We're excited to have you with us.
Thank you for joining BookMyVenue.

The BookMyVenue Team
        `.trim(),
    });
};
