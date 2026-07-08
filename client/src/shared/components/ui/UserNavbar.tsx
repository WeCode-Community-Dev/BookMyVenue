import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ProfileList from './ProfileList';
import Notification from './Notification';
import { useAppStore } from '@/store/app.store';
import { useLogout } from '@/features/auth/hooks/useLogout';
import logoImg from '@/assets/logo.png';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Browse Venues', href: '/venues' },
];

const UserNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { pathname } = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const user = useAppStore((state) => state.user);
  const handleLogout = useLogout();
  const navigate = useNavigate();

  const handleOwnerFlow = () => {
    if (user?.role === 'owner') {
      navigate('/owner/dashboard');
    } else {
      navigate('/owner/onboarding');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
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
          </div>

          {/* Desktop navigation */}
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

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(true)}
              type="button"
              className="p-2 rounded-xl text-foreground/85 hover:bg-muted/30 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />

            {user?.role == 'owner' && (
              <button
                onClick={handleOwnerFlow}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
              >
                Owner Dashboard
              </button>
            )}

            {/* Notifications Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                type="button"
                className="p-2 rounded-xl text-foreground/85 hover:bg-muted/30 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
              </button>

              {notificationsOpen && <Notification onClose={() => setNotificationsOpen(false)} />}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                type="button"
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                <div className="h-7.5 w-7.5 rounded-lg bg-gradient-to-tr from-primary to-secondary text-white font-bold flex items-center justify-center text-[12px] shadow-sm">
                  {getInitials(user?.fullName)}
                </div>
                <span className="hidden lg:inline-block text-[13px] font-medium">
                  {user?.fullName || 'User'}
                </span>
                <ChevronDown
                  size={14}
                  className={[
                    'transition-transform duration-300 text-foreground/50',
                    profileOpen ? 'rotate-180' : '',
                  ].join(' ')}
                />
              </button>

              {profileOpen && <ProfileList onClose={() => setProfileOpen(false)} />}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              className="grid place-items-center h-9 w-9 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Main menu"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Header Search Overlay */}
      {searchOpen && (
        <div className="absolute inset-0 bg-background z-50 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border animate-in fade-in duration-200">
          <div className="mx-auto w-full max-w-3xl flex items-center gap-3">
            <Search className="text-primary w-5 h-5 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search for venues, categories, or cities..."
              className="w-full text-[14px] bg-transparent border-none text-foreground placeholder-foreground/50 focus:outline-none py-2"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1.5 rounded-xl hover:bg-muted/50 text-foreground/75 hover:text-foreground transition-all duration-200"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-xs transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        className={[
          'md:hidden fixed inset-y-0 right-0 z-50 w-[290px] bg-surface border-l border-border flex flex-col shadow-2xl transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-5 shrink-0">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <img src={logoImg} alt="BookMyVenue Logo" className="h-8 w-8 object-contain" />
              <span className="text-[15px] font-bold text-foreground tracking-tight">
                BookMyVenue
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="grid place-items-center h-9 w-9 rounded-xl text-foreground/70 hover:bg-muted/40 hover:text-foreground transition-all duration-300"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Profile Info */}
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-bold flex items-center justify-center text-[14px]">
              {getInitials(user?.fullName)}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-foreground">
                {user?.fullName || 'User'}
              </span>
              {user?.email && (
                <span className="text-[10.5px] text-foreground/60">{user.email}</span>
              )}
            </div>
          </div>

          {/* Drawer Nav links */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
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
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Drawer Quick Actions & Pinned Bottom Section */}
          <div className="p-4 border-t border-border bg-surface/50 backdrop-blur-sm flex flex-col gap-3 shrink-0">
            {/* Quick Action Icons Line */}
            <div className="flex items-center justify-around py-1.5 bg-muted/20 border border-border/50 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="p-2 rounded-xl text-foreground/80 hover:text-primary hover:bg-muted/30 transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                to="/notifications"
                onClick={() => setMobileOpen(false)}
                className="relative p-2 rounded-xl text-foreground/80 hover:text-primary hover:bg-muted/30 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface" />
              </Link>
            </div>

            {/* Profile actions shortcut */}
            <div className="grid grid-cols-3 gap-2 mt-1">
              <Link
                to="/account/profile"
                className="flex items-center justify-center py-2.5 rounded-xl text-[12px] font-medium border border-border text-foreground/90 hover:bg-muted/30 transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/account/bookings"
                className="flex items-center justify-center py-2.5 rounded-xl text-[12px] font-medium border border-border text-foreground/90 hover:bg-muted/30 transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Bookings
              </Link>
              <Link
                to="/account/wallet"
                className="flex items-center justify-center py-2.5 rounded-xl text-[12px] font-medium border border-border text-foreground/90 hover:bg-muted/30 transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Wallet
              </Link>
              <Link
                to="/account/payment-history"
                className="flex items-center justify-center py-2.5 rounded-xl text-[12px] font-medium border border-border text-foreground/90 hover:bg-muted/30 transition-all duration-300 col-span-3 mt-1"
                onClick={() => setMobileOpen(false)}
              >
                Payment History
              </Link>
            </div>

            {/* Logout CTA */}
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 rounded-xl text-[13px] font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
