import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import HomePage from "../pages/HomePage"
import AdminLayout from "../layouts/AdminLayout"
import UserLayout from "../layouts/UserLayout"
import VenueLayout from "../layouts/VenueLayout"
import { GuestRoute, ProtectedRoute, UserProtectedRoute } from "./ProtectedRoute"

const ExploreVenuesPage = lazy(() => import("../pages/ExploreVenuesPage"))
const ProfilePage = lazy(() => import("../pages/ProfilePage"))
const BookingDetailPage = lazy(() => import("../pages/BookingDetailPage"))
const VenueDetailsPage = lazy(() => import("../pages/VenueDetailsPage"))
const AdminDashboardPage = lazy(() => import("../apps/admin/pages/AdminDashboardPage"))
const AdminUsersListPage = lazy(() => import("../apps/admin/pages/AdminUsersListPage"))
const VenueBookingsPage = lazy(() => import("../apps/venue/pages/VenueBookingsPage"))
const VenueTransactionsPage = lazy(() => import("../apps/venue/pages/VenueTransactionsPage"))
const VenueAuthPage = lazy(() => import("../apps/venue/pages/VenueAuthPage"))
const VenueDashboardPage = lazy(() => import("../apps/venue/pages/VenueDashboardPage"))
const VenueListPage = lazy(() => import("@/apps/venue/pages/VenueListPage"))
const AddVenuePage = lazy(() => import("@/apps/venue/pages/AddVenuePage"))

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-32">
      <div className="w-full max-w-md space-y-4" aria-hidden="true">
        <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="venues" element={<ExploreVenuesPage />} />
            <Route path="venues/:slug" element={<VenueDetailsPage />} />
            <Route
              path="bookings/:bookingId"
              element={
                <UserProtectedRoute message="Sign in to view your booking details.">
                  <BookingDetailPage />
                </UserProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <UserProtectedRoute message="Sign in to view your profile and bookings.">
                  <ProfilePage />
                </UserProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/venue/auth"
            element={
              <GuestRoute allowedRole="venue" redirectTo="/venue">
                <VenueAuthPage />
              </GuestRoute>
            }
          />

          <Route
            path="/venue"
            element={
              <ProtectedRoute requiredRole="venue" loginPath="/venue/auth">
                <VenueLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<VenueDashboardPage />} />
            <Route path="bookings" element={<VenueBookingsPage />} />
            <Route path="transactions" element={<VenueTransactionsPage />} />
            <Route path="venues" element={<VenueListPage />} />
            <Route path="venues/add" element={<AddVenuePage />} />
            <Route path="venues/:slug" element={<AddVenuePage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersListPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
