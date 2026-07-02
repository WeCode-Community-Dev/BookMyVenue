

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import DashboardPage from "./pages/DashboardPage";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import PendingVenuesPage from "./pages/admin/PendingVenuesPage";
import VenuesPage from "./pages/admin/VenuesPage";
import VenueEditPage from "./pages/admin/VenueEditPage";
import VenueCreatePage from "./pages/admin/VenueCreatePage";
import BookingsPage from "./pages/admin/BookingsPage";
import UsersPage from "./pages/admin/UsersPage";
import UserCreatePage from "./pages/admin/UserCreatePage";
import UserEditPage from "./pages/admin/UserEditPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import VenueListPage from "./modules/venues/pages/VenueListPage";
import VenueDetailPage from "./modules/venues/pages/VenueDetailPage";
import MyVenuesPage from "./modules/venues/pages/MyVenuesPage";
import AddVenuePage from "./modules/venues/pages/AddVenuePage";
import EditVenuePage from "./modules/venues/pages/EditVenuePage";

function ForgotPasswordPlaceholder() {
  return (
    <div className="flex items-center justify-center h-screen text-gray-600 text-sm">
      Forgot Password page coming soon.
    </div>
  );
}

// the root page should depend on login, logged in users go to dashboard, others go to login
function RootRedirect() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPlaceholder />}
          />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-venues" element={<MyVenuesPage />} />
            <Route path="/venues/add" element={<AddVenuePage />} />
            <Route path="/venues/:id/edit" element={<EditVenuePage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/my-bookings" element={<OrderHistoryPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
          </Route>
          <Route path="/venues" element={<VenueListPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />

          {/* superadmin panel routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/pending" element={<PendingVenuesPage />} />
              <Route path="/admin/venues" element={<VenuesPage />} />
              <Route path="/admin/venues/new" element={<VenueCreatePage />} />
              <Route path="/admin/venues/:id/edit" element={<VenueEditPage />} />
              <Route path="/admin/bookings" element={<BookingsPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/new" element={<UserCreatePage />} />
              <Route path="/admin/users/:id/edit" element={<UserEditPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
