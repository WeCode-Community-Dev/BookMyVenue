
import './App.css';
import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Header from "./Components/Header/Header";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Home from './Components/Pages/HomePage/home'
import Footer from './Components/Footer/footer'
import Venues from './Components/Pages/Venues/Venues'
import VenueDetails from './Components/Pages/VenueDetail/VenueDetail'

function HashScrollHandler() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  return null;
}

function NotFound() {
  return (
    <main className="container py-5 text-center">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="btn primary-btn" to="/">Return home</Link>
    </main>
  );
}

function App() {
  return (
    <div>
      <HashScrollHandler />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venues/:slug" element={<VenueDetails />} />
        <Route
          path="/login"
          element={<LoginSignup action={{ signUp: "Login", text: "Welcome Back" }} />}
        />
        <Route
          path="/signup"
          element={<LoginSignup action={{ signUp: "Sign Up", text: "It takes only a minute" }} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;
