import { Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ErrorPage from '@/shared/pages/ErrorPage';
import CategoriesList from '@/features/categories/pages/CategoriesList';
import CategoryDetails from '@/features/categories/pages/CategoryDetails';
import UsersList from '@/features/users/pages/UsersList';
import UserDetails from '@/features/users/pages/UserDetails';
import AdminVenuesList from '@/features/admin/pages/AdminVenuesList';
import AdminVenueDetails from '@/features/admin/pages/AdminVenueDetails';
import AdminSettlements from '@/features/admin/pages/AdminSettlements';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import AdminDashboard from '@/features/dashboard/pages/AdminDashboard';
import UserProfile from '@/features/profile/pages/UserProfile';
import AdminTransactions from '@/features/admin/pages/AdminTransactions';

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
