import { useState, useEffect } from 'react';
import { bookingService, venueService, userService } from '../../services';
import { 
  MdDashboard, 
  MdOutlineMapsHomeWork, 
  MdEventNote, 
  MdOutlinePayments, 
  MdPerson, 
  MdVpnKey, 
  MdBlock, 
  MdTrendingUp, 
  MdEvent, 
  MdAttachMoney, 
  MdCheck, 
  MdClose,
  MdAdd
} from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'overview');

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Date block modal state
  const [blockVenueId, setBlockVenueId] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('Maintenance');

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const bRes = await bookingService.getOwnerBookings();
      setBookings(bRes.data.bookings || []);
      const vRes = await venueService.getMyVenues();
      setVenues(vRes.data.venues || []);
      const uRes = await userService.getMe();
      setProfileForm({
        name: uRes.data.name || '',
        email: uRes.data.email || '',
        phone: uRes.data.phone || '',
      });
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await bookingService.updateStatus(bookingId, status);
      toast.success(`Booking ${status} successfully!`);
      fetchOwnerData();
    } catch {
      toast.error('Failed to update booking status.');
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this space listing? This action is permanent.')) {
      return;
    }
    try {
      await venueService.delete(venueId);
      toast.success('Space deleted successfully!');
      fetchOwnerData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete space. Make sure it has no active bookings.');
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    if (!blockVenueId || !blockDate) return toast.error('Please choose venue and date');
    try {
      await venueService.addBlockedDate(blockVenueId, {
        blockedDate: blockDate,
        reason: blockReason,
      });
      toast.success('Date blocked successfully.');
      setBlockDate('');
      setBlockVenueId('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to block date');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
      });
      toast.success('Contact information updated successfully.');
      fetchOwnerData();
    } catch {
      toast.error('Failed to update profile settings.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill in all password fields');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    try {
      await userService.updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  // Reusable Password Strength Progress Bar logic
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200 w-0' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500 w-1/3' };
    if (score === 2 || score === 3) return { score, label: 'Medium', color: 'bg-amber-500 w-2/3' };
    return { score, label: 'Strong', color: 'bg-emerald-500 w-full' };
  };

  const strength = checkPasswordStrength(newPassword);

  if (loading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate earnings (Owner share: 85% of total paid bookings)
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed');
  const grossEarnings = confirmedBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
  const hostNetProfits = grossEarnings * 0.85;

  // Filter bookings for ongoing, upcoming, and past categories
  const todayStr = new Date().toISOString().split('T')[0];
  const ongoingBookings = bookings.filter(b => b.bookingDate === todayStr);
  const upcomingBookings = bookings.filter(b => b.bookingDate > todayStr);
  const pastBookings = bookings.filter(b => b.bookingDate < todayStr);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 flex">
      {/* Left Sidebar Layout */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden md:flex flex-col shrink-0 fixed bottom-0 top-20 left-0 z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <MdDashboard className="text-xl" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">Host Workspace</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Venue Owner</span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'overview' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdDashboard className="text-lg shrink-0" />
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('venues')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'venues' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdOutlineMapsHomeWork className="text-lg shrink-0" />
            My Venue Listings
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'scheduler' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdEventNote className="text-lg shrink-0" />
            Functions Scheduler
          </button>

          <button
            onClick={() => setActiveTab('profits')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'profits' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdOutlinePayments className="text-lg shrink-0" />
            Earnings & Profits
          </button>
        </nav>
      </aside>

      {/* Right Content Frame */}
      <main className="flex-grow md:ml-64 p-6 sm:p-10 overflow-x-hidden">
        
        {/* Tab 1: Overview Panel */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Host Workspace Overview</h1>
              <p className="text-slate-500 text-sm mt-0.5">Summary metrics and ongoing reservation details for your listings.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">
                  <MdAttachMoney />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">My Net Profit (85%)</span>
                  <span className="text-2xl font-black text-slate-900">₹{hostNetProfits.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-2xl">
                  <MdOutlineMapsHomeWork />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active listed Spaces</span>
                  <span className="text-2xl font-black text-slate-900">{venues.length} Spaces</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-2xl">
                  <MdEvent />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Requests</span>
                  <span className="text-2xl font-black text-slate-900">
                    {bookings.filter(b => b.bookingStatus === 'pending').length} bookings
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick pending approval bookings list */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Needs Your Attention</h3>
                {bookings.filter(b => b.bookingStatus === 'pending').length === 0 ? (
                  <div className="bg-white border border-slate-100 p-8 rounded-2xl text-center text-slate-400 text-xs italic">
                    🎉 Excellent! You have answered all pending booking queries.
                  </div>
                ) : (
                  bookings.filter(b => b.bookingStatus === 'pending').map((b) => (
                    <div key={b.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase">Pending</span>
                          <span className="text-xs text-slate-500 font-bold">{b.bookingCode}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{b.venue?.venueName}</h4>
                        <p className="text-xs text-slate-500">Guest: <span className="font-semibold text-slate-700">{b.user?.name}</span> ({b.guestCount} pax)</p>
                        <p className="text-xs text-slate-500">Date: <span className="font-semibold text-slate-700">{b.bookingDate}</span> ({b.startTime} - {b.endTime})</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                          className="flex-1 sm:flex-initial p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center text-lg shadow-sm"
                        >
                          <MdCheck />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                          className="flex-1 sm:flex-initial p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center justify-center text-lg shadow-sm"
                        >
                          <MdClose />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Schedule Blocker */}
              <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm h-fit">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MdBlock className="text-rose-500" /> Block Date
                </h3>
                <form onSubmit={handleBlockDate} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Venue</label>
                    <select
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                      value={blockVenueId}
                      onChange={e => setBlockVenueId(e.target.value)}
                    >
                      <option value="">Choose Listing</option>
                      {venues.map(v => (
                        <option key={v.id} value={v.id}>{v.venueName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Date</label>
                    <input
                      type="date"
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                      value={blockDate}
                      onChange={e => setBlockDate(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reason</label>
                    <input
                      type="text"
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
                      value={blockReason}
                      onChange={e => setBlockReason(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors text-xs"
                  >
                    Block Date
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Venues Grid */}
        {activeTab === 'venues' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">My listed Spaces</h2>
                <p className="text-slate-500 text-sm mt-0.5">Review, configure, or list new wedding halls, cafes, or meeting rooms.</p>
              </div>
              <button
                onClick={() => navigate('/owner/venues')}
                className="py-2.5 px-4 bg-primary hover:bg-primary-dark text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow"
              >
                <MdAdd className="text-sm" /> List New Venue
              </button>
            </div>

            {venues.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
                <span className="text-4xl mb-3 block">🏢</span>
                <h4 className="font-bold text-slate-950 text-sm mb-1">No listed properties found</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">Add your event space now and start capturing reservations!</p>
                <button
                  onClick={() => navigate('/owner/venues')}
                  className="py-2.5 px-4 bg-primary hover:bg-primary-dark text-white font-semibold text-xs rounded-xl shadow inline-flex items-center gap-1.5"
                >
                  <MdAdd className="text-sm" /> Create Venue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {venues.map((v) => (
                  <div key={v.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={v.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'}
                        alt={v.venueName}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 py-1 px-2.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-[9px] uppercase">
                        {v.status}
                      </span>
                    </div>
                    <div className="p-5 flex-grow">
                      <h4 className="font-black text-slate-900 text-lg leading-tight mb-1">{v.venueName}</h4>
                      <p className="text-xs text-slate-400 mb-3 truncate">📍 {v.address}</p>
                      
                      <div className="flex flex-wrap gap-2.5 mb-4">
                        {v.amenities?.slice(0, 3).map((am, i) => (
                          <span key={i} className="py-1 px-2 bg-slate-50 border border-slate-100 rounded-md text-[10px] text-slate-500 font-semibold">{am}</span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-50">
                        <span>Hourly: <span className="font-bold text-slate-900">₹{v.pricePerHour}</span></span>
                        <span>Seating: <span className="font-bold text-slate-900">{v.capacity} pax</span></span>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => navigate(`/venues/${v.id}`)}
                          className="flex-1 py-2 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200/60 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                          title="View live public page"
                        >
                          <span>👁️</span> View
                        </button>
                        <button
                          onClick={() => navigate(`/owner/venues/edit/${v.id}`)}
                          className="flex-1 py-2 px-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-lg transition-all text-center cursor-pointer shadow-sm flex items-center justify-center gap-1"
                          title="Edit space details"
                        >
                          <span>✏️</span> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVenue(v.id)}
                          className="flex-1 py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-lg border border-rose-200/50 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                          title="Delete space listing"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Functions Scheduler (Upcoming, Past, Ongoing) */}
        {activeTab === 'scheduler' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Functions Scheduler</h2>
              <p className="text-slate-500 text-sm mt-0.5">Track your past, present ongoing, or upcoming schedule calendars.</p>
            </div>

            {/* Custom Tab selectors inside the panel */}
            <div className="flex flex-col gap-4">
              {/* 3.1 Ongoing (Today's Event Runs) */}
              <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 text-primary">⚡ Today's Ongoing Events</h3>
                {ongoingBookings.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No events scheduled for today.</span>
                ) : (
                  <div className="flex flex-col gap-3">
                    {ongoingBookings.map(b => (
                      <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">{b.venue?.venueName}</span>
                          <span className="text-slate-500">Guest: {b.user?.name} ({b.startTime} - {b.endTime})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-wider">Live today</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3.2 Upcoming Scheduled Functions */}
              <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 text-emerald-600">📅 Upcoming Confirmed Events</h3>
                {upcomingBookings.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No future events scheduled.</span>
                ) : (
                  <div className="flex flex-col gap-3">
                    {upcomingBookings.map(b => (
                      <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">{b.venue?.venueName}</span>
                          <span className="text-slate-500">Guest: {b.user?.name} | Date: {b.bookingDate} ({b.startTime} - {b.endTime})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold uppercase">Confirmed</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3.3 Past / Completed events */}
              <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 text-slate-500">⏱️ Past / Completed Functions</h3>
                {pastBookings.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No historical functions registered.</span>
                ) : (
                  <div className="flex flex-col gap-3">
                    {pastBookings.map(b => (
                      <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs opacity-75">
                        <div>
                          <span className="font-bold text-slate-900 block">{b.venue?.venueName}</span>
                          <span className="text-slate-500">Guest: {b.user?.name} | Date: {b.bookingDate} ({b.startTime} - {b.endTime})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-bold uppercase">Archived</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Earnings & Profits breakdown */}
        {activeTab === 'profits' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Earnings & Settlements Ledger</h2>
              <p className="text-slate-500 text-sm mt-0.5">Platform settlements distributions showing your 85% profit shares.</p>
            </div>

            {/* Earnings grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between bg-emerald-50/20 border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">My Profit Cut (85%)</span>
                <span className="text-3xl font-black text-slate-900">₹{hostNetProfits.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                <span className="text-xs text-slate-500 mt-2">Paid out to your registered bank account</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Platform Commission Fee (15%)</span>
                <span className="text-3xl font-black text-slate-400">₹{(grossEarnings * 0.15).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                <span className="text-xs text-slate-400 mt-2">BMV intermediation fee deduction</span>
              </div>
            </div>

            {/* Profits logs */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Payment</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Commission Fee</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">My Profit (85%)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {confirmedBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                        Waiting for paid functions transactions.
                      </td>
                    </tr>
                  ) : (
                    confirmedBookings.map((b) => {
                      const total = Number(b.totalAmount);
                      return (
                        <tr key={b.id} className="hover:bg-slate-50/40">
                          <td className="px-6 py-4 text-xs font-semibold text-slate-900">
                            {b.venue?.venueName}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-900">
                            ₹{total.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            - ₹{(total * 0.15).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-xs text-emerald-600 font-extrabold">
                            ₹{(total * 0.85).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase">Disbursed</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Edit Profile / Contact Information */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-6 animate-fade-in max-w-xl">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Edit Contact Information</h2>
              <p className="text-slate-500 text-sm mt-0.5">Keep your active contact details up to date for guest communications.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email (Locked for authentication)</label>
                <input
                  type="email"
                  className="w-full py-2.5 px-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-sm focus:outline-none cursor-not-allowed"
                  value={profileForm.email}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone number</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-primary hover:bg-primary-dark font-bold text-white text-xs rounded-xl shadow-sm"
              >
                Save Contact Information
              </button>
            </form>
          </div>
        )}

        {/* Tab 6: Change Password & Security */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-6 animate-fade-in max-w-xl">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Change password settings</h2>
              <p className="text-slate-500 text-sm mt-0.5">Regularly modify your platform password to prevent unauthorized listings manipulations.</p>
            </div>

            <form onSubmit={handleChangePassword} className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                
                {/* Dynamic Password Strength Progress Bar */}
                {newPassword && (
                  <div className="mt-2.5 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                      <span>Password Strength:</span>
                      <span className={`${
                        strength.label === 'Strong' ? 'text-emerald-600' :
                        strength.label === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                      }`}>{strength.label}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div className={`h-full transition-all duration-300 ${strength.color}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-primary hover:bg-primary-dark font-bold text-white text-xs rounded-xl shadow-sm"
              >
                Change password
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
