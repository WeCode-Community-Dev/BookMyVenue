
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import VenueOwnerRegisterPage from "./pages/VenueOwnerRegisterPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import OwnerVenuesPage from "./pages/OwnerVenuesPage";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import OwnerVenueManagePage from "./pages/OwnerVenueManagePage";
import OwnerVenueEditPage from "./pages/OwnerVenueEditPage";
import OwnerReviewsPage from "./pages/OwnerReviewsPage";

import VenueListPage from "./modules/venues/pages/VenueListPage";
import VenueDetailPage from "./modules/venues/pages/VenueDetailPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import PendingVenuesPage from "./pages/admin/PendingVenuesPage";
import AdminVenuesPage from "./pages/admin/VenuesPage";
import VenueCreatePage from "./pages/admin/VenueCreatePage";
import AdminVenueEditPage from "./pages/admin/VenueEditPage";
import AdminBookingsPage from "./pages/admin/BookingsPage";
import AdminUsersPage from "./pages/admin/UsersPage";
import UserCreatePage from "./pages/admin/UserCreatePage";
import UserEditPage from "./pages/admin/UserEditPage";

import RequireAuth from "./components/RequireAuth";
import RequireVenueOwner from "./components/RequireVenueOwner";
import RequireAdmin from "./components/RequireAdmin";
import AdminLayout from "./components/admin/AdminLayout";

function ForgotPasswordPlaceholder() {
  return (
    <div className="flex items-center justify-center h-screen text-gray-600 text-sm">
      Forgot Password page coming soon.
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-venue-owner" element={<VenueOwnerRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPlaceholder />} />

          <Route path="/venues" element={<VenueListPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/my-bookings" element={<OrderHistoryPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
          </Route>

          <Route element={<RequireVenueOwner />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/venues" element={<OwnerVenuesPage />} />
            <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
            <Route path="/owner/venues/:id/manage" element={<OwnerVenueManagePage />} />
            <Route path="/owner/venues/:id/edit" element={<OwnerVenueEditPage />} />
            <Route path="/owner/reviews" element={<OwnerReviewsPage />} />
          </Route>

          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="pending" element={<PendingVenuesPage />} />
              <Route path="venues" element={<AdminVenuesPage />} />
              <Route path="venues/new" element={<VenueCreatePage />} />
              <Route path="venues/:id/edit" element={<AdminVenueEditPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/new" element={<UserCreatePage />} />
              <Route path="users/:id/edit" element={<UserEditPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
