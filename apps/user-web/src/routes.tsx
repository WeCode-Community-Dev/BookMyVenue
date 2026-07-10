import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'

const Landing = lazy(() => import('./pages/Landing'))
const Search = lazy(() => import('./pages/Search'))
const VenueDetails = lazy(() => import('./pages/VenueDetails'))
const MyBookings = lazy(() => import('./pages/MyBookings'))
const Login = lazy(() => import('./pages/Login'))
const LoginSuccess = lazy(() => import('./pages/LoginSuccess'))
const Register = lazy(() => import('./pages/Register'))
const RegisterSuccess = lazy(() => import('./pages/RegisterSuccess'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Checkout = lazy(() => import('./pages/Checkout'))
const BookingDetails = lazy(() => import('./pages/BookingDetails'))
const Payment = lazy(() => import('./pages/Payment'))
const Profile = lazy(() => import('./pages/Profile'))
const Notifications = lazy(() => import('./pages/Notifications'))
const PaymentResult = lazy(() => import('./pages/PaymentResult'))
const DeepResearch = lazy(() => import('./pages/DeepResearch'))
const SavedVenues = lazy(() => import('./pages/SavedVenues'))

export const router = createBrowserRouter([
  // public routes
  { path: '/', element: <Landing /> },
  { path: '/venues', element: <Search /> },
  { path: '/venues/:id', element: <VenueDetails /> },
  { path: '/login', element: <Login /> },
  { path: '/login/success', element: <LoginSuccess /> },
  { path: '/register', element: <Register /> },
  { path: '/register/success', element: <RegisterSuccess /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },

  // protected routes — require any authenticated user
  {
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-bookings',
    element: (
      <ProtectedRoute>
        <MyBookings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bookings/:id',
    element: (
      <ProtectedRoute>
        <BookingDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/:bookingId',
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/result',
    element: (
      <ProtectedRoute>
        <PaymentResult />
      </ProtectedRoute>
    ),
  },
  {
    path: '/deep-research',
    element: (
      <ProtectedRoute>
        <DeepResearch />
      </ProtectedRoute>
    ),
  },
  {
    path: '/saved',
    element: (
      <ProtectedRoute>
        <SavedVenues />
      </ProtectedRoute>
    ),
  },

  // 403 fallback
  { path: '/403', element: <div>Access denied.</div> },
])
