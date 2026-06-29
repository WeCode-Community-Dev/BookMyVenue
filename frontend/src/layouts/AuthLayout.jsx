import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiUsers } from 'react-icons/fi';
import logo from '../assets/images/bookmyvenue_logo.png';
import './authLayout.scss';

function AuthLayout() {
  return (
    <div className="auth-layout">
      <aside className="auth-side-panel" aria-hidden="true">
        <div className="auth-side-panel__bg">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&h=1200&q=80"
            alt=""
          />
          <div className="auth-side-panel__overlay" />
        </div>
        <div className="auth-side-panel__content">
          <Link to="/" className="auth-side-panel__logo">
            <img src={logo} alt="BookMyVenue" />
            <span>BookMy<span>Venue</span></span>
          </Link>
          <blockquote className="auth-side-panel__quote">
            &ldquo;The right venue transforms an ordinary event into an unforgettable experience.&rdquo;
          </blockquote>
          <div className="auth-side-panel__stats">
            <div><FiUsers /> <strong>500+</strong> venues</div>
            <div><FiStar /> <strong>4.8</strong> rating</div>
            <div><FiMapPin /> <strong>8</strong> cities</div>
          </div>
        </div>
      </aside>

      <div className="auth-layout__main">
        <header className="auth-header auth-header--mobile">
          <Link to="/" className="auth-logo-link">
            <img src={logo} alt="BookMyVenue Logo" className="auth-logo-img" />
            <span className="auth-brand-text">BookMy<span>Venue</span></span>
          </Link>
        </header>

        <main className="auth-main-content">
          <div className="auth-card-container">
            <Outlet />
          </div>
        </main>

        <footer className="auth-footer">
          <p className="auth-footer-text">
            &copy; {new Date().getFullYear()} BookMyVenue Inc. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AuthLayout;
