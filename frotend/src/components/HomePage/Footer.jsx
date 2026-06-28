import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>BookMyVenue</h3>
          <p>Discover and secure unique spaces for any occasion around the globe.</p>
        </div>

        <div className="footer-links-column">
          <h4>Explore</h4>
          <a href="#explore">All Venues</a>
          <a href="#categories">Categories</a>
          <a href="#trending">Trending</a>
        </div>

        <div className="footer-links-column">
          <h4>Hosting</h4>
          <a href="#hosting">List Your Space</a>
          <a href="#guidelines">Community Rules</a>
          <a href="#insurance">Host Insurance</a>
        </div>

        <div className="footer-links-column">
          <h4>Support</h4>
          <a href="#help">Help Center</a>
          <a href="#safety">Safety Trust</a>
          <a href="#contact">Contact Support</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 BookMyVenue, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}