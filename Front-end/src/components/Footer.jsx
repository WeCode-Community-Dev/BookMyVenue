import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">Book<span className="logo-accent">My</span>Venue</span>
          </div>
          <p className="footer-tagline">Find & book the perfect venue for every celebration — weddings, parties, corporate events and more.</p>
          <div className="footer-socials">
            <a href="#" className="social-icon">📘</a>
            <a href="#" className="social-icon">📸</a>
            <a href="#" className="social-icon">🐦</a>
            <a href="#" className="social-icon">▶️</a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Explore</h4>
          <Link to="/venues">All Venues</Link>
          <Link to="/venues?type=wedding">Wedding Venues</Link>
          <Link to="/venues?type=party">Party Halls</Link>
          <Link to="/venues?type=corporate">Corporate Spaces</Link>
          <Link to="/venues?type=outdoor">Outdoor Venues</Link>
        </div>

        <div className="footer-links-group">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Press</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-links-group">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Cancellation Policy</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">List Your Venue</a>
        </div>

        <div className="footer-links-group">
          <h4>Popular Cities</h4>
          <a href="#">Mumbai</a>
          <a href="#">Delhi</a>
          <a href="#">Bengaluru</a>
          <a href="#">Hyderabad</a>
          <a href="#">Chennai</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 BookMyVenue. All rights reserved.</p>
        <p>Made with ❤️ for every celebration</p>
      </div>
    </footer>
  );
}