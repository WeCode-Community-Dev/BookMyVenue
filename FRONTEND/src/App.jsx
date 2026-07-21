import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SpaceListing from "./pages/VenueListing"
import BookMyVenueLanding from "./pages/HostLandingPage"
import OwnerDashboard from './pages/OwnerDashboard';
import ListNewVenue from './pages/ListNewVenues';
import AdminDashboard from './pages/AdminDashboard';
import UserBookings from './pages/UserDashboard'

function App() {

  return (
    <div className="Main-Container">      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/venues/:id" element={<SpaceListing />} />
          <Route path="/host" element={<BookMyVenueLanding />} />
          <Route path="/host/dashboard" element={<OwnerDashboard />} />
          <Route path="/host/dashboard/list-new-venues" element={<ListNewVenue />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/dashboard" element={<UserBookings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
