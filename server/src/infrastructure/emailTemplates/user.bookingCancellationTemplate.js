export const bookingCancellationTemplate = ({
    customerName,
    venueName,
    bookingDate,
    startTime,
    endTime,
    paidAmount,
    refundAmount,
    cancellationReason
}) => {

    return {

        subject: "Booking Cancelled Successfully",

        html: `
            <h2>Booking Cancelled</h2>

            <p>Hello ${customerName},</p>

            <p>Your booking has been cancelled successfully.</p>

            <ul>
                <li><strong>Venue:</strong> ${venueName}</li>
                <li><strong>Date:</strong> ${bookingDate}</li>
                <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
                <li><strong>Paid Amount:</strong> ₹${paidAmount}</li>
                <li><strong>Refund Amount:</strong> ₹${refundAmount}</li>
                <li><strong>Reason:</strong> ${cancellationReason}</li>
            </ul>

            <p>Thank you for choosing BookMyVenue.</p>
        `

    };

};