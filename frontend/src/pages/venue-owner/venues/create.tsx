import { CONFIG } from 'src/config-global';

import { CreateVenueForm } from 'src/sections/venue-owner/venues/create';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`Create Venue | ${CONFIG.appName}`}</title>
            <CreateVenueForm />
        </>
    );
}
