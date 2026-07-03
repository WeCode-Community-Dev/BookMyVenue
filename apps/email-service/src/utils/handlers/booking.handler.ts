import sendMail from "../mailer";

const toSmallUnit = (amount: number) => Math.round(amount * 100);

export const handleBookingCreated = async (event: BookingCreatedEvent): Promise<void> => {
    const { bookingId, eventDate, purpose, venue, user, owner, sessions } = event;

    const totalAmount = sessions.reduce((total, session) => total + session.pricePaid, 0);

    await Promise.all([
        sendMail({
            email: user.email,
            subject: "Booking confirmed",
            text: `
Hello ${user.name},

Your booking has been created successfully.

Booking ID: ${bookingId}
Venue: ${venue.name}
Event Date: ${eventDate}
Purpose: ${purpose}
Total Amount: ₹${toSmallUnit(totalAmount)}

Thank you for using BookMyVenue.
            `.trim(),
        }),

        sendMail({
            email: owner.email,
            subject: "New venue booking",
            text: `
Hello ${owner.name},

You have received a new booking.

Booking ID: ${bookingId}
Venue: ${venue.name}
Customer: ${user.name}
Event Date: ${eventDate}
Purpose: ${purpose}
Total Amount: ₹${toSmallUnit(totalAmount)}

Please check your dashboard for more details.
            `.trim(),
        }),
    ]);
};
