import { PublicLayout } from 'src/layouts/public';

import { LandingView } from 'src/sections/user/landing';

export default function LandingPage() {
    return (
        <PublicLayout transparentNavbar>
            <LandingView />
        </PublicLayout>
    );
}
