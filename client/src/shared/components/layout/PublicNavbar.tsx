import { useState, useEffect, useRef } from 'react';
import { Menu, X, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ui';
import logoImg from '@/assets/logo.png';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Browse venues', href: '/venues' },
  { name: 'How it works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
];

// Hook: lock body scroll when drawer open
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);
}

const PublicNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  useScrollLock(drawerOpen);

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={logoImg}
              alt="BookMyVenue Logo"
              className="h-9 w-9 object-contain group-hover:scale-105 transition-all duration-300"
            />
            <span className="text-[17px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
              BookMyVenue
            </span>
          </Link>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={[
                    'relative px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-muted/30 hover:text-foreground',
                  ].join(' ')}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />

            <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />

            <Link
              to="/signin"
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-all duration-300"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-xl text-[13px] font-medium border border-border text-foreground hover:bg-muted/30 hover:border-muted transition-all duration-300 shadow-sm"
            >
              Sign up
            </Link>

            <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />

            {/* Primary CTA — styled visually distinct with primary theme colors */}
            <Link
              to="/signup"
              state={{ role: 'owner' }}
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-[13px] font-semibold bg-primary text-white hover:bg-accent transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            >
              <Building2 size={14} />
              Register as Owner
            </Link>
          </div>

          {/* Mobile right — theme toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              onClick={() => setDrawerOpen((prev) => !prev)}
              className="grid place-items-center h-9 w-9 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
            >
              {drawerOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-xs transition-opacity duration-300',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          'fixed top-0 right-0 z-50 h-full w-[290px] border-l border-border bg-surface flex flex-col md:hidden shadow-2xl',
          'transition-transform duration-300 ease-out',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5 shrink-0">
          <Link to="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
            <img src={logoImg} alt="BookMyVenue Logo" className="h-8 w-8 object-contain" />
            <span className="text-[15px] font-bold text-foreground tracking-tight">
              BookMyVenue
            </span>
          </Link>

          <button
            onClick={() => setDrawerOpen(false)}
            className="grid place-items-center h-9 w-9 rounded-xl text-foreground/70 hover:bg-muted/40 hover:text-foreground transition-all duration-300"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1.5 p-5 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={[
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-muted/30 hover:text-foreground',
                ].join(' ')}
                onClick={() => setDrawerOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA section — pinned to bottom */}
        <div className="p-5 border-t border-border bg-surface/50 backdrop-blur-sm flex flex-col gap-2.5 shrink-0">
          <Link
            to="/signin"
            state={{ from: { pathname: '/venu-owner' } }}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[14px] font-semibold bg-primary text-white hover:bg-accent transition-all duration-300 shadow-md shadow-primary/15"
            onClick={() => setDrawerOpen(false)}
          >
            <Building2 size={16} />
            Register as Owner
          </Link>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link
              to="/signin"
              className="flex items-center justify-center py-2.5 rounded-xl text-[13px] font-medium border border-border text-foreground/90 hover:bg-muted/30 transition-all duration-300"
              onClick={() => setDrawerOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="flex items-center justify-center py-2.5 rounded-xl text-[13px] font-medium bg-secondary text-white hover:opacity-95 transition-all duration-300"
              onClick={() => setDrawerOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicNavbar;
