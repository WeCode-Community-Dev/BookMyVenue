import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './page/Home';
import Venues from './page/Venues';
import Contact from './page/Contact';
import Login from './page/Login';
import Signup from './page/Signup';
import VenueDetail from './page/VenueDetail';
import BookVenue from './page/BookVenue';
import AddVenue from './page/AddVenue';
import Bookings from './page/UserBookings';
import BookingDetail from './page/BookingDetail';
import MyVenues from './page/MyVenues';
import HostVenueDetail from './page/HostVenueDetail';
import HostBookings from './page/HostBookings';
import HostDashboard from './page/HostDashboard';
import AdminDashboard from './page/AdminDashboard';
import HostVenueBookings from './page/HostVenueBookings';
import MapTest from './page/MapTest';

// Route guard to restrict access only to users with the 'admin' role.
// Redirects unauthorized users to the home page, and unauthenticated users to the login page.
function AdminRoute({ children }: { children: React.ReactNode }) {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Route wrapper to redirect logged-in Admins to the admin panel dashboard
// when they try to access normal user/host pages.
function NonAdminRoute({ children }: { children: React.ReactNode }) {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
    } catch {}
  }
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NonAdminRoute><Home /></NonAdminRoute>} />
        <Route path="/venues" element={<NonAdminRoute><Venues /></NonAdminRoute>} />
        <Route path="/venue/:id" element={<NonAdminRoute><VenueDetail /></NonAdminRoute>} />
        <Route path="/book/:id" element={<NonAdminRoute><BookVenue /></NonAdminRoute>} />
        <Route path="/addvenues" element={<NonAdminRoute><AddVenue /></NonAdminRoute>} />
        <Route path="/my-venues" element={<NonAdminRoute><MyVenues /></NonAdminRoute>} />
        <Route path="/my-venues/:id" element={<NonAdminRoute><HostVenueDetail /></NonAdminRoute>} />
        <Route path="/my-venues/:id/bookings" element={<NonAdminRoute><HostVenueBookings /></NonAdminRoute>} />
        <Route path="/bookings" element={<NonAdminRoute><HostBookings /></NonAdminRoute>} />
        <Route path="/dashboard" element={<NonAdminRoute><HostDashboard /></NonAdminRoute>} />
        <Route path="/contact" element={<NonAdminRoute><Contact /></NonAdminRoute>} />
        <Route path="/map-test" element={<MapTest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mybooking" element={<NonAdminRoute><Bookings /></NonAdminRoute>} />
        <Route path="/mybooking/:id" element={<NonAdminRoute><BookingDetail /></NonAdminRoute>} />
        
        {/* Admin route */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
