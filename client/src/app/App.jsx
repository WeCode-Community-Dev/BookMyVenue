import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Suspense,lazy } from "react";
import { ROUTES } from "@/constatnts/routes";
import BrowseVenues from "@/presentation/pages/user/BrowseVenue";


const Home = lazy(() => import("@/presentation/pages/Home"))

const UserProfile = lazy(() => import("@/presentation/pages/user/UserProfile"))
const AccountSettings = lazy(() => import("@/presentation/pages/user/AccountSettings"))
const Wishlist = lazy(() => import("@/presentation/pages/user/Wishlist"))

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



function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
          <Route path={ROUTES.PUBLIC.HOME} element={<Home />}/>
          <Route path={ROUTES.USER.BROWSE_VENUES} element={<BrowseVenues />} />
          <Route path={ROUTES.USER.PROFILE} element={<UserProfile />} />
          <Route path={ROUTES.USER.ACCOUNT_SETTINGS} element={<AccountSettings />} />
          <Route path={ROUTES.USER.WISHLIST} element={<Wishlist />} />

          <Route path={ROUTES.VENDOR.DASHBOARD} element={<Dashboard/>}/>
          <Route path={ROUTES.VENDOR.VENUES} element={<VenueList/>}/>
          <Route path={ROUTES.VENDOR.BOOKINGS} element={<Bookings/>}/>
          <Route path={ROUTES.VENDOR.ADD_VENUE} element={<AddVenue/>}/>
          <Route path={ROUTES.VENDOR.PROFILE} element={<Profile/>}/>
          <Route path={ROUTES.VENDOR.SETTINGS} element={<Settings />} />
      </Routes>
    </Suspense>
    </BrowserRouter>
  );
}

export default App