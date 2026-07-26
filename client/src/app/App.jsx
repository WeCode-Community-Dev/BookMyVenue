import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { checkAuth } from "@/redux/slices/AuthSlice";
import PublicRoute from "@/components/auth/PublicRoute";
import RoleRoute from "@/components/auth/RoleRoute";
import { ROLES } from "@/constants/Roles";
import HomeRoute from "@/components/auth/HomeRoute";

// Auth Pages
const Register = lazy(() => import("@/presentation/pages/auth/Register"));
const VerifyOtp = lazy(() => import("@/presentation/pages/auth/VerifyOtp"));
const Login = lazy(() => import("@/presentation/pages/auth/Login"));
const ForgotPassword = lazy(() => import("@/presentation/pages/auth/ForgotPassword"))
const ResetPassword = lazy(() => import("@/presentation/pages/auth/ResetPassword"))

// Public/User Pages
const Home = lazy(() => import("@/presentation/pages/Home"));
const BrowseVenues = lazy(() => import("@/presentation/pages/user/BrowseVenue"));
const UserProfile = lazy(() => import("@/presentation/pages/user/UserProfile"));
const UserChangePassword = lazy(() => import("@/presentation/pages/user/ChangePassword"));
const Wishlist = lazy(() => import("@/presentation/pages/user/Wishlist"));
const UserBookings = lazy(() => import("@/presentation/pages/user/BookingHistory"));
const UserBookingsDetail = lazy(() => import("@/presentation/pages/user/BookingDetail"));
const UserVenueDetails = lazy(() => import("@/presentation/pages/user/VenueDetails"));
const BookingSummary = lazy(() => import("@/presentation/pages/user/BookingSummary"));
const UserPayment = lazy(() => import("@/presentation/pages/user/Payment"));
const UserPaymentSuccess = lazy(() => import("@/presentation/pages/user/PaymentSuccess"));
const UserPaymentFailure = lazy(() => import("@/presentation/pages/user/PaymentFailure"));

// Vendor Pages
const Dashboard = lazy(() => import("@/presentation/pages/vendor/Dashboard"));
const VenueList = lazy(() => import("@/presentation/pages/vendor/VenueList"));
const Bookings = lazy(() => import("@/presentation/pages/vendor/Bookings"));
const Profile = lazy(() => import("@/presentation/pages/vendor/Profile"));
const AddVenue = lazy(() => import("@/presentation/pages/vendor/AddVenue"));
const VendorVenueDetails = lazy(() => import("@/presentation/pages/vendor/VenueDetails"));
const EditVenue = lazy(() => import("@/presentation/pages/vendor/EditVenue"));
const Settings = lazy(() => import("@/presentation/pages/vendor/Settings"));

// Admin Layout & Pages
const AdminLayout = lazy(() => import("@/presentation/layouts/AdminLayout"));
const AdminLogin = lazy(() => import("@/presentation/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/presentation/pages/admin/Dashboard"));
const UserManagement = lazy(() => import("@/presentation/pages/admin/UserManagement"));
const VendorManagement = lazy(() => import("@/presentation/pages/admin/VendorManagement"));
const VenueManagement = lazy(() => import("@/presentation/pages/admin/VenueManagement"));
const VenueDetails = lazy(() => import("@/presentation/pages/admin/VenueDetails"));
const BookingDetails = lazy(() => import("@/presentation/pages/admin/BookingDetails"));
const BookingManagement = lazy(() => import("@/presentation/pages/admin/BookingManagement"));
const PaymentManagement = lazy(() => import("@/presentation/pages/admin/PaymentManagement"));
const PaymentDetails = lazy(() => import("@/presentation/pages/admin/PaymentDetails"));
const CategoryManagement = lazy(() => import("@/presentation/pages/admin/CategoryManagement"));

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className='flex h-screen items-center justify-content'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-600'></div>
        </div>
      }>
        <Routes>
          {/* Public / Auth Routes */}
          <Route path={ROUTES.PUBLIC.HOME} element={<HomeRoute><Home /></HomeRoute>} />
          <Route path={ROUTES.PUBLIC.REGISTER} element={<PublicRoute><Register /></PublicRoute>} />
          <Route path={ROUTES.PUBLIC.VERIFY_OTP} element={<PublicRoute><VerifyOtp /></PublicRoute>} />
          <Route path={ROUTES.PUBLIC.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
          <Route path={ROUTES.PUBLIC.FORGOT_PASSWORD} element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path={ROUTES.PUBLIC.RESET_PASSWORD} element={<PublicRoute><ResetPassword /></PublicRoute>} />


          {/* User Routes */}
          <Route path={ROUTES.USER.BROWSE_VENUES} element={<RoleRoute allowedRoles={["customer"]}><BrowseVenues /></RoleRoute>} />
          <Route path={ROUTES.USER.PROFILE} element={<RoleRoute allowedRoles={["customer"]}><UserProfile /></RoleRoute>} />
          <Route path={ROUTES.USER.CHANGE_PASSWORD} element={<RoleRoute allowedRoles={["customer"]}><UserChangePassword /></RoleRoute>} />
          <Route path={ROUTES.USER.WISHLIST} element={<RoleRoute allowedRoles={["customer"]}><Wishlist /></RoleRoute>} />
          <Route path={ROUTES.USER.BOOKINGS} element={<RoleRoute allowedRoles={["customer"]}><UserBookings /></RoleRoute>} />
          <Route path={ROUTES.USER.BOOKING_DETAIL} element={<RoleRoute allowedRoles={["customer"]}><UserBookingsDetail /></RoleRoute>} />
          <Route path={ROUTES.USER.VENUE_DETAILS} element={<RoleRoute allowedRoles={["customer"]}><UserVenueDetails /></RoleRoute>} />
          <Route path={ROUTES.USER.BOOKING_SUMMARY} element={<RoleRoute allowedRoles={["customer"]}><BookingSummary /></RoleRoute>} />
          <Route path={ROUTES.USER.PAYMENT} element={<RoleRoute allowedRoles={["customer"]}><UserPayment /></RoleRoute>} />
          <Route path={ROUTES.USER.PAYMENT_SUCCESS} element={<RoleRoute allowedRoles={["customer"]}><UserPaymentSuccess /></RoleRoute>} />
          <Route path={ROUTES.USER.PAYMENT_FAILURE} element={<RoleRoute allowedRoles={["customer"]}><UserPaymentFailure /></RoleRoute>} />

          {/* Vendor Routes */}
          <Route path={ROUTES.VENDOR.DASHBOARD} element={<RoleRoute allowedRoles={[ROLES.VENDOR]}><Dashboard /></RoleRoute>} />
          <Route path={ROUTES.VENDOR.VENUES} element={<RoleRoute allowedRoles={[ROLES.VENDOR]}><VenueList /></RoleRoute>} />
          <Route path={ROUTES.VENDOR.BOOKINGS} element={<RoleRoute allowedRoles={[ROLES.VENDOR]}><Bookings /></RoleRoute>} />
          <Route path={ROUTES.VENDOR.ADD_VENUE} element={<RoleRoute allowedRoles={[ROLES.VENDOR]}><AddVenue /></RoleRoute>} />
          <Route path={ROUTES.VENDOR.PROFILE} element={<RoleRoute allowedRoles={[ROLES.VENDOR]}><Profile /></RoleRoute>} />
          <Route path={ROUTES.VENDOR.SETTINGS} element={<RoleRoute allowedRoles={[ROLES.VENDOR]}><Settings /></RoleRoute>} />
          <Route path={ROUTES.VENDOR.VENUE_DETAILS} element={<RoleRoute allowedRoles={[ROLES.VENDOR]}><VendorVenueDetails /></RoleRoute>} />
          <Route path={ROUTES.VENDOR.EDIT_VENUE} element={<RoleRoute allowedRoles={[ROLES.VENDOR]}><EditVenue /></RoleRoute>} />

          {/* Standalone Admin Login (No Layout) */}
          <Route path={ROUTES.ADMIN.LOGIN} element={<PublicRoute><AdminLogin /></PublicRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<RoleRoute allowedRoles={[ROLES.ADMIN]}><AdminLayout /></RoleRoute>}>
            <Route
              path={ROUTES.ADMIN.DASHBOARD}
              element={<AdminDashboard />}
            />

            <Route
              path={ROUTES.ADMIN.USERS}
              element={<UserManagement />}
            />

            <Route
              path={ROUTES.ADMIN.VENDORS}
              element={<VendorManagement />}
            />

            <Route
              path={ROUTES.ADMIN.VENUES}
              element={<VenueManagement />}
            />

            <Route
              path={ROUTES.ADMIN.VENUE_DETAILS}
              element={<VenueDetails />}
            />

            <Route
              path={ROUTES.ADMIN.BOOKINGS}
              element={<BookingManagement />}
            />

            <Route
              path={ROUTES.ADMIN.BOOKING_DETAIL}
              element={<BookingDetails />}
            />

            <Route
              path={ROUTES.ADMIN.PAYMENTS}
              element={<PaymentManagement />}
            />

            <Route
              path={ROUTES.ADMIN.PAYMENT_DETAILS}
              element={<PaymentDetails />}
            />

            <Route
              path={ROUTES.ADMIN.CATEGORIES}
              element={<CategoryManagement />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;