import { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { LoginScreen } from './pages/Login';
import { DashboardView as Dashboard } from './pages/Dashboard';
import { UsersView as Users } from './pages/Users';
import { VenuesView as Venues } from './pages/Venues';
import { BookingsView as Bookings } from './pages/Bookings';
import { PaymentsView as Payments } from './pages/Payments';
import { ReportsView as Reports } from './pages/Reports';
import { NotificationsView as Notifications } from './pages/Notifications';
import { SettingsView as Settings } from './pages/Settings';
import { CMSView as CMS } from './pages/CMS';
import type { Booking } from './data/mockStore';
import { CustomCursor } from './components/CustomCursor';
import { AmenitiesView } from './pages/Amenities';

// Lucide icons
import {
  Users as UsersIcon, Building, Calendar, DollarSign, ShieldAlert,
  Settings as SettingsIcon, Image,
  Bell, Menu, X, ChevronDown, ChevronRight,
  LayoutDashboard, LogOut, Sun, Moon, Sparkles
} from 'lucide-react';

function AppContent() {
  const { stats, notifications } = useAdmin();
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState<boolean>(false);

  // Authentication State with LocalStorage Persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bmv-authenticated') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('bmv-authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bmv-authenticated');
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
  };

  // Theme state initialization with system theme default
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('bmv-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return savedTheme;
    }

    // Default to system theme
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      document.documentElement.classList.add('dark');
      return 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      return 'light';
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('bmv-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Collapsible Sidebar folder states
  const [usersExpanded, setUsersExpanded] = useState(true);
  const [venuesExpanded, setVenuesExpanded] = useState(true);
  const [bookingsExpanded, setBookingsExpanded] = useState(true);
  const [paymentsExpanded, setPaymentsExpanded] = useState(true);

  // Drilldown states for quick modal displays from Dashboard
  const [drilldownBookingId, setDrilldownBookingId] = useState<string | null>(null);

  // Navigate helper
  const handleNav = (section: string) => {
    setCurrentSection(section);
    setMobileMenuOpen(false);
  };

  const handleSelectVenueFromDashboard = () => {
    // Route to All Venues tab
    setCurrentSection('venues-all');
  };

  const handleSelectBookingFromDashboard = (booking: Booking) => {
    setDrilldownBookingId(booking.id);
    // Route to All Bookings tab
    setCurrentSection('bookings-all');
  };

  // Section Renderer
  const renderActiveSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={handleNav}
            onSelectVenue={handleSelectVenueFromDashboard}
            onSelectBooking={handleSelectBookingFromDashboard}
          />
        );

      // USERS FOLDER
      case 'users-customers':
        return <Users key="users-customers" initialTab="customers" onSelectVenue={handleSelectVenueFromDashboard} onSelectBooking={handleSelectBookingFromDashboard} />;
      case 'users-owners':
        return <Users key="users-owners" initialTab="owners" onSelectVenue={handleSelectVenueFromDashboard} onSelectBooking={handleSelectBookingFromDashboard} />;

      // VENUES FOLDER
      case 'venues-all':
        return <Venues initialTab="all" onSelectBooking={handleSelectBookingFromDashboard} />;
      case 'venues-pending':
        return <Venues initialTab="pending" onSelectBooking={handleSelectBookingFromDashboard} />;
      case 'venues-blocked':
        return <Venues initialTab="blocked" onSelectBooking={handleSelectBookingFromDashboard} />;
      case 'venues-amenities':
        return <AmenitiesView />;


      // BOOKINGS FOLDER
      case 'bookings-all':
        return (
          <Bookings
            initialTab="all"
            selectedBookingId={drilldownBookingId}
            onClearSelectedBooking={() => setDrilldownBookingId(null)}
          />
        );
      case 'bookings-upcoming':
        return <Bookings initialTab="upcoming" />;
      case 'bookings-completed':
        return <Bookings initialTab="completed" />;
      case 'bookings-cancelled':
        return <Bookings initialTab="cancelled" />;

      // PAYMENTS FOLDER
      case 'payments-revenue':
      case 'payments-payouts':
      case 'payments-transactions':
        return <Payments />;

      // FLAT SECTIONS
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      case 'cms':
        return <CMS />;
      default:
        return <Dashboard onNavigate={handleNav} onSelectVenue={handleSelectVenueFromDashboard} onSelectBooking={handleSelectBookingFromDashboard} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-bg-dark text-slate-100">

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b glass-panel border-slate-900">

        {/* Brand details */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white md:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('dashboard')}>
            <div className="flex items-center justify-center w-8 h-8 text-sm font-black rounded-lg shadow-md bg-gradient-to-r from-primary to-accent text-slate-950">
              BMV
            </div>
            <span className="hidden text-lg font-extrabold tracking-tight text-white sm:inline-block">
              BookMyVenue <span className="text-primary text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-primary/10 border border-primary/10 ml-1">Admin Panel</span>
            </span>
          </div>
        </div>

        {/* Global Notifications Bell & Admin Card */}
        <div className="relative flex items-center gap-4">

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationPopoverOpen(!notificationPopoverOpen)}
              className="relative p-2 transition border rounded-lg bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            >
              <Bell className="w-4.5 h-4.5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex justify-center items-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Popover Drawer */}
            {notificationPopoverOpen && (
              <div className="absolute right-0 z-50 p-4 mt-2 space-y-3 border shadow-xl w-80 glass-panel border-slate-800 rounded-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <span className="text-xs font-bold text-white">Recent Activities</span>
                  <button
                    onClick={() => handleNav('notifications')}
                    className="text-[10px] text-primary font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {notifications.slice(0, 4).map(notif => (
                    <div key={notif.id} className="p-2 space-y-1 text-xs border rounded bg-slate-950/40 border-slate-900">
                      <span className="font-bold text-slate-200 block text-[10px] leading-tight">{notif.title}</span>
                      <p className="text-slate-400 text-[10px] line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 transition border rounded-lg cursor-pointer bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          >
            {theme === 'light' ? (
              <Moon className="w-4.5 h-4.5" />
            ) : (
              <Sun className="w-4.5 h-4.5 animate-pulse" />
            )}
          </button>

          {/* User profile details */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-900">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Admin avatar"
              className="w-8.5 h-8.5 rounded-full object-cover border border-primary/45"
            />
            <div className="hidden text-left md:block">
              <span className="block text-xs font-bold text-white">Jiyad Ahammad</span>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Senior Platform Director</span>
            </div>
          </div>
        </div>

      </header>

      {/* CORE CONTENT LAYOUT */}
      <div className="relative flex flex-1">

        {/* SIDEBAR NAVIGATION - DESKTOP */}
        <aside className="w-64 bg-slate-950/50 border-r border-slate-900 flex-col py-4 px-3 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto hidden md:flex space-y-6">

          <div className="space-y-1.5">
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider pl-3 block">Navigation</span>

            {/* Dashboard flat */}
            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'dashboard' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Collapsible Section 1: Users */}
          <div className="space-y-1">
            <button
              onClick={() => setUsersExpanded(!usersExpanded)}
              className="flex items-center justify-between w-full px-3 py-1 text-left transition text-slate-500 hover:text-white"
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider">Users Management</span>
              {usersExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {usersExpanded && (
              <div className="space-y-0.5 pl-2 pt-1">
                <button
                  onClick={() => handleNav('users-customers')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'users-customers' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <UsersIcon className="w-3.5 h-3.5" />
                  <span>Customers</span>
                </button>
                <button
                  onClick={() => handleNav('users-owners')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'users-owners' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <UsersIcon className="w-3.5 h-3.5" />
                  <span>Venue Owners</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Section 2: Venues */}
          <div className="space-y-1">
            <button
              onClick={() => setVenuesExpanded(!venuesExpanded)}
              className="flex items-center justify-between w-full px-3 py-1 text-left transition text-slate-500 hover:text-white"
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider">Venues Listings</span>
              {venuesExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {venuesExpanded && (
              <div className="space-y-0.5 pl-2 pt-1">
                <button
                  onClick={() => handleNav('venues-all')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'venues-all' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>All Venues</span>
                </button>
                <button
                  onClick={() => handleNav('venues-pending')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'venues-pending' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>Pending approvals</span>
                  </span>
                  {stats.pendingVenueApprovals > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex justify-center items-center">
                      {stats.pendingVenueApprovals}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNav('venues-blocked')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'venues-blocked' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <Building className="w-3.5 h-3.5 text-rose-400" />
                  <span>Blocked Venues</span>
                </button>
                <button
                  onClick={() => handleNav('venues-amenities')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'venues-amenities' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Amenities</span>
                </button>

              </div>
            )}
          </div>

          {/* Collapsible Section 3: Bookings */}
          <div className="space-y-1">
            <button
              onClick={() => setBookingsExpanded(!bookingsExpanded)}
              className="flex items-center justify-between w-full px-3 py-1 text-left transition text-slate-500 hover:text-white"
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider">Bookings Audit</span>
              {bookingsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {bookingsExpanded && (
              <div className="space-y-0.5 pl-2 pt-1">
                <button
                  onClick={() => handleNav('bookings-all')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'bookings-all' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>All Bookings</span>
                </button>
                <button
                  onClick={() => handleNav('bookings-upcoming')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'bookings-upcoming' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Upcoming</span>
                </button>
                <button
                  onClick={() => handleNav('bookings-completed')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'bookings-completed' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Completed</span>
                </button>
                <button
                  onClick={() => handleNav('bookings-cancelled')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'bookings-cancelled' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-red-400" />
                  <span>Cancelled</span>
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Section 4: Payments */}
          <div className="space-y-1">
            <button
              onClick={() => setPaymentsExpanded(!paymentsExpanded)}
              className="flex items-center justify-between w-full px-3 py-1 text-left transition text-slate-500 hover:text-white"
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider">Financials & Splits</span>
              {paymentsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {paymentsExpanded && (
              <div className="space-y-0.5 pl-2 pt-1">
                <button
                  onClick={() => handleNav('payments-revenue')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection.startsWith('payments') ? 'bg-primary/20 text-white border-l-2 border-primary' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Revenue & Ledgers</span>
                </button>
              </div>
            )}
          </div>

          {/* Flat Sections */}
          <div className="space-y-1.5 pt-2 border-t border-slate-900">
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider pl-3 block">Administration</span>

            <button
              onClick={() => handleNav('reports')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'reports' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Complaints Dispute</span>
            </button>
            <button
              onClick={() => handleNav('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'notifications' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
            >
              <Bell className="w-4 h-4" />
              <span>System Broadcasts</span>
            </button>
            <button
              onClick={() => handleNav('cms')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'cms' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
            >
              <Image className="w-4 h-4" />
              <span>Marketing Banners</span>
            </button>
            <button
              onClick={() => handleNav('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${currentSection === 'settings' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Platform Settings</span>
            </button>
          </div>

          {/* Footer logout */}
          <div className="pt-8 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

        </aside>

        {/* SIDEBAR NAVIGATION - MOBILE DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm md:hidden">
            <aside className="relative flex flex-col h-full p-6 space-y-6 border-r w-72 bg-slate-950 border-slate-900">

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute p-1 transition rounded-full top-4 right-4 text-slate-500 hover:text-white hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
                <div className="flex items-center justify-center w-8 h-8 text-xs font-black rounded-lg bg-gradient-to-r from-primary to-accent text-slate-950">
                  BMV
                </div>
                <span className="text-base font-extrabold text-white">BookMyVenue</span>
              </div>

              <div className="flex-1 pr-2 space-y-4 overflow-y-auto">

                {/* Navigation group */}
                <div className="space-y-1">
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Workspace</span>
                  <button onClick={() => handleNav('dashboard')} className="w-full px-3 py-2 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Dashboard</button>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Users</span>
                  <button onClick={() => handleNav('users-customers')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Customers</button>
                  <button onClick={() => handleNav('users-owners')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Venue Owners</button>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Venues</span>
                  <button onClick={() => handleNav('venues-all')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">All Spaces</button>
                  <button onClick={() => handleNav('venues-pending')} className="flex justify-between w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">
                    <span>Pending approvals</span>
                    {stats.pendingVenueApprovals > 0 && <span className="bg-amber-500 text-slate-950 text-[8px] px-1.5 py-0.2 rounded font-bold">{stats.pendingVenueApprovals}</span>}
                  </button>
                  <button onClick={() => handleNav('venues-blocked')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Blocked Spaces</button>
                  <button onClick={() => handleNav('venues-amenities')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Amenities</button>

                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Bookings</span>
                  <button onClick={() => handleNav('bookings-all')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">All Bookings</button>
                  <button onClick={() => handleNav('bookings-upcoming')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Upcoming</button>
                  <button onClick={() => handleNav('bookings-completed')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Completed</button>
                  <button onClick={() => handleNav('bookings-cancelled')} className="w-full px-3 py-2 pl-6 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Cancelled</button>
                </div>

                <div className="pt-4 space-y-1 border-t border-slate-900">
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Operations</span>
                  <button onClick={() => handleNav('reports')} className="w-full px-3 py-2 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Complaints dispute</button>
                  <button onClick={() => handleNav('notifications')} className="w-full px-3 py-2 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">System Broadcasts</button>
                  <button onClick={() => handleNav('cms')} className="w-full px-3 py-2 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Marketing banners</button>
                  <button onClick={() => handleNav('settings')} className="w-full px-3 py-2 text-xs font-semibold text-left rounded hover:bg-slate-900 text-slate-300">Platform Settings</button>
                </div>

                {/* Mobile logout */}
                <div className="pt-4 border-t border-slate-900">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    <span>Log out</span>
                  </button>
                </div>

              </div>

            </aside>
          </div>
        )}

        {/* CORE WORKSPACE VIEW ROUTER CONTAINER */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1400px] mx-auto w-full">
          {renderActiveSection()}
        </main>

      </div>
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <CustomCursor />
      <AppContent />
    </AdminProvider>
  );
}

export default App;
