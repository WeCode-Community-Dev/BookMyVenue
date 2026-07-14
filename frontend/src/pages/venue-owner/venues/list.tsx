import { CONFIG } from 'src/config-global';

import { ListVenues } from 'src/sections/venue-owner/venues/list';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`My Venues | ${CONFIG.appName}`}</title>
            <ListVenues />
        </>
    );
}
