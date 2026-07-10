import { createBrowserRouter } from 'react-router-dom';

import { mainRoutes } from './main.routes';
import { ownerRoutes } from './owner.routes';
import { adminRoutes } from './admin.routes';
import { authRoutes } from './auth.routes';
import PageNotFound from '@/shared/pages/PageNotFound';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import OwnerOnboarding from '@/features/users/pages/OwnerOnboarding';

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
