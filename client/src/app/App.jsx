import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Suspense,lazy } from "react";

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



function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/venues" element={<VenueList/>}/>
          <Route path="/bookings" element={<Bookings/>}/>
          <Route path="/addvenue" element={<AddVenue/>}/>
          <Route path="/profile" element={<Profile/>}/>

      </Routes>
    </Suspense>
    </BrowserRouter>
  );
}

export default App