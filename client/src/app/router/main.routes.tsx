/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import ErrorPage from '@/shared/pages/ErrorPage';
import MainLayout from '../layouts/MainLayout';

const HomePage = lazy(() => import('@/features/public/pages/HomePage'));
const VenueListPage = lazy(() => import('@/features/public/pages/VenueListPage'));
const VenueDetailsPage = lazy(() => import('@/features/public/pages/VenueDetailsPage'));
const UserProfile = lazy(() => import('@/features/profile/pages/UserProfile'));
const Wishlist = lazy(() => import('@/features/profile/pages/Wishlist'));
const BookingPage = lazy(() => import('@/features/bookings/pages/BookingPage'));
const BookingDetailPage = lazy(() => import('@/features/bookings/pages/BookingDetailPage'));
const UserBookingsPage = lazy(() => import('@/features/users/pages/UserBookingsPage'));
const UserWallet = lazy(() => import('@/features/wallet/pages/UserWallet'));
const PaymentHistory = lazy(() => import('@/features/wallet/pages/PaymentHistory'));

export const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorPage />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'venues', element: <VenueListPage /> },
    { path: 'venues/:id', element: <VenueDetailsPage /> },
    { path: 'account/profile', element: <UserProfile /> },
    { path: 'favorites', element: <Wishlist /> },
    { path: 'account/bookings', element: <UserBookingsPage /> },
    { path: 'account/bookings/:id', element: <BookingDetailPage /> },
    { path: '/bookings/:id', element: <BookingPage /> },
    { path: 'account/wallet', element: <UserWallet /> },
    { path: 'account/payment-history', element: <PaymentHistory /> },
  ],
};
