export const bookingConfirmationTemplate = ({
    customerName,
    venueName,
    bookingDate,
    startTime,
    endTime,
    guestCount,
    bookingType,
    totalAmount,
    paidAmount,
    remainingAmount
}) => {

    return {
        subject: "Booking Confirmed - BookMyVenue",

        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Booking Confirmation</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">

                <h2 style="color:#2E86DE;">Booking Confirmed 🎉</h2>

                <p>Dear <strong>${customerName}</strong>,</p>

                <p>
                    Your venue booking has been <strong>confirmed successfully</strong>.
                    Thank you for choosing <strong>BookMyVenue</strong>.
                </p>

                <hr>

                <h3>Booking Details</h3>

                <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td><strong>Venue</strong></td>
                        <td>${venueName}</td>
                    </tr>

                    <tr>
                        <td><strong>Booking Date</strong></td>
                        <td>${bookingDate}</td>
                    </tr>

                    <tr>
                        <td><strong>Time</strong></td>
                        <td>${startTime} - ${endTime}</td>
                    </tr>

                    <tr>
                        <td><strong>Booking Type</strong></td>
                        <td>${bookingType}</td>
                    </tr>

                    <tr>
                        <td><strong>Guests</strong></td>
                        <td>${guestCount}</td>
                    </tr>

                    <tr>
                        <td><strong>Total Amount</strong></td>
                        <td>₹${totalAmount}</td>
                    </tr>

                    <tr>
                        <td><strong>Paid Amount</strong></td>
                        <td>₹${paidAmount}</td>
                    </tr>

                    <tr>
                        <td><strong>Remaining Amount</strong></td>
                        <td>₹${remainingAmount}</td>
                    </tr>
                </table>

                <br>

                <p>
                    Please keep this email for your reference.
                </p>

                <p>
                    We look forward to hosting your event.
                </p>

                <br>

                <p>
                    Regards,<br>
                    <strong>BookMyVenue Team</strong>
                </p>

            </body>
            </html>
        `
    };
};