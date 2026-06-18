import { CONFIG } from 'src/config-global';

import { VenueView } from 'src/sections/venue-owner/venues/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`My Venues | ${CONFIG.appName}`}</title>
            <VenueView />
        </>
    );
}
