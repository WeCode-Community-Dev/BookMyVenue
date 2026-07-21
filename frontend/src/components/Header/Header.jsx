import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiLogOut, FiCalendar, FiSearch, FiHeart, FiMenu, FiX, FiChevronDown, FiMessageSquare } from 'react-icons/fi';
import './Header.scss';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { useLogoutMutation } from '../../features/auth/authApi';
import { adminLogout } from '../../redux/slices/adminAuthSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { isChatEnabled } from '../../config/featureFlags';


function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout , {data,error,isLoading,isSuccess,isError}] = useLogoutMutation();

  const currentUser = useSelector(selectCurrentUser);

  const user = {
    name: currentUser?.username || 'Guest User',
    role: currentUser?.role || 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = (
    <>
      <NavLink
        to="/browse-venues"
        className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      >
        <FiSearch className="tab-icon" />
        <span>Browse</span>
      </NavLink>

      <NavLink
        to="/my-bookings"
        className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      >
        <FiCalendar className="tab-icon" />
        <span>My Bookings</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      >
        <FiHeart className="tab-icon" />
        <span>Favorites</span>
      </NavLink>

      {isChatEnabled && (
        <NavLink
          to="/messages"
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          onClick={() => setMobileOpen(false)}
        >
          <FiMessageSquare className="tab-icon" />
          <span>Messages</span>
        </NavLink>
      )}
    </>
  );

async function logoutUser() {
  try {
    await logout().unwrap()
    dispatch(adminLogout())
    navigate('/login')
  } catch (err) {
    console.error('Logout failed', err)
  }
}


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

          <button
            type="button"
            className="header-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className={`header-nav-container ${mobileOpen ? 'mobile-open' : ''}`}>
          <nav className="header-nav">
            {navLinks}
          </nav>

         
        </div>
         <div className="header-user-section" ref={dropdownRef}>
            <button
              type="button"
              className="user-profile-card user-dropdown-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <FiChevronDown className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <img src={user.avatar} alt="" className="dropdown-avatar" />
                  <div>
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-role">{user.role}</span>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <Link to="/favorites" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FiHeart /> Favorites
                </Link>
                <Link to="/my-bookings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FiCalendar /> My Bookings
                </Link>
                <div className="dropdown-divider" />
                <button  onClick={logoutUser} className="dropdown-item dropdown-item--danger logout-btn" aria-label="Log out">
                  <FiLogOut className="logout-icon" />
                  <span >Logout</span>
                </button>
              </div>
            )}
          </div>
      </div>
    </header>
  );
}

export default Header;
