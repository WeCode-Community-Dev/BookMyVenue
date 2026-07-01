import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth-guard';
import { GuestGuard } from 'src/guards/guest-guard';
import { UserRole } from 'src/context/auth/auth.types';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

// Public / Consumer Pages
export const LandingPage = lazy(() => import('src/pages/user/landing'));
export const SearchPage = lazy(() => import('src/pages/user/search'));
export const VenueDetailsPage = lazy(() => import('src/pages/user/venue-details'));
export const BookingPage = lazy(() => import('src/pages/user/booking'));

// Authenticated User Pages
export const MyBookingsPage = lazy(() => import('src/pages/user/my-bookings'));
export const BookingDetailsPage = lazy(() => import('src/pages/user/booking-details'));
export const PaymentPage = lazy(() => import('src/pages/user/payment'));
export const FavoritesPage = lazy(() => import('src/pages/user/favorites'));
export const ProfilePage = lazy(() => import('src/pages/user/profile'));

// Auth Pages
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// Admin pages
export const AdminDashboardPage = lazy(() => import('src/pages/admin/dashboard'));
export const AdminVenuesPage = lazy(() => import('src/pages/admin/venues/list'));
export const AdminUsersPage = lazy(() => import('src/pages/admin/users/list'));
export const CreateUsersPage = lazy(() => import('src/pages/admin/users/create'));

// Owner pages
export const OwnerDashboardPage = lazy(() => import('src/pages/venue-owner/dashboard'));
export const OwnerVenuesPage = lazy(() => import('src/pages/venue-owner/venues/list'));
export const CreateVenuePage = lazy(() => import('src/pages/venue-owner/venues/create'));
export const OwnerBookingPage = lazy(() => import('src/pages/venue-owner/booking/list'));
export const OwnerBookingDetailsPage = lazy(() => import('src/pages/venue-owner/booking/details'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  // ─────────────────────────────────────────────
  // PUBLIC ROUTES (no auth required)
  // ─────────────────────────────────────────────
  {
    path: '/',
    element: (
      <Suspense fallback={renderFallback()}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: 'search',
    element: (
      <Suspense fallback={renderFallback()}>
        <SearchPage />
      </Suspense>
    ),
  },
  {
    path: 'venues/:venueId',
    element: (
      <Suspense fallback={renderFallback()}>
        <VenueDetailsPage />
      </Suspense>
    ),
  },

  // ─────────────────────────────────────────────
  // GUEST ONLY (redirect if already authenticated)
  // ─────────────────────────────────────────────
  {
    element: <GuestGuard />,
    children: [
      {
        path: 'sign-in',
        element: (
          <AuthLayout>
            <Suspense fallback={renderFallback()}>
              <SignInPage />
            </Suspense>
          </AuthLayout>
        ),
      },
    ],
  },

  // ─────────────────────────────────────────────
  // AUTHENTICATED USER ROUTES (any logged-in user)
  // ─────────────────────────────────────────────
  {
    element: <AuthGuard />,
    children: [
      // Booking flow — accessible to any authenticated user
      {
        path: 'booking/:venueId',
        element: (
          <Suspense fallback={renderFallback()}>
            <BookingPage />
          </Suspense>
        ),
      },

      // USER role — consumer pages
      {
        element: <RoleGuard roles={[UserRole.USER]} />,
        children: [
          {
            path: 'my/bookings',
            element: (
              <Suspense fallback={renderFallback()}>
                <MyBookingsPage />
              </Suspense>
            ),
          },
          {
            path: 'my/bookings/:bookingId/payment',
            element: (
              <Suspense fallback={renderFallback()}>
                <PaymentPage />
              </Suspense>
            ),
          },
          {
            path: 'my/bookings/:bookingId',
            element: (
              <Suspense fallback={renderFallback()}>
                <BookingDetailsPage />
              </Suspense>
            ),
          },
          {
            path: 'my/favorites',
            element: (
              <Suspense fallback={renderFallback()}>
                <FavoritesPage />
              </Suspense>
            ),
          },
          {
            path: 'my/profile',
            element: (
              <Suspense fallback={renderFallback()}>
                <ProfilePage />
              </Suspense>
            ),
          },
        ],
      },

      // ─── VENUE OWNER ROUTES ───────────────────
      {
        element: <RoleGuard roles={[UserRole.VENUE_OWNER]} />,
        children: [
          {
            element: (
              <DashboardLayout>
                <Suspense fallback={renderFallback()}>
                  <Outlet />
                </Suspense>
              </DashboardLayout>
            ),
            children: [
              {
                path: 'owner',
                element: <OwnerDashboardPage />,
              },
              {
                path: 'owner/venues',
                element: <OwnerVenuesPage />,
              },
              {
                path: 'owner/venues/create',
                element: <CreateVenuePage />,
              },
              {
                path: 'owner/bookings',
                element: <OwnerBookingPage />,
              },
              {
                path: 'owner/bookings/:bookingId',
                element: <OwnerBookingDetailsPage />,
              },
            ],
          },
        ],
      },

      // ─── ADMIN ROUTES ─────────────────────────
      {
        element: <RoleGuard roles={[UserRole.ADMIN]} />,
        children: [
          {
            element: (
              <DashboardLayout>
                <Suspense fallback={renderFallback()}>
                  <Outlet />
                </Suspense>
              </DashboardLayout>
            ),
            children: [
              {
                path: 'admin',
                element: <AdminDashboardPage />,
              },
              {
                path: 'admin/users',
                element: <AdminUsersPage />,
              },
              {
                path: 'admin/venues',
                element: <AdminVenuesPage />,
              },
              {
                path: 'admin/users/create',
                element: <CreateUsersPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ERROR ROUTES
  // ─────────────────────────────────────────────
  {
    path: '404',
    element: (
      <Suspense fallback={renderFallback()}>
        <Page404 />
      </Suspense>
    ),
  },

  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];
