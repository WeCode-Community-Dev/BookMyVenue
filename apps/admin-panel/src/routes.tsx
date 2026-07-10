import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const LoginSuccess = lazy(() => import('./pages/LoginSuccess'))
const Forbidden = lazy(() => import('./pages/Forbidden'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))
const Bookings = lazy(() => import('./pages/Bookings'))
const Users = lazy(() => import('./pages/Users'))
const VenueOwners = lazy(() => import('./pages/VenueOwners'))
const VenueApprovals = lazy(() => import('./pages/VenueApprovals'))
const Amenities = lazy(() => import('./pages/Amenities'))
const Categories = lazy(() => import('./pages/Categories'))
const AuditLog = lazy(() => import('./pages/AuditLog'))
const DeepResearchInsights = lazy(() => import('./pages/DeepResearchInsights'))
const ExternalReservations = lazy(() => import('./pages/ExternalReservations'))

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
