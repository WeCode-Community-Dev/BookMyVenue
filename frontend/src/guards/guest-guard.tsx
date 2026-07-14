import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from 'src/context/auth/use-auth';
import { UserRole } from 'src/context/auth/auth.types';

export function GuestGuard() {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated && user) {
        if (user.role === UserRole.ADMIN) return <Navigate to="/admin" replace />;
        if (user.role === UserRole.VENUE_OWNER) return <Navigate to="/owner" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
