import { CONFIG } from 'src/config-global';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`Create Venue | ${CONFIG.appName}`}</title>
            {/* <VenueView /> */}
            <h1>Create Venue</h1>
        </>
    );
}
