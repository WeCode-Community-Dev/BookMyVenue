import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { MdLocationOn } from 'react-icons/md';

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isVenueOwner } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isVenueOwner) return '/owner/dashboard';
    return '/bookings';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-bg-primary/95 border-b border-white/8">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight" onClick={() => setMenuOpen(false)}>
          <MdLocationOn className="text-2xl text-primary" />
          <span className="text-white">Book<span className="text-primary-light">My</span>Venue</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/venues" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200">
            Discover
          </Link>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200">
                Dashboard
              </Link>
              {isVenueOwner && (
                <Link to="/owner/venues" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200">
                  My Venues
                </Link>
              )}
              <div className="flex items-center gap-4 pl-4 border-l border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary-light text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight">{user?.name}</span>
                    <span className="text-[10px] text-zinc-400 capitalize">{user?.role?.replace('_', ' ')}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/8 hover:border-white/15 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-all duration-200">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary hover:bg-primary-dark text-white transition-all duration-200">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-2xl text-white hover:text-primary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Links Dropdown */}
      {menuOpen && (
        <div className="absolute top-[65px] left-0 right-0 bg-bg-primary border-b border-white/8 p-6 flex flex-col gap-4 md:hidden">
          <Link to="/venues" className="text-sm font-medium text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Discover
          </Link>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="text-sm font-medium text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              {isVenueOwner && (
                <Link to="/owner/venues" className="text-sm font-medium text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                  My Venues
                </Link>
              )}
              <div className="flex flex-col gap-4 pt-4 border-t border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary-light text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{user?.name}</span>
                    <span className="text-[10px] text-zinc-400 capitalize">{user?.role?.replace('_', ' ')}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-2.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/8"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-4 border-t border-white/8">
              <Link to="/login" className="w-full py-2.5 text-center text-sm font-semibold text-zinc-300 bg-white/5 rounded-lg border border-white/8" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-primary text-white" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
