import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { venueService, bookingService, reviewService } from '../../services';
import { MdStar, MdPeople, MdAttachMoney, MdLock, MdTimer, MdCalendarToday, MdOutlineAccessTime, MdSend, MdLocationOn } from 'react-icons/md';
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

  // Map and Leaflet integration states
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Review states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchVenueDetails();
    checkUserActiveLock();
    return () => {
      clearInterval(timerRef.current);
    };
  }, [id]);

  // Load Leaflet CDN dynamically on mount
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  // Initialize or update leaflet map once details & leaflet are ready
  useEffect(() => {
    if (loading || !leafletLoaded || !venue || !window.L) return;

    const container = document.getElementById('venue-detail-map');
    if (!container) return;

    const lat = Number(venue.latitude) || 13.0827;
    const lng = Number(venue.longitude) || 80.2707;

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 14);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = window.L.marker([lat, lng]).addTo(mapRef.current);
      }
      return;
    }

    // Initialize Map
    mapRef.current = window.L.map('venue-detail-map').setView([lat, lng], 14);
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    markerRef.current = window.L.marker([lat, lng]).addTo(mapRef.current)
      .bindPopup(`<b className="text-slate-900">${venue.venueName}</b><br/><span className="text-xs text-slate-500">${venue.address}</span>`)
      .openPopup();

  }, [loading, leafletLoaded, venue]);

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
        <h2 className="text-xl font-bold text-slate-900">Venue not found</h2>
      </div>
    );
  }

  const progressPercent = activeLock ? (lockTimeLeft / 300) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg-primary pt-28 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Banner Images */}
        <div className="h-80 w-full rounded-2xl overflow-hidden relative bg-slate-200 shadow-lg mb-8">
          {venue.images?.[0] ? (
            <img src={venue.images[0]} alt={venue.venueName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-slate-100">🏢</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-6 left-6 z-10">
            <span className="px-2.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-sm">
              {venue.venueType?.replace('_', ' ')}
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">{venue.venueName}</h1>
            <p className="text-slate-200 text-xs mt-1">📍 {venue.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Highlights Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="matte-card p-5 text-center bg-white border border-slate-200">
                <MdPeople className="text-xl text-primary mx-auto mb-1.5" />
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Capacity</span>
                <span className="text-sm font-bold text-slate-900">{venue.capacity} guests</span>
              </div>
              <div className="matte-card p-5 text-center bg-white border border-slate-200">
                <MdAttachMoney className="text-xl text-primary mx-auto mb-1.5" />
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Price</span>
                <span className="text-sm font-bold text-slate-900">₹{venue.pricePerHour}/hr</span>
              </div>
              <div className="matte-card p-5 text-center bg-white border border-slate-200">
                <MdStar className="text-xl text-yellow-500 mx-auto mb-1.5" />
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Rating</span>
                <span className="text-sm font-bold text-slate-900">⭐ {Number(venue.rating || 0).toFixed(1)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="matte-card p-6 bg-white border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 mb-3">About the space</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {venue.description || 'No description provided by the venue owner.'}
              </p>
            </div>

            {/* Amenities */}
            <div className="matte-card p-6 bg-white border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {venue.amenities && venue.amenities.length > 0 ? (
                  venue.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs">Standard amenities setup</span>
                )}
              </div>
            </div>

            {/* Weekly Operational Hours */}
            <div className="matte-card p-6 bg-white border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 mb-3">Operating Hours & Schedule</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                {venue.workingDays && venue.workingDays.length > 0 ? (
                  venue.workingDays.map((dayData, idx) => {
                    if (!dayData) return null;
                    const isObj = typeof dayData === 'object' && dayData !== null;
                    const dayName = isObj ? dayData.day : dayData;
                    const capDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                    const scheduleHours = isObj ? `${dayData.start} - ${dayData.end}` : '09:00 - 22:00';
                    return (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                        <span className="text-xs font-bold text-slate-800">{capDay}</span>
                        <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">{scheduleHours}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">Everyday (09:00 - 22:00)</p>
                )}
              </div>
            </div>

            {/* Google Map / Leaflet Live Map Integration */}
            <div className="matte-card p-6 bg-white border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <MdLocationOn className="text-primary text-xl" /> Google Map Location
              </h2>
              <p className="text-xs text-slate-500 mb-4">View physical boundaries, routes, and entrance location coordinates below.</p>
              
              <div id="venue-detail-map" className="w-full h-72 rounded-2xl border border-slate-200 z-10" />
            </div>

            {/* Reviews Section */}
            <div className="matte-card p-6 bg-white border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 mb-4">Guest Reviews</h2>
              
              {/* Write Review Form */}
              {isAuthenticated && (
                <form onSubmit={handlePostReview} className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-900">Leave a review</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Your Rating:</span>
                    <select
                      className="py-1 px-2 bg-white border border-slate-200 rounded text-yellow-500 text-xs focus:outline-none"
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
                      className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-primary"
                      placeholder="Share your experience booking this venue..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <button type="submit" className="p-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors cursor-pointer">
                      <MdSend />
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews list */}
              <div className="flex flex-col gap-4">
                {reviews.length === 0 ? (
                  <p className="text-slate-500 text-xs">No reviews yet.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-900">{rev.user?.name}</span>
                        <span className="text-yellow-500 text-xs font-semibold flex items-center gap-0.5">
                          <MdStar /> {rev.rating}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Booking Widget column */}
          <div className="w-full">
            <div className="matte-card p-6 sticky top-28 shadow-lg bg-white border border-slate-200">
              <h2 className="text-base font-bold text-slate-900 mb-4">Book this Venue</h2>

              {!activeLock ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Booking Date</label>
                    <div className="relative">
                      <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="date"
                        className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                        value={bookingDate}
                        onChange={e => setBookingDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                      <div className="relative">
                        <MdOutlineAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="time"
                          className="w-full py-2.5 pl-9 pr-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                          value={startTime}
                          onChange={e => setStartTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                      <div className="relative">
                        <MdOutlineAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="time"
                          className="w-full py-2.5 pl-9 pr-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                          value={endTime}
                          onChange={e => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAcquireLock}
                    className="w-full py-3 mt-1 font-bold rounded-xl bg-primary hover:bg-primary-dark text-white text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10 cursor-pointer"
                  >
                    <MdLock /> Hold / Lock Slot
                  </button>
                  <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                    💡 Locks the slot for 5 minutes to prevent double-booking.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-primary">
                      <MdTimer className="text-base" />
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-slate-500 leading-none">Lock Active</span>
                        <span className="text-xs font-bold mt-0.5">{Math.floor(lockTimeLeft / 60)}:{(lockTimeLeft % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                    <button onClick={handleReleaseLock} className="text-[10px] font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer">
                      Release
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                  </div>

                  {/* Booking Completion Form */}
                  <form onSubmit={handleCompleteBooking} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Number of Guests</label>
                      <input
                        type="number"
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                        min="1"
                        max={venue.capacity}
                        value={guestCount}
                        onChange={e => setGuestCount(Number(e.target.value))}
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1 text-[10px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="text-slate-950 font-bold">{bookingDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="text-slate-950 font-bold">{startTime} - {endTime}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-emerald-600/10"
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
