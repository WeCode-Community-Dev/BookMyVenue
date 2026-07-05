import React from 'react'
import { Link } from 'react-router-dom'
import '../Pages/HomePage/home.css'
const footer = () => {
  return (
    <div>
        <footer className="footer" id="contact">
      <div className="container">
        <div className="row gy-4">
          {/* <!-- Footer brand --> */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-brand d-flex align-items-center gap-2">
              <span className="logo-circle small-logo">
                <i className="bi bi-house-heart-fill"></i>
              </span>
              <span className="brand-text text-white">BookMy<span>Venue</span></span>
            </div>
            <p>
              Helping you find and book the right venue for every special
              occasion.
            </p>
            <div className="social-links">
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-whatsapp"></i></a>
              <a href="#"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          {/* <!-- Footer quick links --> */}
          <div className="col-lg-3 col-md-6">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/#how-it-works">About</Link>
              <Link to="/venues">Venues</Link>
              <Link to="/#contact">Contact</Link>
              <Link to="/#bundles">Bundles</Link>
              <a href="#">Privacy Policy</a>
            </div>
          </div>

          {/* <!-- Footer contact --> */}
          <div className="col-lg-3 col-md-6">
            <h3>Contact Us</h3>
            <ul className="contact-list">
              <li><i className="bi bi-telephone-fill"></i> +91 12345 67890</li>
              <li><i className="bi bi-envelope"></i> hello@bookmyvenue.com</li>
              <li><i className="bi bi-geo-alt"></i> Kochi, Kerala, India</li>
            </ul>
          </div>

          {/* <!-- Footer newsletter --> */}
          <div className="col-lg-3 col-md-6">
            <h3>Newsletter</h3>
            <p>Subscribe to get updates on new venues and exclusive offers.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn primary-btn" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 BookMyVenue. All rights reserved.</p>
      </div>
    </footer>
    </div>
  )
}

export default footer
