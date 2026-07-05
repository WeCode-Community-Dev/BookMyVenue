import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  AUTH_CHANGED_EVENT,
  getCurrentUser,
  hasAuthSession,
  logoutUser,
} from '../../api/authApi'
import './header.css'

export const Header = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(hasAuthSession())

  useEffect(() => {
    let active = true

    async function syncCurrentUser() {
      if (!hasAuthSession()) {
        if (active) {
          setCurrentUser(null)
          setAuthLoading(false)
        }
        return
      }

      if (active) setAuthLoading(true)

      try {
        const user = await getCurrentUser()
        if (active) setCurrentUser(user)
      } catch (error) {
        if (active) setCurrentUser(null)
        console.error(error)
      } finally {
        if (active) setAuthLoading(false)
      }
    }

    syncCurrentUser()
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentUser)
    window.addEventListener('storage', syncCurrentUser)

    return () => {
      active = false
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentUser)
      window.removeEventListener('storage', syncCurrentUser)
    }
  }, [])

  function handleSignOut() {
    logoutUser()
    setCurrentUser(null)
    setAuthLoading(false)
  }

  const displayName = currentUser?.fullname?.trim() || currentUser?.username

  return (
    <header className="site-header">
      <Link className="header-left" to="/">
        <div className="logo-icon">⌖</div>
        <h1 className="logo-text">
          Book<span>My</span>Venue
        </h1>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/venues">Venues</NavLink>
        <Link to="/#bundles">Bundles</Link>
        <Link to="/#contact">Contact</Link>
      </nav>

      <div className='header-right'>
        {!authLoading && (currentUser ? (
          <>
            <a
              href="#profile"
              className="login-link user-name-link"
              onClick={(event) => event.preventDefault()}
            >
              {displayName}
            </a>
            <button type="button" className="signout-btn" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="login-link">Login</NavLink>
            <NavLink to="/signup" className="login-link">SignUp</NavLink>
          </>
        ))}
      </div>
    </header>
  )
}
export default Header;
