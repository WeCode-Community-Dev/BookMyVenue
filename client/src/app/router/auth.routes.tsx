/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ErrorPage from '@/shared/pages/ErrorPage';
import AuthLayout from '../layouts/AuthLayout';
import PublicRoute from '@/shared/components/PublicRoute';

const Signin = lazy(() => import('@/features/auth/pages/Signin'));
const Signup = lazy(() => import('@/features/auth/pages/Signup'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));

export const authRoutes = {
  path: '/',
  element: (
    <PublicRoute>
      <AuthLayout />
    </PublicRoute>
  ),
  errorElement: <ErrorPage />,
  children: [
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
