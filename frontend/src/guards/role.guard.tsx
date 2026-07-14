import type { UserRole } from 'src/context/auth/auth.types';

import {
    Outlet,
    Navigate,
} from 'react-router-dom';

import { useAuth } from 'src/context/auth/use-auth';



interface Props {
    roles: UserRole[];
}

export function RoleGuard({
    roles,
}: Props) {
    const {
        user,
    } = useAuth();

    if (!user) {
        return (
            <Navigate
                to="/sign-in"
                replace
            />
        );
    }

    const allowed =
        roles.includes(
            user.role,
        );

    if (!allowed) {
        return (
            <Navigate
                to="/403"
                replace
            />
        );
    }

    return <Outlet />;
}