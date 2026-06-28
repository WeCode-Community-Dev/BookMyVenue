export const adminVenueRejectionTemplate = ({

    vendorName,

    venueName,

    reason

}) => ({

    subject:
        "Venue Rejected",

    html: `

        <h2>Hello ${vendorName},</h2>

        <p>

        Unfortunately,

        your venue

        <b>${venueName}</b>

        has been rejected.

        </p>

        <p>

        Reason:

        <b>${reason}</b>

        </p>

        <p>

        Please update your venue
        and submit again.

        </p>

    `

});