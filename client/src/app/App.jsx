import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Suspense,lazy } from "react";
import { ROUTES } from "@/constants/routes";
import BrowseVenues from "@/presentation/pages/user/BrowseVenue";


const Home = lazy(() => import("@/presentation/pages/Home"))

const UserProfile = lazy(() => import("@/presentation/pages/user/UserProfile"))
const UserChangePassword = lazy(() => import("@/presentation/pages/user/ChangePassword"))
const Wishlist = lazy(() => import("@/presentation/pages/user/Wishlist"))
const UserBookings = lazy(() => import("@/presentation/pages/user/BookingHistory"))
const UserBookingsDetail = lazy(() => import("@/presentation/pages/user/BookingDetail"))

const Dashboard=lazy(()=>
import("@/presentation/pages/vendor/Dashboard")
);

const VenueList=lazy(()=>
import("@/presentation/pages/vendor/VenueList"))

const Bookings=lazy(()=>
import("@/presentation/pages/vendor/Bookings"))

const Profile=lazy(()=>
import("@/presentation/pages/vendor/Profile"))

const AddVenue=lazy(()=>
import("@/presentation/pages/vendor/AddVenue"))

const Settings=lazy(()=>
import("@/presentation/pages/vendor/Settings"))

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

const BookingManagement = lazy(() =>
  import("@/presentation/pages/admin/BookingManagement")
);

const PaymentManagement = lazy(() =>
  import("@/presentation/pages/admin/PaymentManagement")
);

const CategoryManagement = lazy(() =>
  import("@/presentation/pages/admin/CategoryManagement")
);


function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
          <Route path={ROUTES.PUBLIC.HOME} element={<Home />}/>
          <Route path={ROUTES.USER.BROWSE_VENUES} element={<BrowseVenues />} />
          <Route path={ROUTES.USER.PROFILE} element={<UserProfile />} />
          <Route path={ROUTES.USER.CHANGE_PASSWORD} element={<UserChangePassword />} />
          <Route path={ROUTES.USER.WISHLIST} element={<Wishlist />} />
          <Route path={ROUTES.USER.BOOKINGS} element={<UserBookings />} />
          <Route path={ROUTES.USER.BOOKING_DETAIL} element={<UserBookingsDetail />}/>

          <Route path={ROUTES.VENDOR.DASHBOARD} element={<Dashboard/>}/>
          <Route path={ROUTES.VENDOR.VENUES} element={<VenueList/>}/>
          <Route path={ROUTES.VENDOR.BOOKINGS} element={<Bookings/>}/>
          <Route path={ROUTES.VENDOR.ADD_VENUE} element={<AddVenue/>}/>
          <Route path={ROUTES.VENDOR.PROFILE} element={<Profile/>}/>
          <Route path={ROUTES.VENDOR.SETTINGS} element={<Settings />} />

          {/* Admin Routes */}

          <Route path="/admin" element={<AdminLayout />}>

            <Route
              path="dashboard"
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
              path="venues"
              element={<VenueManagement />}
            />

            <Route
              path="bookings"
              element={<BookingManagement />}
            />

            <Route
              path="payments"
              element={<PaymentManagement />}
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

export default App