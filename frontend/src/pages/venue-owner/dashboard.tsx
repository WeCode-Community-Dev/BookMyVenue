import { CONFIG } from 'src/config-global';

import { OwnerDashboard } from 'src/sections/venue-owner/view/dashboard';

export default function OwnerDashboardPage() {
    return (
        <>
            <title>{`Owner Dashboard | ${CONFIG.appName}`}</title>
            <OwnerDashboard />
        </>
    );
}
