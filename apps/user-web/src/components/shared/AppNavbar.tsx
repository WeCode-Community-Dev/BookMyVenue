import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Logo, ThemeToggle } from '@venue404/ui'
import { createClient, notificationEndpoints } from '@venue404/api-client'
import { useAuth } from '../../lib/AuthContext'
import { useAuthModal } from '../../lib/AuthModalContext'

// Owner Portal is a separate app/deployment — configurable per environment,
// falls back to its local dev port so this works out of the box.
const OWNER_PORTAL_URL = import.meta.env.VITE_OWNER_PORTAL_URL ?? 'http://localhost:5398'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || 'U'
}

function UserMenu({ displayName, onSignOut }: { displayName: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const initials = getInitials(displayName)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-ink-800"
        aria-label="Account menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white shadow-sm">
          {initials}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-ink-800 dark:bg-ink-900">
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-ink-800">
            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">{displayName}</p>
          </div>
          <div className="py-1">
            <Link
              to="/my-bookings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-ink-800"
            >
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              My Bookings
            </Link>
            <Link
              to="/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-ink-800"
            >
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Saved Venues
            </Link>
<Link
              to="/messages"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-ink-800"
            >
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.41-4.03 7.99-8 7.99-1.12 0-2.2-.2-3.19-.55L5 21V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2z" />
              </svg>
              Messages
            </Link>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-ink-800"
            >
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
          </div>
          <div className="border-t border-zinc-100 dark:border-ink-800">
            <a
              href={OWNER_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-zinc-50 dark:hover:bg-ink-800"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Become a host
                </span>
                <span className="block text-xs leading-snug text-zinc-400">
                  It's easy to start hosting and earn extra income.
                </span>
              </span>

              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-xl dark:bg-brand/15"
                aria-hidden="true"
              >
                🏡
              </span>
            </a>
          </div>
          <div className="border-t border-zinc-100 py-1 dark:border-ink-800">
            <button
              onClick={() => { setOpen(false); onSignOut() }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-ink-800 dark:hover:text-zinc-200"
            >
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationBell() {
  const client = createClient()
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationEndpoints(client).list(),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  })
  const unreadCount = notifications.filter((n) => n.read_at == null).length

  return (
    <Link
      to="/notifications"
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-ink-800 dark:hover:text-zinc-100"
      aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}

export function AppNavbar() {
  const { user, signOut } = useAuth()
  const { openLogin, openRegister } = useAuthModal()
  const displayName = user?.profile?.full_name ?? user?.email ?? ''

  return (
    <header className="brand-glow sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm dark:border-ink-800 dark:bg-ink-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="flex items-center gap-1">
          <ThemeToggle className="mr-1" />
          {user ? (
            <>
              <NotificationBell />
              <UserMenu displayName={displayName} onSignOut={signOut} />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openLogin}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-ink-800 dark:hover:text-zinc-100"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={openRegister}
                className="ml-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.97]"
              >
                Get started
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
