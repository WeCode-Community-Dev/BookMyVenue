import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/images/bookmyvenue_logo.png';
import './authLayout.scss';

function AuthLayout() {
  return (
    <div className="auth-layout">
      <header className="auth-header">
        <div className="auth-header-container">
          <Link to="/" className="auth-logo-link">
            <img src={logo} alt="BookMyVenue Logo" className="auth-logo-img" />
          </Link>
        </div>
      </header>
      
      <main className="auth-main-content">
        <div className="auth-card-container">
          <Outlet />
        </div>
      </main>

      <footer className="auth-footer">
        <p className="auth-footer-text">
          &copy; 2024 BookMyVenue Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default AuthLayout;