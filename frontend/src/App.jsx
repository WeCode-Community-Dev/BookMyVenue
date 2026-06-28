import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/guest/Home";
import Venues from "./pages/guest/Venues";
import VenueDetails from "./pages/guest/VenueDetails";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPasswod";

import Profile from "./pages/user/Profile";
import MyBookings from "./pages/user/MyBookings";
import ProviderDashboard from "./pages/provider/Dashboard";
import MyVenues from "./pages/provider/MyVenues";
import CreateVenue from "./pages/provider/CreateVenue";
import EditVenue from "./pages/provider/EditVenue";
import ManageAvailability from "./pages/provider/ManageAvailability";
import ProviderBookings from "./pages/provider/ProviderBookings";

import ProtectedRoute from "./components/protected/ProtectedRoutes";
import ProviderRoute from "./components/protected/ProviderRoute";
import ProviderLayout from "./layouts/ProviderLayout";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Toaster position="top-right" />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            element={
              <ProviderRoute>
                <ProviderLayout />
              </ProviderRoute>
            }
          >
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/venues" element={<MyVenues />} />
            <Route path="/provider/venues/new" element={<CreateVenue />} />
            <Route path="/provider/venues/:id/edit" element={<EditVenue />} />
            <Route
              path="/provider/venues/:id/availability"
              element={<ManageAvailability />}
            />
            <Route path="/provider/bookings" element={<ProviderBookings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;