import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AddVenuePage from "./pages/owner/AddVenuePage";
import OwnerVenueView from "./pages/owner/OwnerVenueView";
import EditVenuePage from "./pages/owner/EditVenuePage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect Home */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />

        <Route
           path="/admin/login"
           element={<AdminLoginPage />}
            />

        <Route
          path="/register/:role"
          element={<RegisterPage />}
        />

        {/* Customer Dashboard */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Owner Dashboard */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/add-venue"
          element={
          <ProtectedRoute allowedRoles={["owner"]}>
          <AddVenuePage />
          </ProtectedRoute>
          }
          />

          <Route
            path="/owner/venues/:id"
            element={
           <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerVenueView />
            </ProtectedRoute>
             }
            />

            <Route
              path="/owner/venues/:id/edit"
              element={
              <ProtectedRoute allowedRoles={["owner"]}>
              <EditVenuePage />
              </ProtectedRoute>
              }
            />

          {/* Root Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["root_admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;