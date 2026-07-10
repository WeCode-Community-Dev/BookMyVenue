import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Building2, CalendarCheck, Home, LayoutDashboard, Menu, X, User, } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandName from "./BrandName";

const desktopNavLinkClass = ({ isActive }) =>
  [
    "px-4 py-2 text-sm font-medium transition-colors duration-300",
    isActive
      ? "text-red-600"
      : "text-gray-600 hover:text-red-600",
  ].join(" ");

const mobileDrawerNavClass = ({ isActive }) =>
  [
    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-300",
    isActive
      ? "text-red-600"
      : "text-gray-600 hover:text-red-600",
  ].join(" ");

const dashboardLinkClass =
  "hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 lg:inline-flex";

const Navbar = () => {
  const { user, loading, authReady, userRoles, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isProvider = userRoles.includes("provider");
  const userInitial = user?.name?.charAt(0)?.toUpperCase();

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  const profileAvatarClass =
    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gradient-to-br from-red-50 to-white text-sm font-semibold text-red-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:shadow-md";

  const menuButtonClass = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 lg:hidden",
  ].join(" ");

  const renderMobileNavLinks = () => (
    <>
      <NavLink to="/" end className={mobileDrawerNavClass} onClick={closeMenu}>
        <Home className="h-5 w-5 shrink-0" aria-hidden="true" />
        Home
      </NavLink>

      <NavLink
        to="/venues"
        className={mobileDrawerNavClass}
        onClick={closeMenu}
      >
        <Building2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        Venues
      </NavLink>

      {isAuthenticated && (
        <NavLink
          to="/my-bookings"
          className={mobileDrawerNavClass}
          onClick={closeMenu}
        >
          <CalendarCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
          My Bookings
        </NavLink>
      )}

      {isAuthenticated && isProvider && (
        <NavLink
          to="/provider/dashboard"
          className={mobileDrawerNavClass}
          onClick={closeMenu}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" aria-hidden="true" />
          Dashboard
        </NavLink>
      )}

      {!isAuthenticated && (
        <Link
          to="/register"
          className={mobileDrawerNavClass}
          onClick={closeMenu}
        >
          Get started
        </Link>
      )}
    </>
  );

  const renderDesktopPillNav = () => (
    <nav className="flex items-center gap-2 lg:gap-8">
      <NavLink to="/" end className={desktopNavLinkClass}>
        Home
      </NavLink>

      <NavLink to="/venues" className={desktopNavLinkClass}>
        Venues
      </NavLink>

      {isAuthenticated && (
        <NavLink to="/my-bookings" className={desktopNavLinkClass}>
          My Bookings
        </NavLink>
      )}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 overflow-x-clip border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <Link
          to="/"
          className="group z-10 flex shrink-0 items-center transition-opacity duration-200 hover:opacity-90"
          onClick={closeMenu}
        >
          <BrandName />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          {renderDesktopPillNav()}
        </div>

        <div className="z-10 flex items-center gap-2 sm:gap-3">
          {loading || !authReady ? (
            <>
              <div
                className="hidden h-9 w-24 animate-pulse rounded-full bg-gray-100 lg:block"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={toggleMenu}
                className={menuButtonClass}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          ) : !isAuthenticated ? (
            <>
              <Link
                to="/register"
                className="hidden items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-red-600/25 transition-all duration-200 hover:bg-red-700 hover:shadow-md hover:shadow-red-600/30 lg:inline-flex lg:px-5"
              >
                Get started
              </Link>

              <button
                type="button"
                onClick={toggleMenu}
                className={menuButtonClass}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              {isProvider && (
                <Link to="/provider/dashboard" className={dashboardLinkClass}>
                  <LayoutDashboard
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={toggleMenu}
                className={`${profileAvatarClass} lg:hidden`}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {userInitial ?? <User className="h-4 w-4" strokeWidth={2} />}
              </button>

              <Link
                to="/profile"
                className={`${profileAvatarClass} hidden lg:flex`}
                aria-label={`Profile${user?.name ? ` — ${user.name}` : ""}`}
                title={user?.name || "Profile"}
              >
                {userInitial ?? <User className="h-4 w-4" strokeWidth={2} />}
              </Link>

            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMenu}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed top-0 z-50 flex h-dvh w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-[right] duration-300 ease-out lg:hidden ${menuOpen ? "right-0" : "-right-80 pointer-events-none"
          }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            type="button"
            onClick={closeMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6">
          {isAuthenticated && user && (
            <Link
              to="/profile"
              onClick={closeMenu}
              className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 px-4 py-4 transition-colors hover:bg-red-100/80"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-red-100 bg-white text-base font-semibold text-red-600 shadow-sm">
                {userInitial ?? (
                  <User className="h-5 w-5" strokeWidth={2} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user?.name || "My Profile"}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {user?.email || "View your account"}
                </p>
              </div>
            </Link>
          )}

          <nav className="space-y-1">{renderMobileNavLinks()}</nav>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
