import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          BookMyVenue
        </Link>
        
        <div className="nav-links">
          <Link to="/explore">Explore</Link>
          <Link to="/host">Hosting</Link>
          <Link to="/login" className="btn-signin">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}