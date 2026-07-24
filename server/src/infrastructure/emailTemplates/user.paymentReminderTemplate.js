export const paymentReminderTemplate = ({
    customerName,
    venueName,
    bookingDate,
    startTime,
    endTime,
    totalAmount,
    paidAmount,
    remainingAmount
}) => {

    return {

        subject: "Payment Reminder - BookMyVenue",

        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Payment Reminder</title>
            </head>

            <body style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">

                <h2 style="color:#E67E22;">
                    Payment Reminder
                </h2>

                <p>Dear <strong>${customerName}</strong>,</p>

                <p>
                    This is a friendly reminder that your booking is scheduled for
                    <strong>${bookingDate}</strong>.
                </p>

                <p>
                    According to your booking, you still have a remaining balance that
                    needs to be paid before your event.
                </p>

                <hr>

                <h3>Booking Details</h3>

                <table cellpadding="6" cellspacing="0">

                    <tr>
                        <td><strong>Venue</strong></td>
                        <td>${venueName}</td>
                    </tr>

                    <tr>
                        <td><strong>Date</strong></td>
                        <td>${bookingDate}</td>
                    </tr>

                    <tr>
                        <td><strong>Time</strong></td>
                        <td>${startTime} - ${endTime}</td>
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
                        <td><strong>₹${remainingAmount}</strong></td>
                    </tr>

                </table>

                <br>

                <p>
                    Kindly complete the remaining payment before your booking date to avoid any inconvenience.
                </p>

                <br>

                <p>
                    Thank you for choosing <strong>BookMyVenue</strong>.
                </p>

            </body>
            </html>
        `

    };

};