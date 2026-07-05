import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Users, CheckCircle2, Clock, XCircle, Info,
  DollarSign, Mail, ChevronRight, User, AlertCircle, RefreshCw,
  Lock, Unlock, Building, Search, CalendarRange, TrendingUp, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import InteractiveCalendar from '@/components/ui/visualize-booking';

interface HostBooking {
  id: string;
  venueId: string;
  venueTitle: string;
  venueLocation: string;
  venueImage: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'offline';
  bookingDate: string;
  paymentStatus: string;
  renterName: string | null;
  renterEmail: string | null;
  renterPhone?: string | null;
  hostName: string;
  hostMail: string;
  checkInInstructions: string;
  bookingType?: string;
  refundAmount?: number;
  refundPercentage?: number;
}

interface Venue {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  images: string[];
  bookingType?: 'days' | 'hours';
  openingTime?: string;
  closingTime?: string;
  cleaningGap?: number;
}

export default function HostDashboard(): React.JSX.Element {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'offline' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLockingFormOpen, setIsLockingFormOpen] = useState(false);
  const [selectedCalendarVenueId, setSelectedCalendarVenueId] = useState('all');

  // Form State for locking venue
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lockDate, setLockDate] = useState('');
  const [lockStartHour, setLockStartHour] = useState('09:00');
  const [lockEndHour, setLockEndHour] = useState('22:00');
  const [lockNotes, setLockNotes] = useState('');
  const [lockRevenue, setLockRevenue] = useState<number>(0);
  const [lockGuests, setLockGuests] = useState<number>(0);
  const [lockRenterName, setLockRenterName] = useState('');
  const [lockRenterPhone, setLockRenterPhone] = useState('');
  const [lockRenterEmail, setLockRenterEmail] = useState('');
  const [isLocking, setIsLocking] = useState(false);

  const selectedVenue = venues.find(v => String(v.id) === String(selectedVenueId));
  const isHours = selectedVenue?.bookingType === 'hours';

  useEffect(() => {
    if (selectedVenue && selectedVenue.bookingType === 'hours') {
      setLockStartHour(selectedVenue.openingTime || '08:00');
      setLockEndHour(selectedVenue.closingTime || '22:00');
    }
  }, [selectedVenueId, venues]);

  // Modal Details
  const [selectedBooking, setSelectedBooking] = useState<HostBooking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<HostBooking | null>(null);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    // Authenticate user
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login?redirect=/dashboard');
      return;
    }

    try {
      const userObj = JSON.parse(userStr);
      setCurrentUser(userObj);
      if (userObj.role !== 'venue_owner') {
        navigate('/');
      }
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Fetch Host Bookings
      const bookingsRes = await fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.ok ? await bookingsRes.json() : [];
        setBookings(bookingsData);
      }

      // Fetch Host Venues
      const venuesRes = await fetch('http://localhost:5000/api/venues/my-venues', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (venuesRes.ok) {
        const venuesData = await venuesRes.json();
        setVenues(venuesData);
        if (venuesData.length > 0) {
          setSelectedVenueId(venuesData[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to retrieve dashboard data:', err);
      triggerToast('Error loading server details. Some data may be outdated.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Handle Venue Locking Submit
  const handleLockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reqStart = isHours ? lockDate : startDate;
    const reqEnd = isHours ? lockDate : endDate;

    if (!selectedVenueId || !reqStart || !reqEnd || !lockRenterName || !lockRenterPhone || !lockRenterEmail || (isHours && (!lockStartHour || !lockEndHour))) {
      triggerToast('Please fill out all required locking fields (including customer name, phone, and email).', 'error');
      return;
    }

    const finalStart = isHours ? `${lockDate}T${lockStartHour}:00` : startDate;
    const finalEnd = isHours ? `${lockDate}T${lockEndHour}:00` : endDate;

    const start = new Date(finalStart);
    const end = new Date(finalEnd);
    const today = new Date();

    if (isHours) {
      if (start < today) {
        triggerToast('Lock start time cannot be in the past.', 'error');
        return;
      }
      if (end <= start) {
        triggerToast('Unlock time must be after lock start time.', 'error');
        return;
      }
      const getMinutes = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };
      const openMin = getMinutes(selectedVenue?.openingTime || '08:00');
      const closeMin = getMinutes(selectedVenue?.closingTime || '22:00');
      const startMin = getMinutes(lockStartHour);
      const endMin = getMinutes(lockEndHour);
      if (startMin < openMin || endMin > closeMin) {
        triggerToast(`Lock time must be within operating hours: ${selectedVenue?.openingTime || '08:00'} - ${selectedVenue?.closingTime || '22:00'}.`, 'error');
        return;
      }
    } else {
      today.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      if (start < today) {
        triggerToast('Lock start date cannot be in the past.', 'error');
        return;
      }
      if (end <= start) {
        triggerToast('Unlock date must be after lock date.', 'error');
        return;
      }
    }

    setIsLocking(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/bookings/lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          venueId: Number(selectedVenueId),
          startDate: finalStart,
          endDate: finalEnd,
          notes: lockNotes,
          totalPrice: lockRevenue || 0,
          guests: lockGuests || 0,
          renterName: lockRenterName,
          renterPhone: lockRenterPhone,
          renterEmail: lockRenterEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        triggerToast('Venue locked successfully for specified dates!', 'success');
        // Reset locking inputs
        setStartDate('');
        setEndDate('');
        setLockDate('');
        setLockNotes('');
        setLockRevenue(0);
        setLockGuests(0);
        setLockRenterName('');
        setLockRenterPhone('');
        setLockRenterEmail('');
        setIsLockingFormOpen(false);
        // Reload data
        fetchData();
      } else {
        throw new Error(data.message || 'Failed to lock venue dates');
      }
    } catch (err: any) {
      console.error('Locking error:', err);
      triggerToast(err.message || 'An error occurred while locking dates.', 'error');
    } finally {
      setIsLocking(false);
    }
  };

  // Handle Cancellation/Unlock confirmation
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${cancelTarget.id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        triggerToast(
          cancelTarget.status === 'offline'
            ? `Offline block ${cancelTarget.id} unlocked successfully.`
            : `Reservation ${cancelTarget.id} cancelled successfully.`,
          'success'
        );
        setCancelTarget(null);
        fetchData();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel reservation');
      }
    } catch (err: any) {
      console.error('Error cancelling/unlocking:', err);
      triggerToast(err.message || 'An error occurred during cancel processing.', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDurationInNights = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.venueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.renterName && b.renterName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'online') return b.status !== 'cancelled' && b.status !== 'offline';
    if (activeTab === 'offline') return b.status === 'offline';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true; // 'all'
  });

  // Filter bookings specifically for calendar visualizer
  const filteredCalendarBookings = bookings.filter((b) => {
    if (selectedCalendarVenueId === 'all') return true;
    return String(b.venueId) === String(selectedCalendarVenueId);
  });

  // Calculate Metrics
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');

  // Total money earned this month (current calendar month, e.g. June 2026)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthEarnings = activeBookings.reduce((sum, b) => {
    const bookingDate = new Date(b.startDate);
    if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
      return sum + Number(b.totalPrice);
    }
    return sum;
  }, 0);

  // Total Offline locked days (number of days)
  const totalLockedDays = bookings
    .filter((b) => b.status === 'offline')
    .reduce((sum, b) => sum + getDurationInNights(b.startDate, b.endDate), 0);

  return (
    <section
      className="relative w-full min-h-screen text-white pb-20 overflow-y-auto"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/moulin.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      <Navbar />

      {/* Glow effects */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-[#c5a059]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-[#dfba75]/5 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 mb-10">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-normal tracking-tight text-white leading-none"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro 55 Roman', 'Helvetica Neue', Arial, sans-serif", letterSpacing: '-0.03em' }}
            >
              Host{' '}
              <span className="text-[#c5a059] bg-gradient-to-r from-[#c5a059] to-[#dfba75] bg-clip-text text-transparent font-medium">
                Dashboard
              </span>
            </h1>
            <p className="text-white/60 text-sm mt-3 max-w-xl font-light">
              Overview your venues, inspect monthly earnings, and lock specific dates for offline bookings or maintenance.
            </p>
          </div>
          <Button
            onClick={fetchData}
            className="bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/15 px-4 h-10 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Card 1: Monthly Earnings */}
          <div className="bg-[#0e0e12]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group transition-colors">
            <span className="text-xs text-white/50 font-medium tracking-wider uppercase">Earnings This Month</span>
            <h3 className="text-3xl font-bold text-[#c5a059] mt-2">₹{thisMonthEarnings.toLocaleString()}</h3>
            <p className="text-[10px] text-white/40 mt-2">Active online/offline reservations</p>
          </div>

          {/* Card 2: Total Bookings */}
          <div className="bg-[#0e0e12]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group transition-colors">
            <span className="text-xs text-white/50 font-medium tracking-wider uppercase">Total Bookings</span>
            <h3 className="text-3xl font-bold text-white mt-2">{bookings.length}</h3>
            <p className="text-[10px] text-white/40 mt-2">Includes offline blocked periods</p>
          </div>

          {/* Card 3: Active Listings */}
          <div className="bg-[#0e0e12]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group transition-colors">
            <span className="text-xs text-white/50 font-medium tracking-wider uppercase">Active Listings</span>
            <h3 className="text-3xl font-bold text-white mt-2">{venues.length}</h3>
            <p className="text-[10px] text-white/40 mt-2">Spaces hosted under your account</p>
          </div>

          {/* Card 4: Offline Locking Toggle Card */}
          <button
            type="button"
            onClick={() => setIsLockingFormOpen(!isLockingFormOpen)}
            className={cn(
              "text-left bg-[#0e0e12]/80 border rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group transition-all w-full select-none cursor-pointer",
              isLockingFormOpen
                ? "border-[#c5a059] bg-[#c5a059]/10 shadow-lg shadow-[#c5a059]/10"
                : "border-white/10"
            )}
          >
            <span className="text-xs text-white/50 font-medium tracking-wider uppercase">Offline Locking</span>
            <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
              {isLockingFormOpen ? 'Lock Form Open' : 'Block Dates'}
            </h3>
            <p className="text-[10px] text-[#c5a059] mt-3 font-semibold group-hover:underline">
              {isLockingFormOpen ? 'Click to close panel' : 'Click to lock venue dates'}
            </p>
          </button>
        </div>

        {/* Collapsible Form Section */}
        <AnimatePresence>
          {isLockingFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-10 w-full"
            >
              <div className="bg-[#0e0e12]/95 border border-[#c5a059]/30 rounded-2xl p-6 backdrop-blur-md space-y-6 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Lock className="w-12 h-12 text-[#c5a059]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#c5a059]" /> Lock Venue Dates
                  </h3>
                  <p className="text-xs text-white/50 font-light">
                    Block dates for offline rentals, corporate events, or routine venue maintenance.
                  </p>
                </div>

                <hr className="border-white/10" />

                <form onSubmit={handleLockSubmit} className="space-y-4">
                  {/* Select Venue */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Select Venue *</label>
                    {venues.length === 0 ? (
                      <div className="text-xs text-white/40 bg-white/5 border border-white/10 rounded-xl p-3">
                        No active listings found under your host account. Create one first!
                      </div>
                    ) : (
                      <select
                        value={selectedVenueId}
                        onChange={(e) => setSelectedVenueId(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                      >
                        {venues.map((v) => (
                          <option key={v.id} value={v.id} className="bg-[#0e0e12] text-white">
                            {v.title} (₹{v.pricePerNight}/{v.bookingType === 'hours' ? 'hr' : 'night'})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Date Selectors */}
                  {isHours ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Lock Date *</label>
                        <input
                          type="date"
                          value={lockDate}
                          min={todayStr}
                          onChange={(e) => setLockDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Start Hour *</label>
                        <input
                          type="time"
                          value={lockStartHour}
                          onChange={(e) => setLockStartHour(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">End Hour *</label>
                        <input
                          type="time"
                          value={lockEndHour}
                          onChange={(e) => setLockEndHour(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Lock Start Date *</label>
                        <input
                          type="date"
                          value={startDate}
                          min={todayStr}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Unlock Date *</label>
                        <input
                          type="date"
                          value={endDate}
                          min={startDate || todayStr}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Reason/Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Reason / Details *</label>
                    <input
                      type="text"
                      value={lockNotes}
                      onChange={(e) => setLockNotes(e.target.value)}
                      placeholder="e.g., Offline Booking - Sarah's Wedding"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                    />
                  </div>

                  {/* Customer Contact details */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Customer Name *</label>
                    <input
                      type="text"
                      value={lockRenterName}
                      onChange={(e) => setLockRenterName(e.target.value)}
                      placeholder="Sarah Smith"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Customer Phone *</label>
                      <input
                        type="tel"
                        value={lockRenterPhone}
                        onChange={(e) => setLockRenterPhone(e.target.value)}
                        placeholder="e.g. +1 555-0122"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Customer Email *</label>
                      <input
                        type="email"
                        value={lockRenterEmail}
                        onChange={(e) => setLockRenterEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Optional Financial Details */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Offline Revenue (₹)</label>
                      <input
                        type="number"
                        value={lockRevenue || ''}
                        onChange={(e) => setLockRevenue(Number(e.target.value))}
                        placeholder="e.g., 1500 (Optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Offline Guests</label>
                      <input
                        type="number"
                        value={lockGuests || ''}
                        onChange={(e) => setLockGuests(Number(e.target.value))}
                        placeholder="e.g., 50 (Optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => setIsLockingFormOpen(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-medium h-11"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isLocking ||
                        venues.length === 0 ||
                        !lockRenterName ||
                        !lockRenterPhone ||
                        !lockRenterEmail ||
                        (isHours ? (!lockDate || !lockStartHour || !lockEndHour) : (!startDate || !endDate))
                      }
                      className="flex-1 bg-[#c5a059] hover:bg-[#b08e4d] disabled:opacity-40 disabled:hover:bg-[#c5a059] text-black font-semibold rounded-xl h-11 shadow-lg shadow-[#c5a059]/10 transition-all flex items-center justify-center gap-2"
                    >
                      {isLocking ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          Establish Block
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Booking Calendar Section */}
        <div className="bg-[#0e0e12]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group transition-all mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-[#c5a059]" /> Interactive Calendar Visualizer
              </h3>
              <p className="text-xs text-white/50 font-light">
                Check out the hover-interactive schedule planner. Click any date to pin its bookings to the top.
              </p>
            </div>
            {venues.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Select Venue:</span>
                <select
                  value={selectedCalendarVenueId}
                  onChange={(e) => setSelectedCalendarVenueId(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors cursor-pointer max-w-[200px]"
                >
                  <option value="all" className="bg-[#0e0e12] text-white">All Venues</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[#0e0e12] text-white">
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <hr className="border-white/10 mb-6" />
          <InteractiveCalendar bookings={filteredCalendarBookings} />
        </div>

        {/* Redirect to Bookings section */}
        <div className="mt-8 text-center bg-[#0e0e12]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md max-w-xl mx-auto">
          <p className="text-sm text-white/70 font-light">
            Need to inspect detailed customer profiles, manage check-ins, or cancel active schedules?
          </p>
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 mt-4 text-[#c5a059] hover:text-[#dfba75] text-sm font-semibold transition-all group"
          >
            Go to Lease Reservations Section
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* DETAIL MODAL DRAWER */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm pointer-events-auto"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0d0d11] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden text-left"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#13131a]">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#c5a059] font-mono font-bold">
                    {selectedBooking.status === 'offline' ? 'Offline Date Block' : 'Online Reservation'}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">{selectedBooking.venueTitle}</h4>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="bg-[#13131a] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                  <img src={selectedBooking.venueImage} className="w-16 h-16 rounded-lg object-cover border border-white/10" alt="Venue view" />
                  <div>
                    <h5 className="font-semibold text-white text-sm">{selectedBooking.venueTitle}</h5>
                    <div className="flex items-center gap-1 text-white/50 text-xs mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{selectedBooking.venueLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Log ID</span>
                    <span className="font-mono text-white font-semibold">{selectedBooking.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">{selectedBooking.status === 'offline' ? 'Locked From' : 'Check-In'}</span>
                    <span className="text-white font-medium">
                      {selectedBooking.bookingType === 'hours'
                        ? new Date(selectedBooking.startDate).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
                        : formatDate(selectedBooking.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">{selectedBooking.status === 'offline' ? 'Unlocked On' : 'Check-Out'}</span>
                    <span className="text-white font-medium">
                      {selectedBooking.bookingType === 'hours'
                        ? new Date(selectedBooking.endDate).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
                        : formatDate(selectedBooking.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Offline Guests</span>
                    <span className="text-white font-semibold">{selectedBooking.guests} Guests</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Logged Date</span>
                    <span className="text-white font-medium">{formatDate(selectedBooking.bookingDate)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Status</span>
                    <span className="text-white font-bold capitalize">{selectedBooking.status}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/40 font-medium">Associated Revenue</span>
                    <span className="text-sm font-bold text-[#c5a059]">₹{Number(selectedBooking.totalPrice).toLocaleString()}</span>
                  </div>
                </div>

                {/* Details Notes */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                  <p className="text-[10px] text-[#c5a059] uppercase tracking-widest font-bold">
                    {selectedBooking.status === 'offline' ? 'Block notes' : 'Renter info & instructions'}
                  </p>
                  {selectedBooking.status === 'offline' ? (
                    <div className="space-y-4">
                      {selectedBooking.renterName && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#c5a059] flex items-center justify-center text-black font-bold text-xs uppercase">
                              {selectedBooking.renterName.charAt(0)}
                            </div>
                            <div>
                              <h6 className="font-semibold text-white text-xs">{selectedBooking.renterName}</h6>
                              <a href={`mailto:${selectedBooking.renterEmail}`} className="text-[11px] text-white/50 hover:underline block">{selectedBooking.renterEmail}</a>
                              {selectedBooking.renterPhone && (
                                <span className="text-[11px] text-white/40 block">Phone: {selectedBooking.renterPhone}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="border-t border-white/5 pt-2 text-xs text-white/70 leading-relaxed font-light">
                        <strong className="text-[#c5a059] font-medium block mb-1">Block Notes & Instructions:</strong>
                        {selectedBooking.checkInInstructions}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#c5a059] flex items-center justify-center text-black font-bold text-xs uppercase">
                          {selectedBooking.renterName ? selectedBooking.renterName.charAt(0) : 'U'}
                        </div>
                        <div>
                          <h6 className="font-semibold text-white text-xs">{selectedBooking.renterName || 'Registered User'}</h6>
                          <a href={`mailto:${selectedBooking.renterEmail}`} className="text-[11px] text-white/50 hover:underline block">{selectedBooking.renterEmail || 'N/A'}</a>
                          {selectedBooking.renterPhone && (
                            <span className="text-[11px] text-white/40 block">Phone: {selectedBooking.renterPhone}</span>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-white/5 pt-2 text-xs text-white/70 leading-relaxed font-light">
                        {selectedBooking.checkInInstructions}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-[#13131a] border-t border-white/5 flex gap-3">
                {selectedBooking.renterEmail && (
                  <a
                    href={`mailto:${selectedBooking.renterEmail}?subject=Regarding your booking ${selectedBooking.id} at ${selectedBooking.venueTitle}`}
                    className="flex-1 py-2.5 text-xs font-semibold text-center text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/15 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email Renter
                  </a>
                )}
                <Button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-full h-10 transition-all text-xs"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CANCELLATION/UNLOCK DIALOG */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelTarget(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm pointer-events-auto"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#0d0d11] border border-white/10 w-full max-w-md p-6 rounded-3xl shadow-2xl z-10 space-y-5 text-center"
            >
              <div className="w-12 h-12 bg-red-950/20 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  {cancelTarget.status === 'offline' ? 'Unlock Venue Dates?' : 'Cancel Reservation?'}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Are you sure you want to remove the block/reservation for <strong className="text-white">{cancelTarget.venueTitle}</strong>{' '}
                  {cancelTarget.bookingType === 'hours' ? (
                    <>
                      on <strong className="text-white">{new Date(cancelTarget.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong>{' '}
                      from <strong className="text-white">{new Date(cancelTarget.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</strong>{' '}
                      to <strong className="text-white">{new Date(cancelTarget.endDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</strong>
                    </>
                  ) : (
                    <>
                      from <strong className="text-white">{formatDate(cancelTarget.startDate)}</strong>{' '}
                      to <strong className="text-white">{formatDate(cancelTarget.endDate)}</strong>
                    </>
                  )}?
                </p>
                <p className="text-[10px] text-red-400/80 bg-red-950/10 border border-red-500/10 p-2.5 rounded-lg font-light leading-normal">
                  {cancelTarget.status === 'offline'
                    ? "This block will be removed. The slot will become available for public online bookings on our portal immediately."
                    : `This reservation is for renter ${cancelTarget.renterName}. Cancelling it will trigger a full refund of ₹{cancelTarget.totalPrice.toLocaleString()}.`}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full h-11 text-xs"
                >
                  Keep Booking
                </Button>
                <Button
                  onClick={handleConfirmCancel}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full h-11 text-xs"
                >
                  {cancelTarget.status === 'offline' ? 'Unlock Dates' : 'Cancel Booking'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST SUCCESS ALERT */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#0e0e12] border border-white/10 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span className="text-xs font-medium text-white/90">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
