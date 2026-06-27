import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SpaceListing from "./pages/VenueListing"
import BookMyVenueLanding from "./pages/HostLandingPage"
import OwnerDashboard from './pages/OwnerDashboard';
import ListNewVenue from './pages/ListNewVenues';


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
        </Routes>
      </main>
    </div>
  )
}

export default App
