import { PublicLayout } from 'src/layouts/public';

import { MyBookingsView } from 'src/sections/user/my-bookings';

export default function MyBookingsPage() {
    return (
        <PublicLayout>
            <MyBookingsView />
        </PublicLayout>
    );
}
