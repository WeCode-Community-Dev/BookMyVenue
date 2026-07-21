import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import {
  FiGrid,
  FiLayers,
  FiPlus,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiMessageSquare
} from 'react-icons/fi';
import './ownerLayout.scss';
import { logout } from '../redux/slices/authSlice';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import {
  setNotification,
  selectUnreadCount,
  selectNotifications,
  markAllRead,
} from '../redux/slices/notificationSlice';
import NotificationDropdown from '../components/ui/NotificationDropdown';
import { useMarkAllNotificationsReadMutation } from '../features/notifications/notificationApi';
import { isChatEnabled } from '../config/featureFlags';
import { selectTotalUnreadCount } from '../redux/slices/chatSlice';

function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const user = {
    name: currentUser?.username,
    role: currentUser?.role,
    initials: currentUser?.username ? currentUser.username.split(' ').map(n => n[0]).join('').toUpperCase() : ""
  };


  const isAuthenticated = useSelector(selectIsAuthenticated);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const chatUnreadCount = useSelector(selectTotalUnreadCount);
  const badgeLabel = unreadCount > 99 ? '99+' : unreadCount;
  const chatBadgeLabel = chatUnreadCount > 99 ? '99+' : chatUnreadCount;
  const isMessagesPage = isChatEnabled && location.pathname === '/messages';
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();

  const closeNotificationsDropdown = useCallback(async () => {
    setNotificationsOpen(false);

    if (unreadCount > 0) {
      dispatch(markAllRead());
      try {
        await markAllNotificationsRead().unwrap();
      } catch (err) {
        console.error('Failed to mark notifications as read', err);
      }
    }
  }, [unreadCount, dispatch, markAllNotificationsRead]);

  useEffect(() => {
    if (!isAuthenticated) return

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/notifications/stream`,
      { withCredentials: true }
    )

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      dispatch(setNotification(notification))
    }

    eventSource.onerror = (err) => {
      console.error('SSE error', err)
    }

    return () => eventSource.close()

  }, [isAuthenticated, dispatch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        closeNotificationsDropdown();
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen, closeNotificationsDropdown]);

  const toggleNotifications = () => {
    if (notificationsOpen) {
      closeNotificationsDropdown();
    } else {
      setNotificationsOpen(true);
    }
  };

  const handleNotificationClick = (_notification, link) => {
    closeNotificationsDropdown();
    if (link) navigate(link);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="owner-layout">
      <aside className="owner-sidebar">
        <div className="sidebar-brand">
          <Link to="/owner/dashboard" className="brand-link">
            <div className="brand-logo-icon">
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="brand-name">BookMyVenue</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/owner/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <FiGrid className="link-icon" />
            <span className="link-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/owner/venues"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <FiLayers className="link-icon" />
            <span className="link-text">My Venues</span>
          </NavLink>

          <NavLink
            to="/owner/add-venue"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <FiPlus className="link-icon" />
            <span className="link-text">Add Venue</span>
          </NavLink>

          <NavLink
            to="/owner/bookings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <FiCalendar className="link-icon" />
            <span className="link-text">Bookings</span>
          </NavLink>

          {isChatEnabled && (
            <NavLink
              to="/messages"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <FiMessageSquare className="link-icon" />
              <span className="link-text">Messages</span>
              {chatUnreadCount > 0 && (
                <span className="sidebar-link-badge">{chatBadgeLabel}</span>
              )}
            </NavLink>
          )}

          <NavLink
            to="/owner/settings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <FiSettings className="link-icon" />
            <span className="link-text">Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="owner-profile-summary">
            <div className="profile-avatar-initials">
              {user.initials}
            </div>
            <div className="profile-details">
              <span className="profile-name">{user.name}</span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="owner-main">
        <header className="owner-header">
          {/* <div className="header-search-wrapper">
            <FiSearch className="search-bar-icon" />
            <input
              type="text"
              className="search-bar-input"
              placeholder="Search for quick navigation..."
            />
          </div> */}
          {/* //write logic to make it appear only for venue */}

          <div className="header-controls">
            {isChatEnabled && (
              <Link
                to="/messages"
                className={`control-btn messages-btn${chatUnreadCount > 0 ? ' has-unread' : ''}`}
                aria-label={chatUnreadCount > 0 ? `${chatUnreadCount} unread messages` : 'Messages'}
              >
                <FiMessageSquare className="control-icon" />
                {chatUnreadCount > 0 && (
                  <span className="notification-badge" aria-hidden="true">
                    {chatBadgeLabel}
                  </span>
                )}
              </Link>
            )}

            <div className="notification-wrapper" ref={notificationRef}>
              <button
                type="button"
                className={`control-btn notification-btn${unreadCount > 0 ? ' has-unread' : ''}${notificationsOpen ? ' is-open' : ''}`}
                aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
                aria-expanded={notificationsOpen}
                onClick={toggleNotifications}
              >
                <FiBell className="control-icon" />
                {unreadCount > 0 && (
                  <span className="notification-badge" aria-hidden="true">
                    {badgeLabel}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <NotificationDropdown
                  notifications={notifications}
                  onItemClick={handleNotificationClick}
                />
              )}
            </div>

            <div className="header-profile-dropdown">
              <div className="header-avatar-initials">
                {user.initials}
              </div>
              <span className="header-profile-name">{user.name}</span>
              <FiChevronDown className="dropdown-arrow-icon" />
            </div>
          </div>
        </header>
        <main className={`owner-content-body${isMessagesPage ? ' owner-content-body--messages' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default OwnerLayout;