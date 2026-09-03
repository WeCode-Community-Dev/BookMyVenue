import { BrowserRouter, Routes, Route } from 'react-router';
import { AdminRedirect } from './components/common/AdminRedirect';

import HomePage from './pages/home';
import ExplorePage from './pages/Explore';
import RegisterPage from './pages/Auth/register';
import LoginPage from './pages/Auth/login';
import ForgotPasswordPage from './pages/Auth/forgotPassword';
import ResetPasswordPage from './pages/Auth/resetPassword';
import MainLayout from './layout/MainLayout';
import ListVenueLayout from './pages/listVenue/ListVenueLayout';
import MyVenues from './pages/listVenue/myVenue';
import AddVenue from './pages/listVenue/addVenue';
import AuthGuard from './components/common/AuthGuard';
import GuestGuard from './components/common/GuestGuard';
import VenueDetails from './pages/Explore/venueDetails';
import WishlistPage from './pages/Wishlist';
import BookingSummary from './pages/Booking/summary';
import BookingConfirmation from './pages/Booking/confirmation';
import MyBookingsPage from './pages/Booking/myBookings';
import BookingDetailsPage from './pages/Booking/bookingDetails';
import ProfilePage from './pages/Profile';
import NotFound from './pages/NotFound';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="venue/:id" element={<VenueDetails />} />
        </Route>

        {/* Guest-only Routes */}
        <Route element={<GuestGuard />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/booking/summary" element={<BookingSummary />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/booking/:bookingRefId" element={<BookingDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/list-venue" element={<ListVenueLayout />}>
            <Route path="add-venue" element={<AddVenue />} />
            <Route path="edit-venue/:venueId" element={<AddVenue />} />
            <Route path="my-venues" element={<MyVenues />} />
            <Route index element={<MyVenues />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
