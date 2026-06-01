import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bookingService, userService } from '../../services';
import { 
  MdCalendarToday, 
  MdOutlineAccessTime, 
  MdCurrencyRupee, 
  MdQrCode, 
  MdPerson, 
  MdVpnKey, 
  MdEventNote,
  MdTrendingUp
} from 'react-icons/md';
import toast from 'react-hot-toast';

const formatTime12Hour = (timeStr) => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  const minStr = m > 0 ? `:${String(m).padStart(2, '0')}` : ':00';
  return `${h}${minStr} ${ampm}`;
};

export default function BookingsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'bookings');

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Settings Form
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Password Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const bRes = await bookingService.getMyBookings();
      setBookings(bRes.data.bookings || []);
      const uRes = await userService.getMe();
      setProfileForm({
        name: uRes.data.name || '',
        email: uRes.data.email || '',
        phone: uRes.data.phone || '',
      });
    } catch {
      toast.error('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'completed': return 'bg-blue-50 text-blue-600 border border-blue-100';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.updateStatus(id, 'cancelled');
      toast.success('Booking cancelled successfully.');
      // Refresh
      const bRes = await bookingService.getMyBookings();
      setBookings(bRes.data.bookings || []);
    } catch {
      toast.error('Failed to cancel booking.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
      });
      toast.success('Contact info saved successfully.');
      fetchInitialData();
    } catch {
      toast.error('Failed to update contact information.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please enter all password fields');
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
      toast.error(err.response?.data?.message || 'Failed to update password');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate Guest Spending
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed');
  const totalSpent = confirmedBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header Title Grid */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Space Center</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your reservations and view spending metrics.</p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'bookings'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5"><MdEventNote /> My Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('spending')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'spending'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5"><MdTrendingUp /> Spending Insights</span>
          </button>


        </div>

        {/* Tab content 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {bookings.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                <span className="text-4xl mb-4 inline-block">📅</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Explore our premium venues and start booking slots for your meetings, parties, or weddings.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                    {(() => {
                      const todayStr = new Date().toLocaleDateString('en-CA');
                      const isPast = booking.bookingDate < todayStr;
                      const displayStatus = isPast && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'pending')
                        ? 'completed'
                        : booking.bookingStatus;

                      return (
                        <>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(displayStatus)}`}>
                                {displayStatus}
                              </span>
                              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                <MdQrCode /> {booking.bookingCode}
                              </span>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 mb-3">{booking.venue?.venueName}</h3>

                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1.5"><MdCalendarToday className="text-primary" /> {booking.bookingDate}</span>
                              <span className="flex items-center gap-1.5"><MdOutlineAccessTime className="text-secondary" /> {formatTime12Hour(booking.startTime)} - {formatTime12Hour(booking.endTime)}</span>
                              <span className="flex items-center gap-1.5"><MdCurrencyRupee className="text-emerald-600 font-bold text-sm" />{Number(booking.totalAmount).toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <div className="w-full md:w-auto flex flex-row md:flex-col gap-2 self-stretch justify-end">
                            {!isPast && (booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed') && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="px-5 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors w-full md:w-auto"
                              >
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Spending Insights */}
        {activeTab === 'spending' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between bg-primary/5">
              <span className="text-[10px] uppercase font-bold text-primary block mb-1">My Total Spending on Bookings</span>
              <span className="text-3xl font-black text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500 mt-2">Cumulative cost spent on host confirmations</span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Scheduled</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Slot</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cost Paid</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {confirmedBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                        No spent transactions registered yet.
                      </td>
                    </tr>
                  ) : (
                    confirmedBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 text-xs font-semibold text-slate-900">
                          {b.venue?.venueName}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {b.bookingDate}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                          {formatTime12Hour(b.startTime)} - {formatTime12Hour(b.endTime)}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-900 font-bold">
                          ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase">Paid</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
