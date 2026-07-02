import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import DashboardPage from "./pages/DashboardPage";
import RequireAuth from "./components/RequireAuth";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import VenueOwnerRegisterPage from "./pages/VenueOwnerRegisterPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import RequireVenueOwner from "./components/RequireVenueOwner";
import OwnerVenuesPage from "./pages/OwnerVenuesPage";

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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/register-venue-owner"
            element={<VenueOwnerRegisterPage />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPlaceholder />}
          />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<RequireVenueOwner />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          </Route>
          <Route path="/owner/venues" element={<OwnerVenuesPage />} />
          {/* <Route
            path="/owner/bookings"
            element={<OwnerSectionPlaceholder title="Bookings" />}
          />
          <Route
            path="/owner/enquiries"
            element={<OwnerSectionPlaceholder title="Enquiries" />}
          />
          <Route
            path="/owner/revenue"
            element={<OwnerSectionPlaceholder title="Revenue" />}
          />
          <Route
            path="/owner/reviews"
            element={<OwnerSectionPlaceholder title="Reviews" />}
          />
          <Route
            path="/owner/messages"
            element={<OwnerSectionPlaceholder title="Messages" />}
          /> */}

          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
