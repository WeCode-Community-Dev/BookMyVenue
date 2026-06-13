import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BMV from "../assets/BMV.png"

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat"
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState("Bengaluru");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role,setPage] = useState("Login");
  const cityRef = useRef(null);

  useEffect( ()=> {
    const handleClickOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown",handleClickOutside);
    return () => {
      document.removeEventListener("mousedown",handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img  className="logo-icon" src={BMV} alt="logo" />
          <span className="logo-text">Book<span className="logo-accent">My</span>Venue</span>
        </Link>

        {/* City Selector */}
        <div ref={cityRef} className="city-selector" onClick={() => setShowCityDropdown(!showCityDropdown)}>
          <span className="city-pin">📍</span>
          <span className="city-name">{city}</span>
          <span className="city-arrow">{showCityDropdown ? "▲" : "▼"}</span>
          {showCityDropdown && (
            <div className="city-dropdown" onClick={(e) => e.stopPropagation()}>
              <p className="dropdown-label">Select Your City</p>
              <div className="searchCity">
                <input type="text" placeholder="Search..." />
              </div>
              <div className="city-grid">
                {CITIES.map(c => (
                  <button
                    key={c}
                    className={`city-btn ${city === c ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setCity(c); setShowCityDropdown(false); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="nav-links">
          {/* <Link to="/venues" className="nav-link">Venues</Link>
          <Link to="/venues?type=wedding" className="nav-link">Weddings</Link>
          <Link to="/venues?type=party" className="nav-link">Parties</Link>
          <Link to="/venues?type=corporate" className="nav-link">Corporate</Link> */}
        </div>

        {/* Auth Section */}
        <div className="nav-auth">
          {user ? (
            <div className="user-menu-wrap" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="user-name-short">{user.name?.split(" ")[0]}</span>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/bookings" className="dropdown-item">My Bookings</Link>
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <button className="dropdown-item logout-btn" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className={`btn-login ${role === "Login" ? "Active" : ""}`} onClick={() => setPage("Login")}>Login</Link>
              <Link to="/register" className={`btn-login ${role === "SignUp" ? "Active" : ""}`} onClick={() => setPage("SignUp")}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/venues" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Venues</Link>
          <Link to="/venues?type=wedding" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Weddings</Link>
          <Link to="/venues?type=party" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Parties</Link>
          <Link to="/venues?type=corporate" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Corporate</Link>
          {!user && (
            <div className="mobile-auth">
              <Link to="/login" className="btn-login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}