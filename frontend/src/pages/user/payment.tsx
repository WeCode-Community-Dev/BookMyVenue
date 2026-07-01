import { PublicLayout } from 'src/layouts/public';

import { PaymentView } from 'src/sections/user/payment';

export default function PaymentPage() {
    return (
        <PublicLayout>
            <PaymentView />
        </PublicLayout>
    );
}
