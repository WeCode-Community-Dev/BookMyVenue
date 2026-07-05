import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Search from './pages/Search'
import VenueDetails from './pages/VenueDetails'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import LoginSuccess from './pages/LoginSuccess'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess'
import Checkout from './pages/Checkout'
import BookingDetails from './pages/BookingDetails'
import Payment from './pages/Payment'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import PaymentResult from './pages/PaymentResult'
import DeepResearch from './pages/DeepResearch'

export const router = createBrowserRouter([
  // public routes
  { path: '/', element: <Landing /> },
  { path: '/venues', element: <Search /> },
  { path: '/venues/:id', element: <VenueDetails /> },
  { path: '/login', element: <Login /> },
  { path: '/login/success', element: <LoginSuccess /> },
  { path: '/register', element: <Register /> },
  { path: '/register/success', element: <RegisterSuccess /> },

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

  // 403 fallback
  { path: '/403', element: <div>Access denied.</div> },
])

