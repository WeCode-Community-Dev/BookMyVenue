import { useState, useEffect } from 'react';
import { bookingService } from '../../services';
import { MdCalendarToday, MdOutlineAccessTime, MdAttachMoney, MdQrCode, MdSentimentSatisfied } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data.bookings || []);
    } catch {
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success/15 text-success border border-success/20';
      case 'pending': return 'bg-warning/15 text-warning border border-warning/20';
      case 'cancelled': return 'bg-error/15 text-error border border-error/20';
      case 'completed': return 'bg-info/15 text-info border border-info/20';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.updateStatus(id, 'cancelled');
      toast.success('Booking cancelled successfully.');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <span className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">My Bookings</h1>
        <p className="text-slate-400 text-sm mb-8">View and manage your venue bookings and requests</p>

        {bookings.length === 0 ? (
          <div className="glass p-12 rounded-2xl border border-white/8 text-center">
            <span className="text-4xl mb-4 inline-block">📅</span>
            <h3 className="text-lg font-bold text-white mb-2">No bookings found</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">Explore our premium venues and start booking slots for your meetings, parties, or weddings.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass bg-bg-card/30 border border-white/8 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusClass(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <MdQrCode /> {booking.bookingCode}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{booking.venue?.venueName}</h3>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5"><MdCalendarToday className="text-primary-light" /> {booking.bookingDate}</span>
                    <span className="flex items-center gap-1.5"><MdOutlineAccessTime className="text-secondary" /> {booking.startTime} - {booking.endTime}</span>
                    <span className="flex items-center gap-1.5"><MdAttachMoney className="text-green-400" /> ₹{Number(booking.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-row md:flex-col gap-2 self-stretch justify-end">
                  {booking.bookingStatus === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-5 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 text-xs font-semibold transition-all w-full md:w-auto"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
