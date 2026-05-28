import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { venueService, bookingService, reviewService } from '../../services';
import { MdStar, MdPeople, MdAttachMoney, MdLock, MdTimer, MdCalendarToday, MdOutlineAccessTime, MdSend } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function VenueDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking / Locking States
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [guestCount, setGuestCount] = useState(1);

  const [activeLock, setActiveLock] = useState(null);
  const [lockTimeLeft, setLockTimeLeft] = useState(0); // in seconds
  const [completingBooking, setCompletingBooking] = useState(false);
  const timerRef = useRef(null);

  // Review states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchVenueDetails();
    checkUserActiveLock();
    return () => clearInterval(timerRef.current);
  }, [id]);

  const fetchVenueDetails = async () => {
    try {
      const vRes = await venueService.getById(id);
      setVenue(vRes.data);
      const rRes = await reviewService.getByVenue(id);
      setReviews(rRes.data.reviews || []);
    } catch {
      toast.error('Failed to load venue details');
    } finally {
      setLoading(false);
    }
  };

  const checkUserActiveLock = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await bookingService.getActiveLock();
      if (res.data) {
        if (res.data.venueId === id) {
          startLockTimer(res.data);
        }
      }
    } catch {
      // ignore
    }
  };

  const startLockTimer = (lock) => {
    setActiveLock(lock);
    const expiresAt = new Date(lock.expiresAt).getTime();
    const calculateTimeLeft = () => {
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setLockTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(timerRef.current);
        setActiveLock(null);
        toast.error('Booking lock expired. The slot is now released.');
      }
    };
    calculateTimeLeft();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(calculateTimeLeft, 1000);
  };

  const handleAcquireLock = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book venues');
      return navigate('/login');
    }
    if (!bookingDate) return toast.error('Please choose a date first');
    if (!startTime || !endTime) return toast.error('Please choose time slots');

    try {
      const res = await bookingService.lockSlot({
        venueId: id,
        bookingDate,
        startTime,
        endTime,
      });
      startLockTimer(res.data);
      toast.success('Slot locked! Complete your booking details.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Slot is unavailable or already locked');
    }
  };

  const handleReleaseLock = async () => {
    if (!activeLock) return;
    try {
      await bookingService.releaseLock(activeLock.id);
      clearInterval(timerRef.current);
      setActiveLock(null);
      setLockTimeLeft(0);
      toast.success('Lock released.');
    } catch {
      toast.error('Failed to release lock.');
    }
  };

  const handleCompleteBooking = async (e) => {
    e.preventDefault();
    if (!activeLock) return;
    setCompletingBooking(true);
    try {
      await bookingService.create({
        venueId: id,
        bookingDate,
        startTime,
        endTime,
        guestCount,
        lockId: activeLock.id,
      });
      clearInterval(timerRef.current);
      setActiveLock(null);
      toast.success('Booking requested successfully!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally {
      setCompletingBooking(false);
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to leave reviews');
    setSubmittingReview(true);
    try {
      await reviewService.create(id, { rating: newRating, comment: newComment });
      setNewComment('');
      toast.success('Review published!');
      fetchVenueDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review. Requires a completed booking.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-bg-primary pt-28 text-center">
        <h2 className="text-xl font-bold text-white">Venue not found</h2>
      </div>
    );
  }

  const progressPercent = activeLock ? (lockTimeLeft / 300) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg-primary pt-28 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Banner Images */}
        <div className="h-80 w-full rounded-2xl overflow-hidden relative bg-zinc-900 shadow-lg mb-8">
          {venue.images?.[0] ? (
            <img src={venue.images[0]} alt={venue.venueName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-bg-card">🏢</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
          
          <div className="absolute bottom-6 left-6">
            <span className="px-2.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
              {venue.venueType?.replace('_', ' ')}
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{venue.venueName}</h1>
            <p className="text-zinc-300 text-xs mt-1">📍 {venue.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Highlights Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="matte-card p-5 text-center">
                <MdPeople className="text-xl text-primary mx-auto mb-1.5" />
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">Capacity</span>
                <span className="text-sm font-bold text-white">{venue.capacity} guests</span>
              </div>
              <div className="matte-card p-5 text-center">
                <MdAttachMoney className="text-xl text-primary mx-auto mb-1.5" />
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">Price</span>
                <span className="text-sm font-bold text-white">₹{venue.pricePerHour}/hr</span>
              </div>
              <div className="matte-card p-5 text-center">
                <MdStar className="text-xl text-yellow-500 mx-auto mb-1.5" />
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">Rating</span>
                <span className="text-sm font-bold text-white">⭐ {Number(venue.rating || 0).toFixed(1)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="matte-card p-6">
              <h2 className="text-base font-bold text-white mb-3">About the space</h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {venue.description || 'No description provided by the venue owner.'}
              </p>
            </div>

            {/* Amenities */}
            <div className="matte-card p-6">
              <h2 className="text-base font-bold text-white mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {venue.amenities && venue.amenities.length > 0 ? (
                  venue.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs text-zinc-300">
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-500 text-xs">Standard amenities setup</span>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="matte-card p-6">
              <h2 className="text-base font-bold text-white mb-4">Guest Reviews</h2>
              
              {/* Write Review Form */}
              {isAuthenticated && (
                <form onSubmit={handlePostReview} className="mb-6 p-4 rounded-lg bg-white/5 border border-white/8">
                  <h3 className="text-xs font-bold text-white mb-2">Leave a review</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Your Rating:</span>
                    <select
                      className="py-1 px-2 bg-bg-primary border border-white/8 rounded text-yellow-500 text-xs focus:outline-none"
                      value={newRating}
                      onChange={e => setNewRating(Number(e.target.value))}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                      <option value="4">⭐⭐⭐⭐ (4)</option>
                      <option value="3">⭐⭐⭐ (3)</option>
                      <option value="2">⭐⭐ (2)</option>
                      <option value="1">⭐ (1)</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 py-2 px-3 bg-white/5 border border-white/8 rounded-lg text-white text-xs placeholder-zinc-500 focus:outline-none"
                      placeholder="Share your experience booking this venue..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <button type="submit" className="p-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors" disabled={submittingReview}>
                      <MdSend />
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews list */}
              <div className="flex flex-col gap-4">
                {reviews.length === 0 ? (
                  <p className="text-zinc-500 text-xs">No reviews yet.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="pb-3 border-b border-white/8 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-white">{rev.user?.name}</span>
                        <span className="text-yellow-500 text-xs font-semibold flex items-center gap-0.5">
                          <MdStar /> {rev.rating}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Booking Widget column */}
          <div className="w-full">
            <div className="matte-card p-6 sticky top-28 shadow-lg">
              <h2 className="text-base font-bold text-white mb-4">Book this Venue</h2>

              {!activeLock ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Booking Date</label>
                    <div className="relative">
                      <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
                      <input
                        type="date"
                        className="w-full py-2.5 pl-9 pr-3 bg-white/5 border border-white/8 rounded-lg text-white text-xs focus:outline-none focus:border-primary"
                        value={bookingDate}
                        onChange={e => setBookingDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Start Time</label>
                      <div className="relative">
                        <MdOutlineAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
                        <input
                          type="time"
                          className="w-full py-2.5 pl-9 pr-2 bg-white/5 border border-white/8 rounded-lg text-white text-xs focus:outline-none focus:border-primary"
                          value={startTime}
                          onChange={e => setStartTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">End Time</label>
                      <div className="relative">
                        <MdOutlineAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
                        <input
                          type="time"
                          className="w-full py-2.5 pl-9 pr-2 bg-white/5 border border-white/8 rounded-lg text-white text-xs focus:outline-none focus:border-primary"
                          value={endTime}
                          onChange={e => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAcquireLock}
                    className="w-full py-3 mt-1 font-bold rounded-lg bg-primary hover:bg-primary-dark text-white text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MdLock /> Hold / Lock Slot
                  </button>
                  <p className="text-[9px] text-zinc-500 text-center leading-relaxed">
                    💡 Locks the slot for 5 minutes to prevent double-booking.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-primary-light">
                      <MdTimer className="text-base" />
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-zinc-400 leading-none">Lock Active</span>
                        <span className="text-xs font-bold mt-0.5">{Math.floor(lockTimeLeft / 60)}:{(lockTimeLeft % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                    <button onClick={handleReleaseLock} className="text-[10px] font-bold text-zinc-400 hover:text-red-400 transition-colors">
                      Release
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                  </div>

                  {/* Booking Completion Form */}
                  <form onSubmit={handleCompleteBooking} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Number of Guests</label>
                      <input
                        type="number"
                        className="w-full py-2.5 px-3 bg-white/5 border border-white/8 rounded-lg text-white text-xs focus:outline-none focus:border-primary"
                        min="1"
                        max={venue.capacity}
                        value={guestCount}
                        onChange={e => setGuestCount(Number(e.target.value))}
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-white/5 border border-white/8 flex flex-col gap-1 text-[10px] text-zinc-400">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="text-white font-semibold">{bookingDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="text-white font-semibold">{startTime} - {endTime}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors"
                      disabled={completingBooking}
                    >
                      {completingBooking ? 'Confirming...' : 'Confirm & Complete Booking'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
