/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ErrorPage from '@/shared/pages/ErrorPage';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

const CategoriesList = lazy(() => import('@/features/categories/pages/CategoriesList'));
const CategoryDetails = lazy(() => import('@/features/categories/pages/CategoryDetails'));
const UsersList = lazy(() => import('@/features/users/pages/UsersList'));
const UserDetails = lazy(() => import('@/features/users/pages/UserDetails'));
const AdminVenuesList = lazy(() => import('@/features/admin/pages/AdminVenuesList'));
const AdminVenueDetails = lazy(() => import('@/features/admin/pages/AdminVenueDetails'));
const AdminSettlements = lazy(() => import('@/features/admin/pages/AdminSettlements'));
const AdminDashboard = lazy(() => import('@/features/dashboard/pages/AdminDashboard'));
const UserProfile = lazy(() => import('@/features/profile/pages/UserProfile'));
const AdminTransactions = lazy(() => import('@/features/admin/pages/AdminTransactions'));
const AdminBookingsList = lazy(() => import('@/features/admin/pages/AdminBookingsList'));

export const adminRoutes = {
  path: '/admin',
  element: (
    <ProtectedRoute allowedRoles={['admin']} redirectPath="/signin">
      <AdminLayout />
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
      element: <AdminDashboard />,
    },
    {
      path: 'categories',
      element: <CategoriesList />,
    },
    {
      path: 'categories/:id',
      element: <CategoryDetails />,
    },
    {
      path: 'users',
      element: <UsersList />,
    },
    {
      path: 'users/:id',
      element: <UserDetails />,
    },
    {
      path: 'venues',
      element: <AdminVenuesList />,
    },
    {
      path: 'venues/:id',
      element: <AdminVenueDetails />,
    },
    {
      path: 'bookings',
      element: <AdminBookingsList />,
    },
    {
      path: 'settlements',
      element: <AdminSettlements />,
    },
    {
      path: 'transactions',
      element: <AdminTransactions />,
    },
    {
      path: 'profile',
      element: <UserProfile />,
    },
  ],
};
