import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import DashboardPage from "./pages/DashboardPage";
import RequireAuth from "./components/RequireAuth";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import CheckoutPage from "./pages/CheckoutPage";

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
            path="/forgot-password"
            element={<ForgotPasswordPlaceholder />}
          />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
