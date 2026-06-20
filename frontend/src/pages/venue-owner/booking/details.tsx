import { CONFIG } from 'src/config-global';

import { BookingDetails } from 'src/sections/venue-owner/booking/details';



// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`Venue Bookings | ${CONFIG.appName}`}</title>
            <BookingDetails />
        </>
    );
}
