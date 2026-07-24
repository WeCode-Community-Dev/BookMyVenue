import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import BrowseVenues from "@/presentation/pages/user/BrowseVenue";
import VenueDetails from "@/presentation/pages/admin/VenueDetails";


const Register = lazy(() => import("@/presentation/pages/auth/Register"))
const VerifyOtp = lazy(() => import("@/presentation/pages/auth/VerifyOtp"))


// Public/User Pages
const Home = lazy(() => import("@/presentation/pages/Home"));

const UserProfile = lazy(() =>
  import("@/presentation/pages/user/UserProfile")
);

const UserChangePassword = lazy(() =>
  import("@/presentation/pages/user/ChangePassword")
);

const Wishlist = lazy(() => import("@/presentation/pages/user/Wishlist"));

const UserBookings = lazy(() =>
  import("@/presentation/pages/user/BookingHistory")
);

const UserBookingsDetail = lazy(() =>
  import("@/presentation/pages/user/BookingDetail")
);

const UserVenueDetails = lazy(() =>
  import("@/presentation/pages/user/VenueDetails")
);

const BookingSummary = lazy(() =>
  import("@/presentation/pages/user/BookingSummary")
);

const UserPayment = lazy(() =>
  import("@/presentation/pages/user/Payment")
);

const UserPaymentSuccess = lazy(() =>
  import("@/presentation/pages/user/PaymentSuccess")
);

const UserPaymentFailure = lazy(() =>
  import("@/presentation/pages/user/PaymentFailure")
);

// Vendor Pages
const Dashboard = lazy(() =>
  import("@/presentation/pages/vendor/Dashboard")
);

const VenueList = lazy(() =>
  import("@/presentation/pages/vendor/VenueList")
);

const Bookings = lazy(() =>
  import("@/presentation/pages/vendor/Bookings")
);

const Profile = lazy(() =>
  import("@/presentation/pages/vendor/Profile")
);

const AddVenue = lazy(() =>
  import("@/presentation/pages/vendor/AddVenue")
);

const VendorVenueDetails = lazy(() =>
  import("@/presentation/pages/vendor/VenueDetails")
);

const EditVenue = lazy(() =>
  import("@/presentation/pages/vendor/EditVenue")
);

const Settings = lazy(() =>
  import("@/presentation/pages/vendor/Settings")
);

// Admin Layout
const AdminLayout = lazy(() =>
  import("@/presentation/layouts/AdminLayout")
);

// Admin Pages
const AdminDashboard = lazy(() =>
  import("@/presentation/pages/admin/Dashboard")
);

const UserManagement = lazy(() =>
  import("@/presentation/pages/admin/UserManagement")
);

const VendorManagement = lazy(() =>
  import("@/presentation/pages/admin/VendorManagement")
);

const VenueManagement = lazy(() =>
  import("@/presentation/pages/admin/VenueManagement")
);

const BookingDetails = lazy(() =>
  import("@/presentation/pages/admin/BookingDetails")
);

const BookingManagement = lazy(() =>
  import("@/presentation/pages/admin/BookingManagement")
);

const PaymentManagement = lazy(() =>
  import("@/presentation/pages/admin/PaymentManagement")
);

const PaymentDetails = lazy(() =>
  import("@/presentation/pages/admin/PaymentDetails")
);

const CategoryManagement = lazy(() =>
  import("@/presentation/pages/admin/CategoryManagement")
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          {/* Public/User Routes */}
          <Route path={ROUTES.PUBLIC.HOME} element={<Home />} />
          <Route
            path={ROUTES.USER.BROWSE_VENUES}
            element={<BrowseVenues />}
          />
          <Route path={ROUTES.USER.PROFILE} element={<UserProfile />} />
          <Route
            path={ROUTES.USER.CHANGE_PASSWORD}
            element={<UserChangePassword />}
          />
          <Route path={ROUTES.USER.WISHLIST} element={<Wishlist />} />
          <Route path={ROUTES.USER.BOOKINGS} element={<UserBookings />} />
          <Route
            path={ROUTES.USER.BOOKING_DETAIL}
            element={<UserBookingsDetail />}
          />
          <Route
            path={ROUTES.USER.VENUE_DETAILS}
            element={<UserVenueDetails />}
          />
          <Route
            path={ROUTES.USER.BOOKING_SUMMARY}
            element={<BookingSummary />}
          />
          <Route
            path={ROUTES.USER.PAYMENT}
            element={<UserPayment />}
          />
          <Route
            path={ROUTES.USER.PAYMENT_SUCCESS}
            element={<UserPaymentSuccess />}
          />
          <Route
            path={ROUTES.USER.PAYMENT_FAILURE}
            element={<UserPaymentFailure />}
          />

          {/* Auth Routes */}
          <Route
            path={ROUTES.PUBLIC.REGISTER}
            element={<Register />}
          />


     <Route path={ROUTES.PUBLIC.REGISTER} element={<Register />} />
     <Route path={ROUTES.PUBLIC.VERIFY_OTP} element={<VerifyOtp />}/>

          {/* Vendor Routes */}
          <Route
            path={ROUTES.VENDOR.DASHBOARD}
            element={<Dashboard />}
          />
          <Route
            path={ROUTES.VENDOR.VENUES}
            element={<VenueList />}
          />
          <Route
            path={ROUTES.VENDOR.BOOKINGS}
            element={<Bookings />}
          />
          <Route
            path={ROUTES.VENDOR.ADD_VENUE}
            element={<AddVenue />}
          />
          <Route
            path={ROUTES.VENDOR.PROFILE}
            element={<Profile />}
          />
          <Route
            path={ROUTES.VENDOR.SETTINGS}
            element={<Settings />}
          />
          <Route
            path={ROUTES.VENDOR.VENUE_DETAILS}
            element={<VendorVenueDetails />}
          />
          <Route
            path={ROUTES.VENDOR.EDIT_VENUE}
            element={<EditVenue />}
          />


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
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
              path="categories"
              element={<CategoryManagement />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;