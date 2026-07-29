/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { mainRoutes } from './main.routes';
import { ownerRoutes } from './owner.routes';
import { adminRoutes } from './admin.routes';
import { authRoutes } from './auth.routes';
import PageNotFound from '@/shared/pages/PageNotFound';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

const OwnerOnboarding = lazy(() => import('@/features/users/pages/OwnerOnboarding'));

export const router = createBrowserRouter([
  authRoutes,
  {
    path: '/owner/onboarding',
    element: (
      <ProtectedRoute allowedRoles={['owner', 'user']} redirectPath="/signin">
        <OwnerOnboarding />
      </ProtectedRoute>
    ),
  },
  ownerRoutes,
  adminRoutes,
  mainRoutes,
  {
    path: '*',
    element: <PageNotFound />,
  },
]);
