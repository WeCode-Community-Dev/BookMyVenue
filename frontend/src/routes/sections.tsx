import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth-guard';
import { UserRole } from 'src/context/auth/auth.types';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// admin pages 
export const AdminVenuesPage = lazy(() => import('src/pages/admin/venues/list'));
export const AdminUsersPage = lazy(() => import('src/pages/admin/users/list'));
export const CreateUsersPage = lazy(() => import('src/pages/admin/users/create'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
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
  /**
   * Authenticated Routes
   */
  {
    element: <AuthGuard />,

    children: [
      {
        element: (
          <RoleGuard
            roles={[UserRole.USER]}
          />
        ),
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
                index: true,
                element: <DashboardPage />,
              },

              {
                path: 'users',
                element: <UserPage />
              },

              {
                path: 'products',
                element: <ProductsPage />,
              },

              {
                path: 'blog',
                element: <BlogPage />,
              },
              {
                path: 'profile',
                // element: <ProfilePage />,
                element: <h1>Profile Page</h1>,
              },

              {
                path: 'bookings',
                // element: <MyBookingsPage />,
                element: <h1>My Bookings Page</h1>,
              },

              {
                path: 'favorites',
                // element: <FavoritesPage />,
                element: <h1>Favorites Page</h1>,
              },
            ],
          },
        ]
      },
      /**
       * Venue Owner Routes
       */
      {
        element: (
          <RoleGuard
            roles={[UserRole.VENUE_OWNER]}
          />
        ),

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
                // element: <OwnerDashboardPage />,
                element: <h1>Owner Dashboard Page</h1>,
              },

              {
                path: 'owner/venues',
                // element: <OwnerVenuesPage />,
                element: <h1>Owner Venues Page</h1>,
              },

              {
                path: 'owner/venues/new',
                // element: <CreateVenuePage />,
                element: <h1>Create Venue Page</h1>,
              },

              {
                path: 'owner/bookings',
                // element: <OwnerBookingsPage />,
                element: <h1>Owner Bookings Page</h1>,
              },

              {
                path: 'owner/analytics',
                // element: <OwnerAnalyticsPage />,
                element: <h1>Owner Analytics Page</h1>,
              },
            ],
          },
        ],
      },

      /**
       * Admin Routes
       */
      {
        element: (
          <RoleGuard
            roles={[UserRole.ADMIN]}
          />
        ),

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
                // element: <AdminDashboardPage />,
                element: <h1>Admin Dashboard Page</h1>,
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


  // /**
  //  * Guest Only
  //  */
  // {
  //   element: <GuestGuard />,

  //   children: [
  //     {
  //       path: 'sign-in',
  //       element: (
  //         <AuthLayout>
  //           <SignInPage />
  //         </AuthLayout>
  //       ),
  //     },

  //     {
  //       path: 'sign-up',
  //       element: (
  //         <AuthLayout>
  //           <SignUpPage />
  //         </AuthLayout>
  //       ),
  //     },
  //   ],
  // },

  /**
   * Errors
   */
  // {
  //   path: '403',
  //   element: <Page403 />,
  // },

  {
    path: '404',
    element: <Page404 />,
  },

  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },

  {
    path: 'sign-in',
    element: <AuthLayout>
      <SignInPage />,
    </AuthLayout>
  },
];
