import { Navigate } from 'react-router-dom';
import Signup from '@/features/auth/pages/Signup';
import ErrorPage from '@/shared/pages/ErrorPage';
import Signin from '@/features/auth/pages/Signin';
import AuthLayout from '../layouts/AuthLayout';
import PublicRoute from '@/shared/components/PublicRoute';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';

export const authRoutes = {
  path: '/',

  element: (
    <PublicRoute>
      <AuthLayout />
    </PublicRoute>
  ),
  errorElement: <ErrorPage />,
  children: [
    // ── Primary auth routes (used by internal Links) ──────────────
    {
      path: 'signin',
      element: <Signin />,
    },
    {
      path: 'signup',
      element: <Signup />,
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />,
    },

    // ── Aliases so old /login and /register still work ─────────────
    {
      path: 'login',
      element: <Navigate to="/signin" replace />,
    },
    {
      path: 'register',
      element: <Navigate to="/signup" replace />,
    },
  ],
};
