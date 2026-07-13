import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { OwnerLayout } from './components/OwnerLayout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const ManageVenues = lazy(() => import('./pages/ManageVenues'))
const Bookings = lazy(() => import('./pages/Bookings'))
const Financials = lazy(() => import('./pages/Financials'))

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const RegisterSuccess = lazy(() => import('./pages/RegisterSuccess'))
const LoginSuccess = lazy(() => import('./pages/LoginSuccess'))
const PendingApproval = lazy(() => import('./pages/PendingApproval'))
const Rejected = lazy(() => import('./pages/Rejected'))
const AcceptInvite = lazy(() => import('./pages/AcceptInvite'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

const CreateVenueWizard = lazy(() => import('./pages/venues/CreateVenueWizard'))
const VenueOverview = lazy(() => import('./pages/venues/VenueOverview'))
const VenueEdit = lazy(() => import('./pages/venues/VenueEdit'))
const VenueCalendarManagement = lazy(() => import('./pages/venues/VenueCalendarManagement'))
const VenuePricingRules = lazy(() => import('./pages/venues/VenuePricingRules'))
const VenueReviews = lazy(() => import('./pages/venues/VenueReviews'))
const BookingDetail = lazy(() => import('./pages/bookings/BookingDetail'))
const Reviews = lazy(() => import('./pages/Reviews'))
const ReviewDetail = lazy(() => import('./pages/ReviewDetail'))


// Placeholders for future pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
)

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/register/success', element: <RegisterSuccess /> },
  { path: '/login/success', element: <LoginSuccess /> },
  { path: '/accept-invite', element: <AcceptInvite /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/pending-approval', element: <PendingApproval /> },
  { path: '/rejected', element: <Rejected /> },
  { path: '/403', element: <div>Access denied. You need a venue owner account.</div> },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <OwnerLayout pageTitle="BookMyVenue Owner">
          <Outlet />
        </OwnerLayout>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      // Venues
      { path: 'venues', element: <ManageVenues /> },
      { path: 'venues/new', element: <CreateVenueWizard /> },
      { path: 'venues/:venueId/overview', element: <VenueOverview /> },
      { path: 'venues/:venueId/edit/*', element: <VenueEdit /> },
      { path: 'venues/:venueId/calendar', element: <VenueCalendarManagement /> },
      { path: 'venues/:venueId/pricing-rules', element: <VenuePricingRules /> },

      // Reviews
      { path: 'reviews', element: <Reviews /> },
      { path: 'reviews/:reviewId', element: <ReviewDetail /> },

      // Bookings
      { path: 'bookings', element: <Bookings /> },
      { path: 'bookings/:bookingId', element: <BookingDetail /> },

      // Financials
      {
        path: 'financials',
        children: [
          { index: true, element: <Financials /> },
          { path: 'ledger', element: <Placeholder title="Ledger" /> },
          { path: 'payouts', element: <Placeholder title="Payouts" /> }
        ]
      },

      // Settings
      {
        path: 'settings',
        children: [
          { index: true, element: <Placeholder title="Settings Overview" /> },
          { path: 'profile', element: <Placeholder title="Profile Settings" /> },
          { path: 'account', element: <Placeholder title="Account Settings" /> }
        ]
      }
    ]
  }
])
