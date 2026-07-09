import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import LoginSuccess from './pages/LoginSuccess'
import Forbidden from './pages/Forbidden'
import NotFound from './pages/NotFound'
import ComingSoon from './pages/ComingSoon'
import Bookings from './pages/Bookings'
import Users from './pages/Users'
import VenueOwners from './pages/VenueOwners'
import VenueApprovals from './pages/VenueApprovals'
import Amenities from './pages/Amenities'
import Categories from './pages/Categories'
import AuditLog from './pages/AuditLog'
import DeepResearchInsights from './pages/DeepResearchInsights'
import ExternalReservations from './pages/ExternalReservations'

export const router = createBrowserRouter([
  // Auth
  { path: '/login', element: <Login /> },
  { path: '/login/success', element: <LoginSuccess /> },
  { path: '/403', element: <Forbidden /> },

  // Root → dashboard
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // Protected routes
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/venues/pending',
    element: <ProtectedRoute><VenueApprovals /></ProtectedRoute>,
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: '/owners',
    element: (
      <ProtectedRoute>
        <VenueOwners />
      </ProtectedRoute>
    ),
  },
  {
    path: '/amenities',
    element: (
      <ProtectedRoute>
        <Amenities />
      </ProtectedRoute>
    ),
  },
  {
    path: '/categories',
    element: (
      <ProtectedRoute>
        <Categories />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bookings',
    element: (
      <ProtectedRoute>
        <Bookings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/audit-log',
    element: <ProtectedRoute><AuditLog /></ProtectedRoute>,
  },
  {
    path: '/deep-research-insights',
    element: <ProtectedRoute><DeepResearchInsights /></ProtectedRoute>,
  },
  {
    path: '/external-reservations',
    element: <ProtectedRoute><ExternalReservations /></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <ComingSoon
          title="Admin Settings"
          description="System configuration, notification settings, and platform-wide preferences. Coming soon."
        />
      </ProtectedRoute>
    ),
  },

  // Catch-all → 404
  { path: '*', element: <NotFound /> },
])
