import { PublicLayout } from 'src/layouts/public';

import { FavoritesView } from 'src/sections/user/favorites';

export default function FavoritesPage() {
    return (
        <PublicLayout>
            <FavoritesView />
        </PublicLayout>
    );
}
