import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '../context/auth/use-auth';

export function AuthGuard() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
}