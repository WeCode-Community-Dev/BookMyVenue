"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { VenueSlotsModal } from "@/components/booking/venue-slots-modal";
import { BookingDetailsModal } from "@/components/booking/booking-details-modal";
import { CancelBookingModal } from "@/components/booking/cancel-booking-modal";
import { RescheduleModal } from "@/components/booking/reschedule-modal";

interface Venue {
  id: string;
  _id?: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  rating: number;
  imageUrl: string;
  description: string;
  amenities: string[];
  featured?: boolean;
}

interface Booking {
  id: string;
  _id?: string;
  userId: string;
  venueId: {
    id: string;
    _id?: string;
    name: string;
    location: string;
    imageUrl?: string;
    pricePerHour: number;
  };
  date: string;
  hours: number;
  totalPrice: number;
  status: string; // pending, confirmed, cancelled, completed
  cancellationReason?: string;
  rescheduleStatus?: string;
  pendingReschedule?: any;
}

const packagePriceCache = new Map<string, number | null>();

const getMinPackagePrice = (venue: any): number | null => {
  const venueId = venue.id || venue._id || '';
  if (venueId && packagePriceCache.has(venueId)) {
    return packagePriceCache.get(venueId)!;
  }

  const avail = venue.availability || venue.weeklyAvailability;
  if (!avail) {
    if (venueId) packagePriceCache.set(venueId, null);
    return null;
  }
  
  let minPrice: number | null = null;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const day of days) {
    const dayData = avail[day];
    if (dayData && dayData.isOpen && dayData.slots && Array.isArray(dayData.slots)) {
      for (const slot of dayData.slots) {
        if (slot && typeof slot.price === 'number' && slot.price > 0) {
          if (minPrice === null || slot.price < minPrice) {
            minPrice = slot.price;
          }
        }
      }
    }
  }

  if (venueId) packagePriceCache.set(venueId, minPrice);
  return minPrice;
};

// Trust Badges & Icons Helper
const getCategoryIcon = (type: string) => {
  const lower = type.toLowerCase();
  if (lower === 'all') return '🌟';
  if (lower.includes('auditorium')) return '🏛️';
  if (lower.includes('banquet')) return '🎉';
  if (lower.includes('wedding')) return '💒';
  if (lower.includes('conference') || lower.includes('meeting')) return '🏢';
  if (lower.includes('outdoor') || lower.includes('garden') || lower.includes('lawn')) return '🌳';
  return '📍';
};

const renderBookingModeBadges = (venue: any) => {
  const bookingModes = venue.bookingModes || {};
  const hasAnyModeDefined = 'hourlyBooking' in bookingModes || 'fixedSlots' in bookingModes || 'customRequests' in bookingModes;
  
  const isHourly = hasAnyModeDefined 
    ? !!bookingModes.hourlyBooking 
    : !!(venue.pricePerHour || venue.hourlyBookingConfiguration?.pricePerHour);
  
  const isPackages = hasAnyModeDefined
    ? !!bookingModes.fixedSlots
    : !!(venue.availability || venue.weeklyAvailability);

  const isCustom = hasAnyModeDefined
    ? !!bookingModes.customRequests
    : !!venue.customBookingConfiguration?.enabled;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {isHourly && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150">
          🕒 Hourly
        </span>
      )}
      {isPackages && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
          📦 Packages
        </span>
      )}
      {isCustom && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-150">
          💬 Custom
        </span>
      )}
    </div>
  );
};

export default function CustomerDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Venues and Search states
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [loadingVenues, setLoadingVenues] = useState(true);

  // Bookings states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Slots Modal states
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [slotsVenue, setSlotsVenue] = useState<Venue | null>(null);

  // Details Modal states
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Cancel Modal state
  const [selectedCancelBooking, setSelectedCancelBooking] = useState<any>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const openCancelModal = (booking: any) => {
    setSelectedCancelBooking(booking);
    setIsCancelModalOpen(true);
  };

  // Reschedule Modal state
  const [selectedRescheduleBooking, setSelectedRescheduleBooking] = useState<any>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const openRescheduleModal = (booking: any) => {
    setSelectedRescheduleBooking(booking);
    setIsRescheduleModalOpen(true);
  };

  // Saved venues list state
  const [savedVenues, setSavedVenues] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    } else {
      router.push("/login");
    }

    // Load saved venues from localStorage
    const saved = localStorage.getItem("savedVenues");
    if (saved) {
      try {
        setSavedVenues(JSON.parse(saved));
      } catch (e) {}
    }
  }, [router]);

  const toggleSaveVenue = (venueId: string) => {
    setSavedVenues(prev => {
      const next = prev.includes(venueId) ? prev.filter(id => id !== venueId) : [...prev, venueId];
      localStorage.setItem("savedVenues", JSON.stringify(next));
      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const fetchVenues = async (query = "") => {
    setLoadingVenues(true);
    try {
      packagePriceCache.clear();
      const response = await api.get(`/venues?search=${encodeURIComponent(query)}`);
      setVenues(response.data);
    } catch (err) {
      console.error("Error fetching venues:", err);
    } finally {
      setLoadingVenues(false);
    }
  };

  const fetchUserBookings = async (userId: string) => {
    setLoadingBookings(true);
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      // Sort bookings by creation/date (newest first)
      const sorted = response.data.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setBookings(sorted);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    if (currentUser?.id || currentUser?._id) {
      fetchUserBookings(currentUser.id || currentUser._id);
    }
  }, [currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVenues(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchVenues("");
  };

  const openSlotsModal = (venue: Venue) => {
    setSlotsVenue(venue);
    setShowSlotsModal(true);
  };

  const openDetailsModal = (booking: any) => {
    setSelectedBookingDetails(booking);
    setIsDetailsModalOpen(true);
  };

  const handlePayBooking = async (bookingId: string, amount: number) => {
    if (!confirm(`Are you sure you want to complete the mock payment of RS ${amount}?`)) {
      return;
    }
    setLoadingBookings(true);
    try {
      await api.post("/payments", {
        bookingId,
        amount,
        paymentMethod: "mock"
      });
      if (currentUser?.id || currentUser?._id) {
        await fetchUserBookings(currentUser.id || currentUser._id);
      }
      alert("Payment completed and booking confirmed successfully!");
    } catch (err: any) {
      console.error("Payment confirmation failed:", err);
      alert(err.response?.data?.message || "Payment processing failed. Please try again.");
    } finally {
      setLoadingBookings(false);
    }
  };

  // Stats calculation
  const stats = {
    upcoming: bookings.filter(b => ['CONFIRMED', 'PAYMENT_PENDING'].includes(b.status.toUpperCase())).length,
    completed: bookings.filter(b => b.status.toUpperCase() === 'COMPLETED').length,
    pending: bookings.filter(b => b.status.toUpperCase() === 'REQUESTED').length,
    saved: savedVenues.length
  };

  // Get distinct venue types from the retrieved venues
  const venueTypes = ["All", ...Array.from(new Set(venues.map((v) => v.type)))];

  // Client-side filter based on selected type tab
  const filteredVenues = selectedType === "All" 
    ? venues 
    : venues.filter((v) => v.type === selectedType);

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Securing session...</p>
      </div>
    );
  }

  // Mini pricing options renderer
  const renderPricingOptionText = (venue: any) => {
    const bookingModes = venue.bookingModes || {};
    const hasAnyModeDefined = 'hourlyBooking' in bookingModes || 'fixedSlots' in bookingModes || 'customRequests' in bookingModes;
    
    const isHourly = hasAnyModeDefined 
      ? !!bookingModes.hourlyBooking 
      : !!(venue.pricePerHour || venue.hourlyBookingConfiguration?.pricePerHour);
    
    const isPackages = hasAnyModeDefined
      ? !!bookingModes.fixedSlots
      : !!(venue.availability || venue.weeklyAvailability);

    const isCustom = hasAnyModeDefined
      ? !!bookingModes.customRequests
      : !!venue.customBookingConfiguration?.enabled;

    const hourlyPrice = venue.hourlyBookingConfiguration?.pricePerHour ?? venue.pricePerHour;
    const minPackagePrice = getMinPackagePrice(venue);

    if (isHourly && hourlyPrice !== undefined && hourlyPrice !== null) {
      return (
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">From</span>
          <span className="text-base font-extrabold text-indigo-600">₹{hourlyPrice.toLocaleString('en-IN')}<span className="text-[10px] text-slate-500 font-medium">/hr</span></span>
        </div>
      );
    }

    if (isPackages && minPackagePrice !== null) {
      return (
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Packages from</span>
          <span className="text-base font-extrabold text-emerald-600">₹{minPackagePrice.toLocaleString('en-IN')}</span>
        </div>
      );
    }

    if (isCustom) {
      return (
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Quote Options</span>
          <span className="text-sm font-extrabold text-amber-600">Custom Quote Available</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Price</span>
        <span className="text-sm font-extrabold text-slate-500">Contact Owner</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">BookMyVenue</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Dashboard
            </Link>
            <Link 
              href="/bookings" 
              className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Bookings
            </Link>
            <Link 
              href="/profile" 
              className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl"
            >
              Profile
            </Link>
            
            {/* User welcome message */}
            <span className="hidden md:inline-block text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              👋 Hi, <span className="text-slate-800 font-bold">{currentUser.name}</span>
            </span>

            <button 
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-semibold text-sm transition-all duration-200 px-4 py-2 rounded-xl border border-rose-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-12">
        
        {/* REDESIGNED HERO SECTION (Airbnb / SaaS style) */}
        <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Welcome & Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3 leading-tight">
                  Welcome back, <br className="sm:hidden" />
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">{currentUser.name} 👋</span>
                </h1>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-lg">
                  Ready to plan your next event? Explore verified spaces, manage booking requests, and secure checkout instantly.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a 
                  href="#venues-section" 
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs tracking-wider transition-all duration-200 shadow-md flex items-center gap-1.5"
                >
                  Browse Venues
                </a>
                <Link 
                  href="/bookings" 
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs tracking-wider transition-all duration-200 border border-white/15 flex items-center gap-1.5"
                >
                  View My Bookings
                </Link>
              </div>
            </div>

            {/* Right Column: Statistics Grid */}
            {/* <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-3 w-full max-w-xs ml-auto">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Upcoming</span>
                      <span className="text-[11px] text-slate-300">Approved & Pending Pay</span>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white">{stats.upcoming}</span>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Completed</span>
                      <span className="text-[11px] text-slate-300">Past successful bookings</span>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white">{stats.completed}</span>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Pending</span>
                      <span className="text-[11px] text-slate-300">Awaiting owner response</span>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white">{stats.pending}</span>
                </div>
              </div>
            </div> */}
          </div>
        </section>

        {/* UPCOMING BOOKINGS SECTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Your Upcoming Bookings</h2>
              <p className="text-xs text-slate-500">Track and manage your requested venue slots</p>
            </div>
            {bookings.length > 3 && (
              <Link 
                href="/bookings"
                className="text-xs font-bold text-indigo-650 hover:text-indigo-700 flex items-center gap-1 hover:underline"
              >
                View All Bookings &rarr;
              </Link>
            )}
          </div>

          {loadingBookings ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-205 shadow-sm animate-pulse flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100"></div>
                    <div className="space-y-2">
                      <div className="h-3.5 bg-slate-100 rounded w-32"></div>
                      <div className="h-3 bg-slate-100 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-100 rounded-lg w-20"></div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Upcoming Bookings</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Browse the listings below to book a venue instantly.</p>
              <a href="#venues-section" className="inline-block mt-4 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all shadow-sm">
                Browse Venues
              </a>
            </div>
          ) : (
            /* COMPACT LIST ROWS */
            <div className="space-y-3">
              {bookings.slice(0, 3).map((booking) => {
                const bId = booking.id || booking._id || "";
                const venue = booking.venueId || {};
                const statusUpper = (booking.status || '').toUpperCase();
                
                const isCancellable = ['REQUESTED', 'PAYMENT_PENDING', 'CONFIRMED'].includes(statusUpper);
                const isReschedulable = !['COMPLETED', 'NO_SHOW', 'REJECTED', 'EXPIRED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_OWNER', 'CANCELLED'].includes(statusUpper) && booking.rescheduleStatus !== 'PENDING';
                
                let formattedDate = "";
                try {
                  formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                } catch(e) {
                  formattedDate = booking.date;
                }

                return (
                  <div key={bId} className="bg-white hover:bg-slate-50/40 p-3.5 rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/50">
                        {venue.imageUrl ? (
                          <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50 text-xs">🏢</div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-850 line-clamp-1">{venue.name || "Venue"}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>📍 {venue.location}</span>
                          <span className="text-slate-350">•</span>
                          <span>📅 {formattedDate}</span>
                          <span className="text-slate-350">•</span>
                          <span>🕒 {booking.hours} hr(s)</span>
                        </p>
                        {booking.rescheduleStatus === 'PENDING' && (
                          <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded-full bg-violet-50 text-violet-750 border border-violet-150 animate-pulse mt-1.5">
                            Reschedule Pending (Waiting for Owner Approval)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="flex flex-col items-start md:items-end">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total price</span>
                        <span className="text-sm font-extrabold text-slate-800">₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Compact Status Badges */}
                      <div>
                        {statusUpper === 'CONFIRMED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 font-sans">Confirmed</span>
                        )}
                        {statusUpper === 'COMPLETED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-150 font-sans">Completed</span>
                        )}
                        {statusUpper === 'PAYMENT_PENDING' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-150 animate-pulse font-sans">Pay Pending</span>
                        )}
                        {statusUpper === 'REQUESTED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 animate-pulse font-sans">Requested</span>
                        )}
                        {!['CONFIRMED', 'COMPLETED', 'PAYMENT_PENDING', 'REQUESTED'].includes(statusUpper) && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 font-sans">{booking.status}</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 font-sans">
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer font-sans"
                        >
                          View Details
                        </button>

                        {statusUpper === 'PAYMENT_PENDING' && (
                          <button
                            onClick={() => handlePayBooking(bId, booking.totalPrice)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-100 font-sans"
                          >
                            Pay
                          </button>
                        )}

                        {isReschedulable && (
                          <button
                            onClick={() => openRescheduleModal(booking)}
                            className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs rounded-xl transition-all cursor-pointer font-sans"
                          >
                            Reschedule
                          </button>
                        )}

                        {isCancellable && (
                          <button
                            onClick={() => openCancelModal(booking)}
                            className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs rounded-xl transition-all cursor-pointer font-sans"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* VENUES DIRECTORY & BROWSE SECTION */}
        <section id="venues-section" className="space-y-6 pt-4">
          
          {/* Title and subtitle */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Browse & Book Venues</h2>
            <p className="text-xs text-slate-500 mt-0.5">Browse verified venues and book instantly.</p>
          </div>

          {/* RETAINED RUCH SEARCH AREA */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Name/Location Search */}
            <div className="flex-1 flex items-center px-3 bg-slate-50/50 rounded-xl border border-slate-100 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <span className="text-slate-400 mr-2 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search venues by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-sm py-2"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Venue Type Filter */}
            <div className="w-full md:w-48 flex items-center px-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="text-slate-400 mr-2 text-sm">🏛️</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent border-0 text-slate-700 text-sm py-2 focus:outline-none focus:ring-0 cursor-pointer"
              >
                {venueTypes.map(t => (
                  <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
                ))}
              </select>
            </div>

            {/* Guest Capacity Filter (Disabled Placeholder) */}
            <div className="w-full md:w-40 flex items-center px-3 bg-slate-550/5 rounded-xl border border-slate-100 opacity-60 cursor-not-allowed select-none">
              <span className="text-slate-400 mr-2 text-xs">👥</span>
              <span className="text-slate-400 text-xs py-2">Guests (Any)</span>
            </div>

            {/* Location Filter (Disabled Placeholder) */}
            <div className="w-full md:w-40 flex items-center px-3 bg-slate-550/5 rounded-xl border border-slate-100 opacity-60 cursor-not-allowed select-none">
              <span className="text-slate-400 mr-2 text-xs">📍</span>
              <span className="text-slate-400 text-xs py-2">Near me</span>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Search
            </button>
          </div>

          {/* CATEGORY CHIPS WITH ICONS */}
          {/* <div className="flex flex-wrap gap-2 pt-2">
            {venueTypes.map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-650 border-indigo-650 text-white shadow-md shadow-indigo-50 scale-[1.02]"
                      : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{getCategoryIcon(type)}</span>
                  <span>{type}</span>
                </button>
              );
            })}
          </div> */}

          {/* Loading Venues State */}
          {loadingVenues ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-5 space-y-4 animate-pulse">
                  <div className="h-48 bg-slate-100 rounded-2xl w-full"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3.5 bg-slate-100 rounded w-full"></div>
                    <div className="h-8 bg-slate-50 rounded-xl w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center px-4">
              <h3 className="text-base font-bold text-slate-800">No Venues Available</h3>
              <p className="mt-2 text-xs text-slate-500 max-w-sm">No venues matched your criteria. Try selecting another category or resetting the search.</p>
              <button
                onClick={handleClearSearch}
                className="mt-5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Try another category
              </button>
            </div>
          ) : (
            /* REDESIGNED VENUE GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVenues.map((venue) => {
                //const isSaved = savedVenues.includes(venue.id || venue._id || "");
                //const seededReviews = Math.floor((venue.name.charCodeAt(0) || 65) * 1.3) + 6;

                return (
                  <article
                    key={venue.id || venue._id}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col shadow-sm"
                  >
                    {/* Image Section */}
                    <div className="h-52 relative overflow-hidden bg-slate-100 shrink-0">
                      {venue.imageUrl ? (
                        <img
                          src={venue.imageUrl}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Top tags overlay */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-sm border border-white/20">
                          {getCategoryIcon(venue.type)} {venue.type}
                        </span>
                        {/* {venue.featured && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-100 bg-indigo-600/80 backdrop-blur-sm border border-indigo-500/20">
                            ★ Featured
                          </span>
                        )} */}
                      </div>

                      {/* Trust Indicators: Verified Owner Badges */}
                      {/* <div className="absolute bottom-4 left-4 flex gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold text-white bg-emerald-600/90 backdrop-blur-sm border border-emerald-500/25 flex items-center gap-1 shadow-sm">
                          🛡️ Verified Owner
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold text-white bg-indigo-650/90 backdrop-blur-sm border border-indigo-500/25 flex items-center gap-1 shadow-sm">
                          ⚡ Instant Book
                        </span>
                      </div> */}

                      {/* Save Venue Heart Button */}
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveVenue(venue.id || venue._id || "");
                        }}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all cursor-pointer ${
                          isSaved
                            ? "bg-rose-50 text-rose-500 border-rose-250 scale-[1.05]"
                            : "bg-slate-900/40 text-white border-white/20 hover:bg-slate-900/60"
                        }`}
                      >
                        {isSaved ? "❤️" : "🤍"}
                      </button> */}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating & Location Row */}
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center text-[10px] font-bold text-slate-450 gap-1 uppercase tracking-wider">
                            📍 {venue.location}
                          </div>
                          {/* <div className="flex items-center text-[10px] font-extrabold text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg gap-1 shadow-sm">
                            <span className="text-amber-500 text-xs">★</span>
                            <span>{venue.rating}</span>
                            <span className="text-slate-400 font-medium">({seededReviews})</span>
                          </div> */}
                        </div>

                        <h3 className="text-base font-extrabold text-slate-950 group-hover:text-indigo-650 transition-colors line-clamp-1 leading-snug">
                          {venue.name}
                        </h3>
                        
                        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {venue.description}
                        </p>

                        {/* Venue Capacity Badge */}
                        <div className="mt-3 flex items-center text-[10px] text-slate-500 font-semibold gap-1 bg-slate-50/60 p-2 rounded-xl border border-slate-100/80">
                          <span>👥</span>
                          <span>Capacity: <span className="text-slate-900 font-bold">{venue.capacity} guests</span></span>
                        </div>

                        {/* Redesigned Pricing Section */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100">
                          <div className="flex justify-between items-end">
                            {renderPricingOptionText(venue)}
                          </div>
                          
                          {/* Booking Mode Badges */}
                          <div className="mt-3 pt-3 border-t border-slate-50">
                            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Supported Modes</span>
                            {renderBookingModeBadges(venue)}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                        <button
                          onClick={() => openSlotsModal(venue)}
                          className="flex-1 bg-slate-900 hover:bg-indigo-650 text-white py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm duration-200 active:scale-[0.98] cursor-pointer"
                        >
                          View Booking Slots
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Booking Slot Modal */}
      <VenueSlotsModal
        isOpen={showSlotsModal}
        onClose={() => setShowSlotsModal(false)}
        venue={slotsVenue}
        currentUser={currentUser}
        onBookSuccess={() => {
          if (currentUser?.id || currentUser?._id) {
            fetchUserBookings(currentUser.id || currentUser._id);
          }
        }}
      />

      {/* Booking Detail Modal */}
      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBookingDetails(null);
        }}
        booking={selectedBookingDetails}
        onBookingUpdated={(updatedBooking) => {
          setBookings((prev) =>
            prev.map((b) =>
              b.id === updatedBooking.id || b._id === updatedBooking._id
                ? updatedBooking
                : b
            )
          );
        }}
      />

      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedCancelBooking(null);
        }}
        booking={selectedCancelBooking}
        onSuccess={() => {
          if (currentUser?.id || currentUser?._id) {
            fetchUserBookings(currentUser.id || currentUser._id);
          }
        }}
      />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedRescheduleBooking(null);
        }}
        booking={selectedRescheduleBooking}
        onSuccess={() => {
          if (currentUser?.id || currentUser?._id) {
            fetchUserBookings(currentUser.id || currentUser._id);
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-bold text-sm">
              BookMyVenue
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
