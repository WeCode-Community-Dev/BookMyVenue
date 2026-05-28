import { useState, useEffect } from 'react';
import { bookingService, venueService } from '../../services';
import { MdTrendingUp, MdEvent, MdAttachMoney, MdCheck, MdClose, MdBlock } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date block modal state
  const [blockVenueId, setBlockVenueId] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('Maintenance');

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const bRes = await bookingService.getOwnerBookings();
      setBookings(bRes.data.bookings || []);
      const vRes = await venueService.getMyVenues();
      setVenues(vRes.data.venues || []);
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

  const handleBlockDate = async (e) => {
    e.preventDefault();
    if (!blockVenueId || !blockDate) return toast.error('Please choose venue and date');
    try {
      await venueService.addBlockedDate(blockVenueId, {
        blockedDate: blockDate,
        reason: blockReason,
      });
      toast.success('Date blocked successfully. Bookings on this date are now blocked.');
      setBlockDate('');
      setBlockVenueId('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to block date');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <span className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate earnings
  const totalEarnings = bookings
    .filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed')
    .reduce((sum, b) => sum + Number(b.totalAmount), 0);

  const pendingBookings = bookings.filter(b => b.bookingStatus === 'pending');

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight">Owner Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage listings, request approvals, and block schedules</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass p-6 rounded-2xl border border-white/8 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-2xl">
              <MdAttachMoney />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Revenue</span>
              <span className="text-2xl font-black text-white">₹{totalEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl border border-white/8 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary-light text-2xl">
              <MdTrendingUp />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Venues</span>
              <span className="text-2xl font-black text-white">{venues.length} spaces</span>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl border border-white/8 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 text-2xl">
              <MdEvent />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Pending Approvals</span>
              <span className="text-2xl font-black text-white">{pendingBookings.length} bookings</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Booking approvals list */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white mb-2">Recent Booking Requests</h2>
            {bookings.length === 0 ? (
              <p className="text-slate-500 text-sm">No bookings requested yet.</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="glass bg-bg-card/20 border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.bookingStatus === 'confirmed' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{booking.bookingCode}</span>
                    </div>
                    <h3 className="font-extrabold text-white text-base leading-tight mb-2">{booking.venue?.venueName}</h3>
                    <p className="text-xs text-slate-400">
                      Guest: <span className="text-white font-medium">{booking.user?.name}</span> ({booking.guestCount} people)
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Schedule: <span className="text-white font-medium">{booking.bookingDate}</span> ({booking.startTime} - {booking.endTime})
                    </p>
                    <p className="text-xs font-bold text-green-400 mt-2">
                      Amount: ₹{Number(booking.totalAmount).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {booking.bookingStatus === 'pending' && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        className="flex-1 sm:flex-initial p-2.5 rounded-xl bg-success text-white hover:brightness-110 active:scale-95 transition-transform flex items-center justify-center text-lg"
                        title="Approve Booking"
                      >
                        <MdCheck />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        className="flex-1 sm:flex-initial p-2.5 rounded-xl bg-error text-white hover:brightness-110 active:scale-95 transition-transform flex items-center justify-center text-lg"
                        title="Reject Booking"
                      >
                        <MdClose />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick Schedule Blocker tool */}
          <div>
            <div className="glass p-6 rounded-3xl border border-white/8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MdBlock className="text-error" /> Block Venue Dates
              </h2>
              
              <form onSubmit={handleBlockDate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Venue</label>
                  <select
                    className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                    value={blockVenueId}
                    onChange={e => setBlockVenueId(e.target.value)}
                  >
                    <option value="" className="bg-bg-card">Choose Venue</option>
                    {venues.map(v => (
                      <option key={v.id} value={v.id} className="bg-bg-card">{v.venueName}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Date</label>
                  <input
                    type="date"
                    className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                    value={blockDate}
                    onChange={e => setBlockDate(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</label>
                  <input
                    type="text"
                    className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Maintenance, Private event..."
                    value={blockReason}
                    onChange={e => setBlockReason(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 font-bold rounded-xl bg-error hover:brightness-110 active:scale-[0.98] text-white shadow-lg transition-transform"
                >
                  Block Selected Date
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
