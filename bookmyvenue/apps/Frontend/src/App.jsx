import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VenueDetail from "./pages/venue/VenueDetail";

import BookerDashboard from "./pages/dashboard/BookerDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import CreateVenue from "./pages/owner/CreateVenue";
import EditVenue from "./pages/owner/EditVenue";
import ManageVenue from "./pages/owner/ManageVenue";
import ManageAvailability from "./pages/owner/ManageAvailability";
import OwnerVenueBookings from "./pages/owner/OwnerVenueBookings";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Home />} />
          <Route path="/venues/:venueId" element={<VenueDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Booker */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["booker"]}>
                <BookerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Owner */}

          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/create-venue"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <CreateVenue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/edit-venue/:id"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <EditVenue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/manage-venues"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ManageVenue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/availability/:id"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ManageAvailability />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerVenueBookings />
              </ProtectedRoute>
            }
          />

          {/* Admin */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;