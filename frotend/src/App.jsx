import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/HomePage/Navbar"
import Footer from "./components/HomePage/Footer";
import Hero from "./components/HomePage/Hero";
import HowItWorks from "./components/HomePage/HowItWorks";
import Categories from "./components/HomePage/Categories";
import TrendingVenues from "./components/HomePage/TrendingVenues";
import Testimonials from "./components/HomePage/Testimonials";
import Register from "./components/Register";
import ListVenue from "./components/ListVenue";
import VenueListing from "./components/VenueListing"; 
import BookingPage from './components/BookingPage';

function HomePage() {
  return (
    <div>
        <Navbar/>
      <Hero />
      <HowItWorks />
      <Categories />
      <TrendingVenues />
      <Testimonials />
      <Footer/>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Register />} />
        <Route path="/host" element={<ListVenue />} /> {/* 2. Add route mapping */}
        <Route path="/explore" element={<VenueListing />} />
        <Route path="/book" element={<BookingPage />} />
      </Routes>
      
    </Router>
  );
}
