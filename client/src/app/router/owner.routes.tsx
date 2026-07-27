/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import OwnerLayout from '../layouts/OwnerLayout';
import ErrorPage from '@/shared/pages/ErrorPage';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

const OwnerDashboard = lazy(() => import('@/features/dashboard/pages/OwnerDashboard'));
const OwnerVenuesList = lazy(() => import('@/features/venues/pages/OwnerVenuesList'));
const OwnerVenueDetails = lazy(() => import('@/features/venues/pages/OwnerVenueDetails'));
const VenueAvailabilityPage = lazy(() => import('@/features/venues/pages/VenueAvailabilityPage'));
const UserProfile = lazy(() => import('@/features/profile/pages/UserProfile'));
const OwnerBookingsList = lazy(() => import('@/features/bookings/pages/OwnerBookingsList'));
const OwnerBookingDetails = lazy(() => import('@/features/bookings/pages/OwnerBookingDetails'));
const OwnerRevenue = lazy(() => import('@/features/bookings/pages/OwnerRevenue'));

export const ownerRoutes = {
  path: '/owner',
  element: (
    <ProtectedRoute allowedRoles={['owner']} redirectPath="/signin">
      <OwnerLayout />
    </ProtectedRoute>
  ),
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <OwnerDashboard />,
    },
    {
      path: 'venues',
      element: <OwnerVenuesList />,
    },
    {
      path: 'venues/:id',
      element: <OwnerVenueDetails />,
    },
    {
      path: 'venues/:id/availability',
      element: <VenueAvailabilityPage />,
    },
    {
      path: 'bookings',
      element: <OwnerBookingsList />,
    },
    {
      path: 'bookings/:id',
      element: <OwnerBookingDetails />,
    },
    {
      path: 'revenue',
      element: <OwnerRevenue />,
    },
    {
      path: 'profile',
      element: <UserProfile />,
    },
  ],
};
