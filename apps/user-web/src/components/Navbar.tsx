import { Link, NavLink } from 'react-router-dom'
import { Logo } from '@venue404/ui'
import { useAuth } from '../lib/AuthContext'

export function Navbar() {
  const { user, signOut } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-zinc-100 text-zinc-900 font-semibold'
        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <NavLink to="/my-bookings" className={linkClass}>
                My Bookings
              </NavLink>
              <NavLink to="/notifications" className={linkClass}>
                Notifications
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
              <button
                onClick={signOut}
                className="ml-1 rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
