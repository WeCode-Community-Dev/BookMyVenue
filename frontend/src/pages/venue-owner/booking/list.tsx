import { CONFIG } from 'src/config-global';

import { ListBookings } from 'src/sections/venue-owner/booking/list';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`Venue Bookings | ${CONFIG.appName}`}</title>
            <ListBookings />
        </>
    );
}
