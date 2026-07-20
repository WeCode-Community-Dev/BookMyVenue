'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { BookingDetailsModal } from '@/components/booking/booking-details-modal';
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  IndianRupee, 
  Plus, 
  CalendarRange, 
  Eye, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react';

// --- REUSABLE COMPONENTS ---

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description, loading }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[145px] relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2.5">
            {loading ? (
              <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded"></span>
            ) : (
              value
            )}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
      </div>
      <p className="text-[10px] text-slate-500 font-semibold mt-auto">
        {description}
      </p>
    </div>
  );
};

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, href, disabled }) => {
  const content = (
    <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 h-[95px] w-full text-left ${
      disabled 
        ? 'border-slate-150 bg-slate-50/50 cursor-not-allowed opacity-60' 
        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/40 hover:-translate-y-0.5 cursor-pointer group'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl transition-all duration-300 ${
          disabled 
            ? 'bg-slate-100 text-slate-400' 
            : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
        }`}>
          {icon}
        </div>
        <div>
          <h4 className={`font-bold text-sm ${disabled ? 'text-slate-500' : 'text-slate-800 group-hover:text-indigo-950'}`}>{title}</h4>
          <p className="text-xs text-slate-400 mt-1 leading-normal">{description}</p>
        </div>
      </div>
      {!disabled && (
        <span className="text-slate-350 group-hover:text-indigo-650 group-hover:translate-x-0.5 transition-all">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
        </span>
      )}
    </div>
  );

  if (disabled || !href) {
    return content;
  }

  return (
    <Link href={href} className="block w-full">
      {content}
    </Link>
  );
};

interface UpcomingBookingRowProps {
  booking: any;
  onViewDetails: (booking: any) => void;
}

const UpcomingBookingRow: React.FC<UpcomingBookingRowProps> = ({ booking, onViewDetails }) => {
  const venueName = booking.venueId?.name || booking.venueName || 'Venue';
  const customerName = booking.userId?.name || booking.userName || 'Customer';
  const bookingDate = new Date(booking.date || booking.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const bookingTime = booking.slot ? `${booking.slot.startTime} - ${booking.slot.endTime}` : '';
  
  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-250';
      case 'PENDING':
      case 'REQUESTED':
        return 'bg-amber-50 text-amber-700 border-amber-250';
      case 'CANCELLED':
      case 'DECLINED':
        return 'bg-rose-50 text-rose-700 border-rose-250';
      default:
        return 'bg-slate-50 text-slate-750 border-slate-250';
    }
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-all border-b border-slate-100 last:border-none">
      <td className="py-4 px-6">
        <div className="font-bold text-slate-800 text-xs">{venueName}</div>
      </td>
      <td className="py-4 px-6">
        <div className="text-slate-650 font-bold text-xs">{customerName}</div>
      </td>
      <td className="py-4 px-6">
        <div className="text-slate-500 font-extrabold text-[10px]">{bookingDate}</div>
        {bookingTime && <div className="text-[9px] text-slate-400 font-medium mt-0.5">{bookingTime}</div>}
      </td>
      <td className="py-4 px-6">
        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border tracking-wider ${getStatusStyle(booking.status || '')}`}>
          {booking.status}
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="font-extrabold text-slate-800 text-xs">₹{(booking.totalPrice || booking.price || 0).toLocaleString()}</div>
      </td>
      <td className="py-4 px-6 text-right">
        <button
          type="button"
          onClick={() => onViewDetails(booking)}
          className="text-[10px] font-bold text-indigo-650 hover:text-indigo-500 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer border-none"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">{title}</h2>
        {subtitle && <p className="text-[10px] text-slate-400 mt-0.5 font-bold">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // States
  const [totalVenues, setTotalVenues] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [confirmedBookingsThisMonth, setConfirmedBookingsThisMonth] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [rescheduleRequests, setRescheduleRequests] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Details Modal State
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const openDetailsModal = (booking: any) => {
    setSelectedBookingDetails(booking);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'Venue owner') {
        router.push('/');
      } else {
        setCurrentUser(user);
        fetchStatsAndBookings(user.id || user._id);
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchStatsAndBookings = async (userId: string) => {
    setLoadingStats(true);
    try {
      const venuesRes = await api.get('/venues/my');
      const ownerVenues = venuesRes.data;
      setTotalVenues(ownerVenues.length);

      const bookingsRes = await api.get(`/bookings/owner/${userId}`);
      const ownerBookings = bookingsRes.data || [];

      // Calculate stats
      setPendingBookings(ownerBookings.filter((b: any) => ['PENDING', 'REQUESTED', 'PAYMENT_PENDING', 'LOCKED'].includes((b.status || '').toUpperCase())).length);
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const confirmed = ownerBookings.filter((b: any) => {
        const isConfirmed = (b.status || '').toUpperCase() === 'CONFIRMED';
        const bDate = new Date(b.createdAt || b.date);
        return isConfirmed && bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear;
      }).length;
      setConfirmedBookingsThisMonth(confirmed);

      const rev = ownerBookings.reduce((sum: number, b: any) => {
        const isConfirmed = (b.status || '').toUpperCase() === 'CONFIRMED';
        const bDate = new Date(b.createdAt || b.date);
        const isThisMonth = bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear;
        if (isConfirmed && isThisMonth) {
          return sum + (Number(b.totalPrice) || 0);
        }
        return sum;
      }, 0);
      setMonthlyRevenue(rev);

      const sortedBookings = [...ownerBookings].sort((a: any, b: any) => {
        return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
      });
      
      // latest 5 bookings
      setRecentBookings(sortedBookings.slice(0, 5));

      // pending reschedule requests
      const pendingReschedules = ownerBookings.filter((b: any) => (b.rescheduleStatus || '').toUpperCase() === 'PENDING');
      setRescheduleRequests(pendingReschedules);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleApproveReschedule = async (bookingId: string) => {
    if (!confirm('Are you sure you want to approve this reschedule request?')) return;
    try {
      await api.patch(`/bookings/${bookingId}/reschedule/approve`);
      alert('Reschedule request approved successfully.');
      if (currentUser?.id || currentUser?._id) {
        fetchStatsAndBookings(currentUser.id || currentUser._id);
      }
    } catch (err: any) {
      console.error('Approval error:', err);
      alert(err.response?.data?.message || 'Failed to approve reschedule request.');
    }
  };

  const handleRejectReschedule = async (bookingId: string) => {
    if (!confirm('Are you sure you want to reject this reschedule request?')) return;
    try {
      await api.patch(`/bookings/${bookingId}/reschedule/reject`);
      alert('Reschedule request rejected successfully.');
      if (currentUser?.id || currentUser?._id) {
        fetchStatsAndBookings(currentUser.id || currentUser._id);
      }
    } catch (err: any) {
      console.error('Rejection error:', err);
      alert(err.response?.data?.message || 'Failed to reject reschedule request.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              BookMyVenue
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/owner/dashboard" className="text-indigo-600 font-semibold text-sm">
                Dashboard
              </Link>
              <Link href="/owner/venues" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                My Venues
              </Link>
              <Link href="/owner/bookings" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Bookings
              </Link>
              <Link href="/owner/profile" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{currentUser.name}</span>
              <span className="text-xs text-slate-500 font-medium capitalize">{currentUser.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm transition-all duration-200 px-4 py-2 rounded-xl border border-rose-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-8 rounded-3xl shadow-xl mb-8">
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold tracking-wider uppercase">
              Owner Panel
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{currentUser.name}</span>!
            </h1>
            <p className="text-slate-300 mt-2 max-w-2xl text-sm sm:text-base">
              Manage your venue listings, monitor event bookings, track your earnings.
            </p>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Venues"
            value={totalVenues}
            description="Active property listings"
            loading={loadingStats}
            icon={<Building2 className="w-5 h-5" />}
          />
          <StatCard
            title="Pending Booking Requests"
            value={pendingBookings}
            description="Awaiting manual response"
            loading={loadingStats}
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            title="Confirmed Bookings This Month"
            value={confirmedBookingsThisMonth}
            description="Successfully confirmed"
            loading={loadingStats}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${monthlyRevenue.toLocaleString()}`}
            description="Confirmed earnings this month"
            loading={loadingStats}
            icon={<IndianRupee className="w-5 h-5" />}
          />
        </section>

        {/* Pending Reschedule Requests Section */}
        {rescheduleRequests.length > 0 && (
          <section className="bg-white rounded-3xl border border-violet-200/80 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600"></span>
                  </span>
                  Pending Reschedule Requests
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Review and respond to client rescheduling preferences</p>
              </div>
            </div>

            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="py-3.5 px-6">Venue</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Current Slot</th>
                    <th className="py-3.5 px-6">Requested Slot</th>
                    <th className="py-3.5 px-6">Reason</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rescheduleRequests.map((req) => {
                    const bId = req.id || req._id;
                    const venueName = req.venueId?.name || req.venueName || 'Venue';
                    const customerName = req.userId?.name || req.userName || 'Customer';
                    const currentSlotStr = req.date;
                    const requestedSlotStr = req.pendingReschedule?.requestedDate || 'N/A';
                    const reason = req.pendingReschedule?.reason || 'None provided';

                    return (
                      <tr key={bId} className="hover:bg-slate-50/80 transition-all border-b border-slate-100 last:border-none">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800 text-xs">{venueName}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-slate-650 font-bold text-xs">{customerName}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-rose-600 font-extrabold text-[10px]">{currentSlotStr}</div>
                          <div className="text-[9px] text-slate-400 font-medium mt-0.5">{req.hours} hour(s)</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-emerald-600 font-extrabold text-[10px]">{requestedSlotStr}</div>
                          <div className="text-[9px] text-slate-400 font-medium mt-0.5">{req.pendingReschedule?.requestedHours || req.hours} hour(s)</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-slate-500 text-xs italic max-w-xs truncate">{reason}</div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleRejectReschedule(bId)}
                              className="text-[10px] font-bold text-rose-650 hover:text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer border-none"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveReschedule(bId)}
                              className="text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer border-none shadow-md shadow-indigo-100"
                            >
                              Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Dashboard Grid Details */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Upcoming Bookings */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <SectionHeader 
              title="Upcoming Bookings" 
              subtitle="Monitor and manage your latest five bookings"
              action={
                <Link href="/owner/bookings" className="text-xs font-bold text-indigo-650 hover:text-indigo-500 flex items-center gap-1 transition-colors">
                  View All Bookings &rarr;
                </Link>
              }
            />
            
            {/* Compact Rows Table representation */}
            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="py-3.5 px-6">Venue Name</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Date & Time</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Amount</th>
                    <th className="py-3.5 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingStats ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-indigo-650 border-t-transparent animate-spin"></div>
                          <span className="text-xs text-slate-450 font-bold">Loading bookings...</span>
                        </div>
                      </td>
                    </tr>
                  ) : recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-450 italic font-semibold">
                        No recent bookings found.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <UpcomingBookingRow
                        key={booking.id || booking._id}
                        booking={booking}
                        onViewDetails={openDetailsModal}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Quick Actions */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col gap-4">
            <SectionHeader 
              title="Quick Actions" 
              subtitle="Shortcut links to listing management"
            />
            
            <div className="flex flex-col gap-3">
              <QuickActionCard
                icon={<Plus className="w-5 h-5" />}
                title="Add New Venue"
                description="Create a listing and configure options"
                href="/owner/venues/create"
              />
              
              <QuickActionCard
                icon={<CalendarRange className="w-5 h-5" />}
                title="Manage Bookings"
                description="Review and update requests"
                href="/owner/bookings"
              />

              <QuickActionCard
                icon={<Eye className="w-5 h-5" />}
                title="View Listings"
                description="Monitor list, status and reviews"
                href="/owner/venues"
              />

              {/* <QuickActionCard
                icon={<TrendingUp className="w-5 h-5" />}
                title="Analytics"
                description="View traffic and conversion insights"
                disabled
              /> */}
            </div>
          </div>
        </section>
      </main>

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBookingDetails(null);
        }}
        booking={selectedBookingDetails}
        onBookingUpdated={(updatedBooking) => {
          if (currentUser?.id || currentUser?._id) {
            fetchStatsAndBookings(currentUser.id || currentUser._id);
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            BookMyVenue
          </p>
        </div>
      </footer>
    </div>
  );
}