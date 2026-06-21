import { PublicLayout } from 'src/layouts/public';

import { BookingView } from 'src/sections/user/booking';

export default function BookingPage() {
    return (
        <PublicLayout>
            <BookingView />
        </PublicLayout>
    );
}
