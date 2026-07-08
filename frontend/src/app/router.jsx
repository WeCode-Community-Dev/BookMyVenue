import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/features/auth/components/protected-route';

const LandingRoute = lazy(() => import('@/app/routes/landing'));
const NotFoundRoute = lazy(() => import('@/app/routes/not-found'));
const LoginRoute = lazy(() => import('@/app/routes/auth/login'));
const RegisterRoute = lazy(() => import('@/app/routes/auth/register'));
const OwnerDashboardRoute = lazy(() => import('@/app/routes/owner/dashboard'));
const MyBookingsRoute = lazy(() => import('@/app/routes/bookings/my-bookings'));
const VenueDetailRoute = lazy(() => import('@/app/routes/venues/venue-detail'));

function RouteFallback() {
  return <div className="flex min-h-screen items-center justify-center text-brand-muted">Loading…</div>;
}

function withSuspense(element) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: paths.home.path,
    element: withSuspense(<LandingRoute />),
  },
  {
    path: paths.venues.detail.path,
    element: withSuspense(<VenueDetailRoute />),
  },
  {
    path: paths.auth.login.path,
    element: withSuspense(<LoginRoute />),
  },
  {
    path: paths.auth.register.path,
    element: withSuspense(<RegisterRoute />),
  },
  {
    path: paths.bookings.mine.path,
    element: <ProtectedRoute roles={['CUSTOMER']}>{withSuspense(<MyBookingsRoute />)}</ProtectedRoute>,
  },
  {
    path: paths.owner.dashboard.path,
    element: <ProtectedRoute roles={['OWNER']}>{withSuspense(<OwnerDashboardRoute />)}</ProtectedRoute>,
  },
  {
    path: '*',
    element: withSuspense(<NotFoundRoute />),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
