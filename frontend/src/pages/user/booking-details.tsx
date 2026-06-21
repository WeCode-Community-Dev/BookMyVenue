import { PublicLayout } from 'src/layouts/public';

import { BookingDetailsView } from 'src/sections/user/booking-details';

export default function BookingDetailsPage() {
    return (
        <PublicLayout>
            <BookingDetailsView />
        </PublicLayout>
    );
}
