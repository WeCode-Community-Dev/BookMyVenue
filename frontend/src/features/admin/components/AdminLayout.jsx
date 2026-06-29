import React from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '../../../redux/slices/authSlice'
import { logout } from '../../../redux/slices/authSlice'
import { ADMIN_SIDEBAR_CONFIG } from '../config/sidebarConfig'
import { FiLogOut, FiBell } from 'react-icons/fi'
import './AdminLayout.scss'

function AdminLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const user = {
    name: currentUser?.username,
    role: currentUser?.role,
    initials: currentUser?.username ? currentUser.username.split(' ').map(n => n[0]).join('').toUpperCase() : 'A'
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <Link to="/admin/dashboard" className="brand-link">
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
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </div>
            <span className="brand-name">Admin</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {ADMIN_SIDEBAR_CONFIG.map((item) => {
            const IconComponent = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <IconComponent className="link-icon" />
                <span className="link-text">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Admin Panel</h1>
            </div>
            <div className="header-actions">
              <button type="button" className="icon-btn notification-btn" aria-label="Notifications">
                <FiBell />
              </button>
              <div className="user-profile">
                <div className="user-avatar">{user.initials}</div>
                <div className="user-info">
                  <p className="user-name">{user.name || 'Admin'}</p>
                  <p className="user-role">{user.role || 'Administrator'}</p>
                </div>
              </div>
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <FiLogOut />
              </button>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
