

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import VenueOwnerRegisterPage from "./pages/VenueOwnerRegisterPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import OwnerVenuesPage from "./pages/OwnerVenuesPage";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import OwnerVenueManagePage from "./pages/OwnerVenueManagePage";
import OwnerVenueEditPage from "./pages/OwnerVenueEditPage";

import RequireAuth from "./components/RequireAuth";
import RequireVenueOwner from "./components/RequireVenueOwner";

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
          <Route path="/register-venue-owner" element={<VenueOwnerRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPlaceholder />} />

          {/* Customer routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
          </Route>

          {/* Venue owner routes */}
          <Route element={<RequireVenueOwner />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/venues" element={<OwnerVenuesPage />} />
            <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
            <Route path="/owner/venues/:id/manage" element={<OwnerVenueManagePage />} />
            <Route path="/owner/venues/:id/edit" element={<OwnerVenueEditPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;