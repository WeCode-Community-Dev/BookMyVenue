import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header = ({ isAuthenticated, userRole, handleLogout, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (window.innerWidth < 1024) {
          setIsMobileSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live search on home page
  useEffect(() => {
    if (location.pathname === '/' && onSearch) {
      const delay = setTimeout(() => onSearch(searchTerm), 300);
      return () => clearTimeout(delay);
    }
  }, [searchTerm, location.pathname, onSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
    if (location.pathname !== '/') {
      navigate('/');
    }
    setIsMobileSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) onSearch('');
    searchInputRef.current?.focus();
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateVenueClick = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/venues/create' } });
      return;
    }
    navigate('/venues/create');
  };

  const getDashboardText = () => {
    if (userRole === 'PARTNER') return location.pathname === '/partner' ? 'Customer View' : 'Partner Dashboard';
    if (userRole === 'SUPER_ADMIN') return location.pathname === '/admin' ? 'Customer View' : 'Admin Dashboard';
    return null;
  };

  const getDashboardPath = () => {
    if (userRole === 'PARTNER') return location.pathname === '/partner' ? '/' : '/partner';
    if (userRole === 'SUPER_ADMIN') return location.pathname === '/admin' ? '/' : '/admin';
    return '/';
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-500">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center space-x-3 group outline-none">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 transform -rotate-6 transition-transform group-hover:rotate-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-indigo-400">
              BookMyVenue
            </h1>
          </Link>
          
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-slate-400 hover:text-indigo-400 focus:outline-none transition-colors rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-slate-100 focus:outline-none transition-colors rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="relative group">
            <button className="flex items-center space-x-1 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors py-2">
              <span>Company</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left group-hover:scale-100 scale-95">
              <div className="py-2">
                <Link to="/about" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400">About Us</Link>
                <Link to="/careers" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400">Careers</Link>
                <Link to="/press" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400">Press</Link>
                <Link to="/partner-with-us" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400">Partner with Us</Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-1 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors py-2">
              <span>Support & Legal</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left group-hover:scale-100 scale-95">
              <div className="py-2">
                <Link to="/help" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400">Help Center</Link>
                <Link to="/contact" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400">Contact Us</Link>
                <Link to="/privacy" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400">Privacy Policy</Link>
                <Link to="/terms" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 shadow-xl z-50 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Search for venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-slate-700/50 rounded-xl bg-slate-950/50 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all text-slate-100 shadow-inner"
              />
              {searchTerm && (
                <button type="button" onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}
            </form>
          </div>
        )}

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search venues, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-16 py-2 border border-slate-800/80 rounded-full leading-5 bg-slate-900/50 placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm transition-all duration-300 text-slate-100 hover:border-slate-700"
            />
            {searchTerm ? (
              <button type="button" onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-indigo-400 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-xs font-semibold text-slate-500 border border-slate-700 bg-slate-800 rounded px-1.5 py-0.5 shadow-sm">
                  <kbd className="font-sans tracking-wide">Ctrl K</kbd>
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Actions Section */}
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto`}>
          
          {/* Mobile Links */}
          <div className="lg:hidden flex flex-col w-full space-y-1 mb-2 border-b border-slate-800 pb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Company</span>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1.5 text-sm">About Us</Link>
            <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1.5 text-sm">Careers</Link>
            <Link to="/partner-with-us" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1.5 text-sm">Partner with Us</Link>
            
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">Support</span>
            <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1.5 text-sm">Help Center</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-indigo-400 py-1.5 text-sm">Contact Us</Link>
          </div>

          {userRole !== 'CUSTOMER' && (
            <button 
              onClick={() => { handleCreateVenueClick(); setIsMobileMenuOpen(false); }}
              className="btn-primary flex items-center justify-center shadow-primary-500/20 px-4 py-2 whitespace-nowrap w-full md:w-auto mt-2 md:mt-0"
            >
              <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Add Venue</span>
            </button>
          )}

          {isAuthenticated ? (
            <div className="relative w-full md:w-auto" ref={profileMenuRef}>
              <div className="hidden md:flex items-center cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                <button className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-slate-800 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                    {userRole?.charAt(0) || 'U'}
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Mobile View Flat List */}
              <div className="md:hidden flex flex-col space-y-3 w-full pt-4 border-t border-slate-800">
                {getDashboardText() && (
                  <button 
                    onClick={() => { navigate(getDashboardPath()); setIsMobileMenuOpen(false); }}
                    className="text-slate-300 hover:text-indigo-400 font-medium text-sm text-left"
                  >
                    {getDashboardText()}
                  </button>
                )}
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                  className="text-red-400 hover:text-red-300 font-medium text-sm text-left"
                >
                  Sign Out
                </button>
              </div>

              {/* Desktop Dropdown */}
              {isProfileMenuOpen && (
                <div className="hidden md:block absolute right-0 mt-2 w-48 bg-slate-900 rounded-xl shadow-xl border border-slate-800 py-2 z-50 animate-[slide-up_0.2s_ease-out]">
                  <div className="px-4 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Role</p>
                    <p className="text-sm font-semibold text-slate-100 capitalize">{userRole?.replace('_', ' ') || 'Customer'}</p>
                  </div>
                  
                  {getDashboardText() && (
                    <button 
                      onClick={() => { navigate(getDashboardPath()); setIsProfileMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                    >
                      {getDashboardText()}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                  >
                    My Profile
                  </button>
                  
                  <button 
                    onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors mt-1 border-t border-slate-800"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }} 
              className="text-slate-300 hover:text-slate-100 font-semibold text-sm whitespace-nowrap w-full md:w-auto text-left md:text-center px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
