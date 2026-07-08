import { Routes, Route } from 'react-router-dom';

import { LoginModal } from './components/shared/LoginModal.jsx';
import { ToastViewport } from './components/shared/ToastViewport.jsx';
import { RequireAuth } from './components/shared/RequireAuth.jsx';
import { UserLayout } from './pages/UserPages/UserLayout.jsx';
import { VenueOwnerLayout } from './pages/VenueOwnerPage/VenueOwnerLayout.jsx';
import { Home, Venue, Category,VenueDetails } from './pages/UserPages/UserPages.js';
import {
  VenueOwnerLogin,
  VenueOwnerDashboard,
  VenueOwnerMyVenues,
  EditVenuePage,
  VenueOwnerBookings,
  VenueOwnerAnalytics,
  VenueOwnerSettings,
} from "./pages/VenueOwnerPage/VenueOwnerPage.js";
import { AdminLayout } from './pages/AdminPage/AdminLayout.jsx';
import { AdminLogin,AdminHome,AdminVenueApprovals, AdminVenueDetails, AdminVenueOptions } from './pages/AdminPage/AdminPages.js';

function App() {
  return (
    <>
      {/* Global overlays — mounted once, fired from anywhere */}
      <LoginModal />
      <ToastViewport />

      <Routes>
        {/* Public User Routes */}
        <Route element={<UserLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/venue' element={<Venue />} />
          <Route path='/venue/:id' element={<VenueDetails />} />
          <Route path='/venue/category' element={<Category />} />
        </Route>

        {/* Venue Owner Routings */}
        <Route path='/venue-owner' element={<VenueOwnerLogin />} />
        <Route element={<RequireAuth roles={['venueOwner']} loginPath='/venue-owner' />}>
          <Route element={<VenueOwnerLayout />}>
            <Route path='/venue-owner/dashboard' element={<VenueOwnerDashboard />} />
            <Route path='/venue-owner/my-venues' element={<VenueOwnerMyVenues />} />
            <Route path='/venue-owner/venues/edit/:id' element={<EditVenuePage />} />
            <Route path='/venue-owner/bookings' element={<VenueOwnerBookings />} />
            <Route path='/venue-owner/analytics' element={<VenueOwnerAnalytics />} />
            <Route path='/venue-owner/settings' element={<VenueOwnerSettings />} />


          </Route>
        </Route>

        {/* Admin Routings */}
        <Route path='/admin' element={<AdminLogin />} />
        <Route element={<RequireAuth roles={['admin']} loginPath='/admin' />}>
          <Route element={<AdminLayout />}>
            <Route path='/admin/home' element={<AdminHome />} />
            <Route path='/admin/venues/pending' element={<AdminVenueApprovals />} />
            <Route path='/admin/venues/:id' element={<AdminVenueDetails />} />
            <Route path='/admin/venue-options' element={<AdminVenueOptions />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;