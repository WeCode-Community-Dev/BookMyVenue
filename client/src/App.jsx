import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/Navbar/Navbar';

// Pages
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import VenuesPage from './pages/Venues/VenuesPage';
import VenueDetailPage from './pages/Venues/VenueDetailPage';
import BookingsPage from './pages/Bookings/BookingsPage';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import CreateVenuePage from './pages/Owner/CreateVenuePage';
import EditVenuePage from './pages/Owner/EditVenuePage';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Route Guards
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-bg-primary text-white">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/venues" element={<Navigate to="/bookings" replace />} />
              <Route path="/venues/:id" element={<VenueDetailPage />} />

              {/* User Protected Routes */}
              <Route
                path="/bookings"
                element={
                  <PrivateRoute>
                    <BookingsPage />
                  </PrivateRoute>
                }
              />

              {/* Owner Protected Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <RoleRoute allowedRoles={['venue_owner']}>
                    <OwnerDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/venues"
                element={
                  <RoleRoute allowedRoles={['venue_owner']}>
                    <CreateVenuePage />
                  </RoleRoute>
                }
              />
              <Route
                path="/owner/venues/edit/:id"
                element={
                  <RoleRoute allowedRoles={['venue_owner']}>
                    <EditVenuePage />
                  </RoleRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#232147',
                color: '#FFFFFE',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
