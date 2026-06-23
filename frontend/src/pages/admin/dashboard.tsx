import { CONFIG } from 'src/config-global';

import { AdminDashboard } from 'src/sections/admin/view/dashboard';

export default function AdminDashboardPage() {
    return (
        <>
            <title>{`Admin Dashboard | ${CONFIG.appName}`}</title>
            <AdminDashboard />
        </>
    );
}
