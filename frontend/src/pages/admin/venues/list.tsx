import { CONFIG } from 'src/config-global';

import { VenueView } from 'src/sections/admin/venues/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`Venues | ${CONFIG.appName}`}</title>
            <VenueView />
        </>
    );
}
