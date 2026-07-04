import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import OwnerLogin from "./pages/OwnerLogin";
import Register from "./pages/Register";
import Venues from "./pages/Venues";
import Unauthorized from "./pages/Unauthorized";

import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterMyVenue from "./pages/RegisterMyVenue";
import VenueDetails from "./pages/VenueDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckStatus from "./pages/CheckStatus";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/venues" element={<Venues />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/venue/:id" element={<VenueDetails />} />
      <Route path="/check-status" element={<CheckStatus />} />
      {/* Owner Routes */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/register-venue"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <RegisterMyVenue />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;