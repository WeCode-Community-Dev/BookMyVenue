import { Navigate } from 'react-router-dom';
import OwnerLayout from '../layouts/OwnerLayout';
import ErrorPage from '@/shared/pages/ErrorPage';

import ProtectedRoute from '@/shared/components/ProtectedRoute';

import OwnerDashboard from '@/features/dashboard/pages/OwnerDashboard';
import OwnerVenuesList from '@/features/venues/pages/OwnerVenuesList';
import OwnerVenueDetails from '@/features/venues/pages/OwnerVenueDetails';
import VenueAvailabilityPage from '@/features/venues/pages/VenueAvailabilityPage';
import UserProfile from '@/features/profile/pages/UserProfile';
import OwnerBookingsList from '@/features/bookings/pages/OwnerBookingsList';
import OwnerBookingDetails from '@/features/bookings/pages/OwnerBookingDetails';
import OwnerRevenue from '@/features/bookings/pages/OwnerRevenue';

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
