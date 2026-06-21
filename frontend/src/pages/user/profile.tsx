import { PublicLayout } from 'src/layouts/public';

import { ProfileView } from 'src/sections/user/profile';

export default function ProfilePage() {
    return (
        <PublicLayout>
            <ProfileView />
        </PublicLayout>
    );
}
