import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import BookerDashboard from "./pages/bookerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CreateVenue from "./pages/owner/CreateVenue";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import Home from "./pages/Home";
import VenueDetail from "./pages/VenueDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["booker"]}>
                <BookerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["RoleEnum.ADMIN"]}>
                <AdminDashboard />
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
          <Route path="/venues/:venueId" element={<VenueDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;