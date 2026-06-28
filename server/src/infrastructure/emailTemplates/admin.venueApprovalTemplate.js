export const adminVenueApprovalTemplate = ({

    vendorName,

    venueName

}) => ({

    subject:
        "Venue Approved",

    html: `

        <h2>Hello ${vendorName},</h2>

        <p>

        Congratulations!

        </p>

        <p>

        Your venue

        <b>${venueName}</b>

        has been approved successfully.

        </p>

        <p>

        It is now visible for customers.

        </p>

    `

});