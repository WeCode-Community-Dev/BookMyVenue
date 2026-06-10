import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiLogOut, FiCalendar, FiSearch, FiHeart } from 'react-icons/fi';
import './Header.scss';
import { useSelector } from 'react-redux';
import {selectCurrentUser} from '../../redux/slices/authSlice';

function Header() {


  const currentUser = useSelector(selectCurrentUser);

  console.log(currentUser,"currentUser")
  
  const user = {
    name: currentUser?.username || 'Guest User',
    role: currentUser?.role || 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
  };

  return (
    <header className="main-header">
      <div className="header-container">
        
        <div className="header-row-top">
          <Link to="/" className="header-logo-section">
            <div className="logo-icon-wrapper">
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="logo-text">
              BookMy<span className="gradient-text">Venue</span>
            </span>
          </Link>
        </div>
 

        <div className="header-nav-container">
        <nav className="header-nav">
          <NavLink 
            to="/browse-venues" 
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <FiSearch className="tab-icon" />
            <span>Browse</span>
          </NavLink>
          
          <NavLink 
            to="/my-bookings" 
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <FiCalendar className="tab-icon" />
            <span>My Bookings</span>
          </NavLink>

          <NavLink 
            to="/favorites" 
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <FiHeart className="tab-icon" />
            <span>Favorites</span>
          </NavLink>
        </nav>
        </div>

        <div className="header-user-section">
          <div className="user-profile-card">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="user-avatar" 
            />
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          
          <button className="logout-btn" aria-label="Log out">
            <FiLogOut className="logout-icon" />
            <span className="logout-text">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;
