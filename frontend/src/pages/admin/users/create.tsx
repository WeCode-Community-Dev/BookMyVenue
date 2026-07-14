import { CONFIG } from 'src/config-global';

import { CreateUserForm } from 'src/sections/admin/user/create';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <title>{`Create Users | ${CONFIG.appName}`}</title>

            <CreateUserForm />
        </>
    );
}
