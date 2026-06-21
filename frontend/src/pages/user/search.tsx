import { PublicLayout } from 'src/layouts/public';

import { SearchView } from 'src/sections/user/search';

export default function SearchPage() {
    return (
        <PublicLayout hideFooter={false}>
            <SearchView />
        </PublicLayout>
    );
}
