import ErrorPage from '@/shared/pages/ErrorPage';
import MainLayout from '../layouts/MainLayout';
import HomePage from '@/features/public/pages/HomePage';
import VenueListPage from '@/features/public/pages/VenueListPage';
import VenueDetailsPage from '@/features/public/pages/VenueDetailsPage';
import UserProfile from '@/features/profile/pages/UserProfile';
import BookingPage from '@/features/bookings/pages/BookingPage';
import BookingDetailPage from '@/features/bookings/pages/BookingDetailPage';
import UserBookingsPage from '@/features/users/pages/UserBookingsPage';
import UserWallet from '@/features/wallet/pages/UserWallet';
import PaymentHistory from '@/features/wallet/pages/PaymentHistory';

export const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorPage />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'venues', element: <VenueListPage /> },
    { path: 'venues/:id', element: <VenueDetailsPage /> },
    { path: 'account/profile', element: <UserProfile /> },
    { path: 'account/bookings', element: <UserBookingsPage /> },
    { path: 'account/bookings/:id', element: <BookingDetailPage /> },
    { path: '/bookings/:id', element: <BookingPage /> },
    { path: 'account/wallet', element: <UserWallet /> },
    { path: 'account/payment-history', element: <PaymentHistory /> },
  ],
};
