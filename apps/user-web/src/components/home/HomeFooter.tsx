import { Link } from 'react-router-dom'
import { Logo } from '@venue404/ui'

const VENUE_TYPES = [
  { label: 'Wedding Halls', href: '/venues?venue_type=wedding_hall' },
  { label: 'Banquet Halls', href: '/venues?venue_type=banquet_hall' },
  { label: 'Event Spaces', href: '/venues?venue_type=event_space' },
  { label: 'Rooftops', href: '/venues?venue_type=rooftop' },
  { label: 'Conference Rooms', href: '/venues?venue_type=conference_room' },
  { label: 'Outdoor Lawns', href: '/venues?venue_type=lawn' },
]

const ACCOUNT_LINKS = [
  { label: 'Sign in',     href: '/login' },
  { label: 'Register',    href: '/register' },
  { label: 'My Bookings', href: '/my-bookings' },
  { label: 'Profile',     href: '/profile' },
]

const SUPPORT_LINKS = [
  { label: 'Help Center',       href: '#' },
  { label: 'Contact Us',        href: '#' },
  { label: 'Privacy Policy',    href: '#' },
  { label: 'Terms of Service',  href: '#' },
]

export function HomeFooter() {
  return (
    <footer className="border-t border-zinc-100 bg-white dark:border-ink-800 dark:bg-ink-950">
      <div className="mx-auto max-w-6xl px-6 py-14">

        {/* ── Top grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 max-w-xs">
              Discover and book the perfect venue for every occasion — from intimate
              gatherings to grand celebrations.
            </p>
            <div className="mt-5 flex gap-3">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-700 dark:border-ink-700 dark:hover:border-ink-600 dark:hover:text-zinc-200"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-700 dark:border-ink-700 dark:hover:border-ink-600 dark:hover:text-zinc-200"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Browse venues */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Browse</p>
            <ul className="space-y-2.5">
              {VENUE_TYPES.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Account</p>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Support</p>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-zinc-100 pt-6 sm:flex-row dark:border-ink-800">
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()} Venue404. All rights reserved.</p>
          <p className="text-xs text-zinc-300">Made with ♥ in India</p>
        </div>
      </div>
    </footer>
  )
}
