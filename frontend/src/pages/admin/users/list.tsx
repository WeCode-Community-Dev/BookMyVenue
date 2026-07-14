import { CONFIG } from 'src/config-global';

import { ListUsers } from 'src/sections/admin/user/list';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`Users - ${CONFIG.appName}`}</title>

            <ListUsers />
        </>
    );
}
