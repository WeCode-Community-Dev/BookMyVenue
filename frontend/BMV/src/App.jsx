import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/my-bookings" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />
      <Route path="/bookings/:id" element={<BookingDetailPage />} />
      <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
    </Routes>
  );
}

export default App;