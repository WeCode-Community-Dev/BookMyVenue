import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { venueService, bookingService, reviewService } from '../../services';
import { detailUrl, thumbnailUrl } from '../../utils/cloudinaryUrl';
import { MdStar, MdPeople, MdCurrencyRupee, MdLock, MdTimer, MdCalendarToday, MdOutlineAccessTime, MdSend, MdLocationOn, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import toast from 'react-hot-toast';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function VenueDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockedDates, setBlockedDates] = useState([]);
  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    const lat = localStorage.getItem('user_latitude');
    const lng = localStorage.getItem('user_longitude');
    const name = localStorage.getItem('user_location_name');
    if (lat && lng) {
      setUserLoc({ lat: parseFloat(lat), lng: parseFloat(lng), name });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const uLat = pos.coords.latitude;
          const uLng = pos.coords.longitude;
          setUserLoc({ lat: uLat, lng: uLng, name: 'My Location' });
          localStorage.setItem('user_latitude', uLat);
          localStorage.setItem('user_longitude', uLng);
          localStorage.setItem('user_location_name', 'My Location');
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  // Booking / Locking States
  const [bookingDate, setBookingDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [guestCount, setGuestCount] = useState(1);
  const [purpose, setPurpose] = useState('');

  const [activeLock, setActiveLock] = useState(null);
  const activeLockRef = useRef(null);
  const updateActiveLock = (lock) => {
    setActiveLock(lock);
    activeLockRef.current = lock;
  };
  const [lockTimeLeft, setLockTimeLeft] = useState(0); // in seconds
  const [completingBooking, setCompletingBooking] = useState(false);
  const timerRef = useRef(null);

  // Custom Interactive Calendar dropdown states & refs
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [endCurrentMonth, setEndCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);
  const endCalendarRef = useRef(null);

  // Click outside custom calendar listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target)) {
        setEndCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Map and Leaflet integration states
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Review states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [submittingReplyMap, setSubmittingReplyMap] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchVenueDetails();
    checkUserActiveLock();

    const handleBeforeUnload = () => {
      if (activeLockRef.current) {
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/bookings/lock/${activeLockRef.current.id}`;
        const token = localStorage.getItem('bmv_access_token') || localStorage.getItem('bmv_token');
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
          keepalive: true
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (activeLockRef.current) {
        bookingService.releaseLock(activeLockRef.current.id).catch(() => {});
      }
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
      const bDatesRes = await venueService.getBlockedDates(id);
      setBlockedDates(bDatesRes.data || []);
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
    updateActiveLock(lock);
    const expiresAt = new Date(lock.expiresAt).getTime();
    const initialDiff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    
    clearInterval(timerRef.current);
    
    if (initialDiff <= 0) {
      updateActiveLock(null);
      setLockTimeLeft(0);
      return;
    }
    
    setLockTimeLeft(initialDiff);
    
    const calculateTimeLeft = () => {
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setLockTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(timerRef.current);
        updateActiveLock(null);
        toast.error('Booking lock expired. The slot is now released.');
      }
    };
    
    timerRef.current = setInterval(calculateTimeLeft, 1000);
  };

  const isDateFullyBooked = (dayDate) => {
    if (!venue || !venue.bookings || venue.bookings.length === 0) return false;
    const year = dayDate.getFullYear();
    const month = String(dayDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Get all confirmed bookings on this date
    const dateBookings = venue.bookings.filter(
      b => b.bookingDate === dateStr && b.bookingStatus === 'confirmed'
    );

    if (dateBookings.length === 0) return false;

    const openingStr = venue.openingTime || '09:00';
    const closingStr = venue.closingTime || '22:00';

    const parseTimeToDecimal = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h + (m || 0) / 60;
    };

    const opening = parseTimeToDecimal(openingStr);
    const closing = parseTimeToDecimal(closingStr);
    const totalOperatingHours = closing - opening;

    let bookedHours = 0;
    dateBookings.forEach(b => {
      const bStart = parseTimeToDecimal(b.startTime);
      const bEnd = parseTimeToDecimal(b.endTime);
      bookedHours += (bEnd - bStart);
    });

    return bookedHours >= (totalOperatingHours - 0.5);
  };

  const isDateOperational = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < today) return false;
    if (isDateFullyBooked(checkDate)) return false;

    // Check if date is blocked
    const yearStr = checkDate.getFullYear();
    const monthStr = String(checkDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(checkDate.getDate()).padStart(2, '0');
    const checkDateStr = `${yearStr}-${monthStr}-${dayStr}`;

    const isBlocked = blockedDates.some(bd => bd.blockedDate === checkDateStr);
    if (isBlocked) return false;

    const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return venue?.workingDays?.some(d => {
      if (typeof d === 'string') return d.toLowerCase() === dayName;
      if (typeof d === 'object' && d !== null) return d.day?.toLowerCase() === dayName;
      return false;
    });
  };

  const generateTimeOptions = (minTimeStr, maxTimeStr) => {
    if (!minTimeStr || !maxTimeStr) return [];
    const minH = parseInt(minTimeStr.split(':')[0], 10);
    const maxH = parseInt(maxTimeStr.split(':')[0], 10);
    const options = [];
    for (let h = minH; h <= maxH; h++) {
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const valueStr = `${String(h).padStart(2, '0')}:00`;
      options.push({
        value: valueStr,
        label: `${displayH}:00 ${ampm}`
      });
    }
    return options;
  };

  const getDaysInMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday...
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Pad previous month's days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatSelectedDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getNextDayStr = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleDateChange = (val) => {
    if (!val) {
      setBookingDate('');
      return;
    }

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (val < todayStr) {
      toast.error('Cannot book a date in the past');
      setBookingDate('');
      return;
    }

    // Determine day of the week
    const dateObj = new Date(val);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Check if venue is open on this day (only check start date)
    const isWorkingDay = venue?.workingDays?.some(d => {
      if (typeof d === 'string') return d.toLowerCase() === dayName;
      if (typeof d === 'object' && d !== null) return d.day?.toLowerCase() === dayName;
      return false;
    });

    if (!isWorkingDay) {
      const openDaysList = venue?.workingDays?.map(d => {
        const name = typeof d === 'string' ? d : d?.day;
        return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
      }).filter(Boolean).join(', ');

      toast.error(`This venue is closed on ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}s. Operational days: ${openDaysList || 'None'}`);
      setBookingDate('');
      return;
    }

    setBookingDate(val);
    if (!endDate || endDate < val) {
      setEndDate(val);
    }

    // Pre-populate time inputs based on venue operating hours for this specific day
    const dayConfig = venue?.workingDays?.find(d => {
      if (typeof d === 'string') return d.toLowerCase() === dayName;
      if (typeof d === 'object' && d !== null) return d.day?.toLowerCase() === dayName;
      return false;
    });

    if (typeof dayConfig === 'object' && dayConfig !== null && dayConfig.start && dayConfig.end) {
      setStartTime(dayConfig.start);
      setEndTime(dayConfig.end);
    } else {
      setStartTime('09:00');
      setEndTime('22:00');
    }
  };

  const handleEndDateChange = (val) => {
    if (!val) {
      setEndDate('');
      return;
    }

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (val < todayStr) {
      toast.error('Cannot book a date in the past');
      setEndDate('');
      return;
    }

    if (bookingDate && val < bookingDate) {
      toast.error('End date cannot be before start date');
      setEndDate('');
      return;
    }

    setEndDate(val);
  };

  const handleAcquireLock = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book venues');
      return navigate('/login');
    }
    if (!bookingDate) return toast.error('Please choose a date first');

    let finalEndDate = bookingDate;
    let finalStartTime = startTime;
    let finalEndTime = endTime;

    if (venue?.pricingUnit === 'day') {
      if (!endDate) return toast.error('Please choose an end date first');
      if (endDate < bookingDate) {
        return toast.error('End date cannot be before start date');
      }
      finalEndDate = endDate;
      finalStartTime = venue.openingTime || '00:00';
      finalEndTime = venue.closingTime || '23:59';
    } else {
      if (!startTime || !endTime) return toast.error('Please choose time slots');
      if (endTime < startTime) {
        // Overnight booking: end date is next day
        finalEndDate = getNextDayStr(bookingDate);
      }
    }

    // Validate that the slot is not in the past
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (bookingDate < todayStr) {
      return toast.error('Cannot book a slot in the past');
    }

    if (bookingDate === todayStr && venue?.pricingUnit !== 'day') {
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      if (startTime < currentTimeStr) {
        return toast.error('Cannot book a slot in the past');
      }
    }

    // Verify date is not blocked
    const isBlocked = blockedDates.some(bd => bd.blockedDate === bookingDate);
    if (isBlocked) {
      return toast.error('This date is temporarily blocked by the venue owner.');
    }

    // Verify end date is not blocked (if multi-day)
    if (finalEndDate !== bookingDate) {
      const isEndBlocked = blockedDates.some(bd => bd.blockedDate === finalEndDate);
      if (isEndBlocked) {
        return toast.error('The end date is temporarily blocked by the venue owner.');
      }
    }

    // Retrieve allowed timings for the selected date (only for single-day hourly bookings)
    const isSingleDay = finalEndDate === bookingDate;
    if (isSingleDay && venue?.pricingUnit !== 'day') {
      const dateObj = new Date(bookingDate);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      const dayConfig = venue?.workingDays?.find(d => {
        if (typeof d === 'string') return d.toLowerCase() === dayName;
        if (typeof d === 'object' && d !== null) return d.day?.toLowerCase() === dayName;
        return false;
      });

      let allowedStart = '09:00';
      let allowedEnd = '22:00';

      if (dayConfig && typeof dayConfig === 'object' && dayConfig !== null) {
        allowedStart = dayConfig.start || allowedStart;
        allowedEnd = dayConfig.end || allowedEnd;
      } else {
        allowedStart = venue?.openingTime || allowedStart;
        allowedEnd = venue?.closingTime || allowedEnd;
      }

      if (startTime < allowedStart || endTime > allowedEnd) {
        const formatTime12 = (timeStr) => {
          if (!timeStr) return '';
          const [hStr, mStr] = timeStr.split(':');
          const h = parseInt(hStr, 10);
          const ampm = h >= 12 ? 'pm' : 'am';
          const displayH = h % 12 === 0 ? 12 : h % 12;
          return `${displayH}:${mStr} ${ampm}`;
        };

        return toast.error(
          `Selected timings must be within operational hours: ${formatTime12(allowedStart)} to ${formatTime12(allowedEnd)}`
        );
      }
    }

    try {
      const res = await bookingService.lockSlot({
        venueId: id,
        bookingDate,
        endDate: finalEndDate,
        startTime: finalStartTime,
        endTime: finalEndTime,
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
      updateActiveLock(null);
      setLockTimeLeft(0);
      toast.success('Lock released.');
    } catch {
      toast.error('Failed to release lock.');
    }
  };

  const handleCompleteBooking = async (e) => {
    e.preventDefault();
    if (!activeLock) return;
    if (!purpose.trim()) {
      return toast.error('Please enter the purpose of this booking');
    }
    setCompletingBooking(true);
    try {
      await bookingService.create({
        venueId: id,
        bookingDate: activeLock.bookingDate,
        endDate: activeLock.endDate || activeLock.bookingDate,
        startTime: activeLock.startTime,
        endTime: activeLock.endTime,
        guestCount,
        lockId: activeLock.id,
        purpose: purpose.trim(),
      });
      clearInterval(timerRef.current);
      updateActiveLock(null);
      setPurpose('');
      toast.success('Booking confirmed successfully!');
      navigate('/bookings?tab=bookings');
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

  const handlePostReply = async (reviewId) => {
    const text = replyTextMap[reviewId] || '';
    if (!text.trim()) {
      return toast.error('Reply content cannot be empty');
    }
    try {
      setSubmittingReplyMap(prev => ({ ...prev, [reviewId]: true }));
      await reviewService.reply(id, reviewId, text);
      toast.success('Reply submitted successfully');
      fetchVenueDetails();
      setReplyTextMap(prev => ({ ...prev, [reviewId]: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reply');
    } finally {
      setSubmittingReplyMap(prev => ({ ...prev, [reviewId]: false }));
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

  const getActiveDayTimings = () => {
    if (!bookingDate) return { min: '00:00', max: '23:59' };
    const dateObj = new Date(bookingDate);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const dayConfig = venue?.workingDays?.find(d => {
      if (typeof d === 'string') return d.toLowerCase() === dayName;
      if (typeof d === 'object' && d !== null) return d.day?.toLowerCase() === dayName;
      return false;
    });

    let min = '09:00';
    let max = '22:00';

    if (dayConfig && typeof dayConfig === 'object' && dayConfig !== null) {
      min = dayConfig.start || min;
      max = dayConfig.end || max;
    } else {
      min = venue?.openingTime || min;
      max = venue?.closingTime || max;
    }

    return { min, max };
  };

  const { min: allowedMinTime, max: allowedMaxTime } = getActiveDayTimings();

  // Calculate dynamic hour estimation and total price
  let estimatedHours = 0;
  let estimatedPrice = 0;
  let calculatedDays = 1;

  if (venue?.pricingUnit === 'day') {
    if (bookingDate && endDate) {
      const startMs = new Date(`${bookingDate}T00:00:00`).getTime();
      const endMs = new Date(`${endDate}T00:00:00`).getTime();
      if (endMs >= startMs) {
        calculatedDays = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
        estimatedPrice = calculatedDays * Number(venue?.pricePerDay || 0);
      }
    } else if (bookingDate) {
      estimatedPrice = Number(venue?.pricePerDay || 0);
    }
  } else {
    // Hourly
    if (bookingDate && startTime && endTime) {
      const finalEndDate = endTime < startTime ? getNextDayStr(bookingDate) : bookingDate;
      const startMs = new Date(`${bookingDate}T${startTime}`).getTime();
      const endMs = new Date(`${finalEndDate}T${endTime}`).getTime();
      if (endMs > startMs) {
        estimatedHours = (endMs - startMs) / (1000 * 60 * 60);
        estimatedPrice = estimatedHours * Number(venue?.pricePerHour || 0);
      }
    }
  }

  const progressPercent = activeLock ? (lockTimeLeft / 300) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg-primary pt-28 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Banner Images Slideshow Gallery */}
        <div className="h-96 w-full rounded-2xl overflow-hidden relative bg-slate-200 shadow-lg mb-8 group select-none">
          {venue.images && venue.images.length > 0 ? (
            <img 
              src={detailUrl(venue.images[activeImageIndex])} 
              alt={`${venue.venueName} ${activeImageIndex + 1}`} 
              className="w-full h-full object-cover transition-all duration-500 ease-in-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-slate-100">🏢</div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20 opacity-90" />
          
          {/* Navigation Arrows for Slideshow */}
          {venue.images && venue.images.length > 1 && (
            <>
              <button 
                type="button"
                onClick={() => setActiveImageIndex(prev => (prev === 0 ? venue.images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20 cursor-pointer shadow-md backdrop-blur-sm border border-white/10"
              >
                <MdChevronLeft className="text-2xl" />
              </button>
              <button 
                type="button"
                onClick={() => setActiveImageIndex(prev => (prev === venue.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20 cursor-pointer shadow-md backdrop-blur-sm border border-white/10"
              >
                <MdChevronRight className="text-2xl" />
              </button>
              
              {/* Pagination Count Badge */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 text-xs font-bold rounded-lg backdrop-blur-md shadow-md z-20 border border-white/10">
                {activeImageIndex + 1} / {venue.images.length}
              </div>
            </>
          )}
          
          <div className="absolute bottom-6 left-6 z-10">
            <span className="px-2.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-sm">
              {venue.venueType?.replace('_', ' ')}
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">{venue.venueName}</h1>
            <p className="text-slate-200 text-xs mt-1 flex flex-wrap items-center gap-1.5">
              <span>📍 {venue.address}</span>
              {userLoc && venue.latitude && venue.longitude && (
                <span className="bg-primary/30 text-white border border-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm">
                  📍 {calculateDistance(userLoc.lat, userLoc.lng, Number(venue.latitude), Number(venue.longitude)).toFixed(1)} km away from {userLoc.name}
                </span>
              )}
            </p>
          </div>

          {/* Mini Thumbnail Row floating on the bottom right */}
          {venue.images && venue.images.length > 1 && (
            <div className="absolute bottom-6 right-6 z-20 flex gap-2 p-1.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 max-w-[80%] overflow-x-auto">
              {venue.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-11 w-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                    idx === activeImageIndex ? 'border-primary scale-105 shadow-md' : 'border-transparent hover:border-white/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={thumbnailUrl(img)} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
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
                <MdCurrencyRupee className="text-xl text-primary mx-auto mb-1.5" />
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Price</span>
                <span className="text-sm font-bold text-slate-900">
                  {venue.pricingUnit === 'day' ? `₹${Number(venue.pricePerDay).toLocaleString('en-IN')}/day` : `₹${Number(venue.pricePerHour).toLocaleString('en-IN')}/hr`}
                </span>
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
              
              {/* Write Review Form (Hidden for the Venue Owner) */}
              {isAuthenticated && venue && venue.ownerId !== user?.id && (
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
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="flex-1 min-w-0 py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-primary"
                      placeholder="Share your experience booking this venue..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <MdSend className="text-sm" />
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
                    <div key={rev.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0 flex flex-col gap-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.user?.name}</span>
                        <span className="text-yellow-500 text-xs font-semibold flex items-center gap-0.5">
                          <MdStar /> {rev.rating}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{rev.comment}</p>

                      {/* Display Existing Host Response */}
                      {rev.reply && (
                        <div className="mt-2 ml-4 p-3 bg-slate-50 border-l-2 border-primary rounded-r-xl flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Host Response</span>
                            {rev.replyCreatedAt && (
                              <span className="text-[9px] text-slate-400">
                                {new Date(rev.replyCreatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 text-xs leading-relaxed italic">"{rev.reply}"</p>
                        </div>
                      )}

                      {/* Write Host Response Form (Only for Venue Owner if no reply exists yet) */}
                      {!rev.reply && isAuthenticated && user && venue && venue.ownerId === user.id && (
                        <div className="mt-2 ml-4 flex gap-2">
                          <input
                            type="text"
                            className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary"
                            placeholder="Write a response as the venue owner..."
                            value={replyTextMap[rev.id] || ''}
                            onChange={e => setReplyTextMap(prev => ({ ...prev, [rev.id]: e.target.value }))}
                          />
                          <button
                            type="button"
                            onClick={() => handlePostReply(rev.id)}
                            disabled={submittingReplyMap[rev.id]}
                            className="py-1.5 px-3 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      )}
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
                  
                  {venue?.pricingUnit === 'day' ? (
                    <div className="flex flex-col gap-3">
                      {/* Daily pricing: Start and End Dates */}
                      <div className="flex flex-col gap-1 relative" ref={calendarRef}>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                        <div 
                          className="relative cursor-pointer select-none"
                          onClick={() => setCalendarOpen(!calendarOpen)}
                        >
                          <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                          <div className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all duration-200 min-h-[38px] flex items-center">
                            {bookingDate ? formatSelectedDate(bookingDate) : <span className="text-slate-400">Choose start date...</span>}
                          </div>
                        </div>

                        {/* Start Date Custom Calendar */}
                        {calendarOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 select-none animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex justify-between items-center mb-3">
                              <button
                                type="button"
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 font-bold transition-colors cursor-pointer text-xs"
                                onClick={() => {
                                  const prev = new Date(currentMonth);
                                  prev.setMonth(prev.getMonth() - 1);
                                  setCurrentMonth(prev);
                                }}
                              >
                                ←
                              </button>
                              <span className="text-xs font-bold text-slate-800">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <button
                                type="button"
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 font-bold transition-colors cursor-pointer text-xs"
                                onClick={() => {
                                  const next = new Date(currentMonth);
                                  next.setMonth(next.getMonth() + 1);
                                  setCurrentMonth(next);
                                }}
                              >
                                →
                              </button>
                            </div>

                            <div className="grid grid-cols-7 text-center gap-1.5 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-slate-400">{d}</span>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center">
                              {getDaysInMonth(currentMonth).map((dayDate, idx) => {
                                if (!dayDate) return <div key={idx} />;

                                const isOperational = isDateOperational(dayDate);
                                const yearStr = dayDate.getFullYear();
                                const monthStr = String(dayDate.getMonth() + 1).padStart(2, '0');
                                const dayStrNum = String(dayDate.getDate()).padStart(2, '0');
                                const dateStr = `${yearStr}-${monthStr}-${dayStrNum}`;
                                const isSelected = bookingDate === dateStr;

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={!isOperational}
                                    className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'bg-primary text-white font-bold shadow-md shadow-primary/20 scale-105' 
                                        : isOperational
                                          ? 'hover:bg-slate-100 text-slate-800 hover:scale-105'
                                          : 'opacity-15 text-slate-400 pointer-events-none bg-slate-50/50'
                                    }`}
                                    onClick={() => {
                                      handleDateChange(dateStr);
                                      setCalendarOpen(false);
                                    }}
                                  >
                                    {dayDate.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 relative" ref={endCalendarRef}>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                        <div 
                          className="relative cursor-pointer select-none"
                          onClick={() => setEndCalendarOpen(!endCalendarOpen)}
                        >
                          <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                          <div className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all duration-200 min-h-[38px] flex items-center">
                            {endDate ? formatSelectedDate(endDate) : <span className="text-slate-400">Choose end date...</span>}
                          </div>
                        </div>

                        {/* End Date Custom Calendar */}
                        {endCalendarOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 select-none animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex justify-between items-center mb-3">
                              <button
                                type="button"
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 font-bold transition-colors cursor-pointer text-xs"
                                onClick={() => {
                                  const prev = new Date(endCurrentMonth);
                                  prev.setMonth(prev.getMonth() - 1);
                                  setEndCurrentMonth(prev);
                                }}
                              >
                                ←
                              </button>
                              <span className="text-xs font-bold text-slate-800">
                                {endCurrentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <button
                                type="button"
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 font-bold transition-colors cursor-pointer text-xs"
                                onClick={() => {
                                  const next = new Date(endCurrentMonth);
                                  next.setMonth(next.getMonth() + 1);
                                  setEndCurrentMonth(next);
                                }}
                              >
                                →
                              </button>
                            </div>

                            <div className="grid grid-cols-7 text-center gap-1.5 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-slate-400">{d}</span>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center">
                              {getDaysInMonth(endCurrentMonth).map((dayDate, idx) => {
                                if (!dayDate) return <div key={idx} />;

                                const isOperational = isDateOperational(dayDate);
                                const yearStr = dayDate.getFullYear();
                                const monthStr = String(dayDate.getMonth() + 1).padStart(2, '0');
                                const dayStrNum = String(dayDate.getDate()).padStart(2, '0');
                                const dateStr = `${yearStr}-${monthStr}-${dayStrNum}`;
                                const isSelected = endDate === dateStr;
                                const isBeforeStart = bookingDate && dateStr < bookingDate;

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={!isOperational || isBeforeStart}
                                    className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'bg-primary text-white font-bold shadow-md shadow-primary/20 scale-105' 
                                        : isOperational && !isBeforeStart
                                          ? 'hover:bg-slate-100 text-slate-800 hover:scale-105'
                                          : 'opacity-15 text-slate-400 pointer-events-none bg-slate-50/50'
                                    }`}
                                    onClick={() => {
                                      handleEndDateChange(dateStr);
                                      setEndCalendarOpen(false);
                                    }}
                                  >
                                    {dayDate.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Hourly pricing: Single date + start/end times */}
                      <div className="flex flex-col gap-1 relative" ref={calendarRef}>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Booking Date</label>
                        <div 
                          className="relative cursor-pointer select-none"
                          onClick={() => setCalendarOpen(!calendarOpen)}
                        >
                          <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                          <div className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all duration-200 min-h-[38px] flex items-center">
                            {bookingDate ? formatSelectedDate(bookingDate) : <span className="text-slate-400">Choose booking date...</span>}
                          </div>
                        </div>

                        {calendarOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 select-none animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex justify-between items-center mb-3">
                              <button
                                type="button"
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 font-bold transition-colors cursor-pointer text-xs"
                                onClick={() => {
                                  const prev = new Date(currentMonth);
                                  prev.setMonth(prev.getMonth() - 1);
                                  setCurrentMonth(prev);
                                }}
                              >
                                ←
                              </button>
                              <span className="text-xs font-bold text-slate-800">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <button
                                type="button"
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 font-bold transition-colors cursor-pointer text-xs"
                                onClick={() => {
                                  const next = new Date(currentMonth);
                                  next.setMonth(next.getMonth() + 1);
                                  setCurrentMonth(next);
                                }}
                              >
                                →
                              </button>
                            </div>

                            <div className="grid grid-cols-7 text-center gap-1.5 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-slate-400">{d}</span>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center">
                              {getDaysInMonth(currentMonth).map((dayDate, idx) => {
                                if (!dayDate) return <div key={idx} />;

                                const isOperational = isDateOperational(dayDate);
                                const yearStr = dayDate.getFullYear();
                                const monthStr = String(dayDate.getMonth() + 1).padStart(2, '0');
                                const dayStrNum = String(dayDate.getDate()).padStart(2, '0');
                                const dateStr = `${yearStr}-${monthStr}-${dayStrNum}`;
                                const isSelected = bookingDate === dateStr;

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={!isOperational}
                                    className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'bg-primary text-white font-bold shadow-md shadow-primary/20 scale-105' 
                                        : isOperational
                                          ? 'hover:bg-slate-100 text-slate-800 hover:scale-105'
                                          : 'opacity-15 text-slate-400 pointer-events-none bg-slate-50/50'
                                    }`}
                                    onClick={() => {
                                      handleDateChange(dateStr);
                                      setCalendarOpen(false);
                                    }}
                                  >
                                    {dayDate.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                          <div className="relative">
                            <MdOutlineAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10" />
                            <select
                              className="w-full py-2.5 pl-9 pr-6 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors appearance-none cursor-pointer"
                              value={startTime}
                              onChange={e => setStartTime(e.target.value)}
                            >
                              <option value="">Select start</option>
                              {generateTimeOptions(allowedMinTime, allowedMaxTime).map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[9px]">▼</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                          <div className="relative">
                            <MdOutlineAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10" />
                            <select
                              className="w-full py-2.5 pl-9 pr-6 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors appearance-none cursor-pointer"
                              value={endTime}
                              onChange={e => setEndTime(e.target.value)}
                            >
                              <option value="">Select end</option>
                              {generateTimeOptions(allowedMinTime, allowedMaxTime).map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[9px]">▼</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {estimatedPrice > 0 && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center text-xs animate-in fade-in duration-200 mt-1 mb-2 shadow-sm">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none mb-1">Pricing Breakdown</span>
                        <span className="text-slate-600 font-semibold">
                          {venue?.pricingUnit === 'day' 
                            ? `${calculatedDays} ${calculatedDays === 1 ? 'Day' : 'Days'} Access` 
                            : `${estimatedHours.toFixed(1)} hrs @ ₹${Number(venue?.pricePerHour).toLocaleString('en-IN')}/hr`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none mb-1">Estimated Total</span>
                        <span className="text-sm font-black text-primary">₹{Math.round(estimatedPrice).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

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

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Purpose of Booking</label>
                      <input
                        type="text"
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                        placeholder="e.g. Birthday Party, Corporate Meeting"
                        value={purpose}
                        onChange={e => setPurpose(e.target.value)}
                        required
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1 text-[10px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="text-slate-950 font-bold">
                          {activeLock.bookingDate}
                          {activeLock.endDate && activeLock.endDate !== activeLock.bookingDate ? ` to ${activeLock.endDate}` : ''}
                        </span>
                      </div>
                      
                      {venue?.pricingUnit !== 'day' && (
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="text-slate-950 font-bold">{activeLock.startTime} - {activeLock.endTime}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-slate-950 font-bold">
                          {venue?.pricingUnit === 'day' 
                            ? `${calculatedDays} ${calculatedDays === 1 ? 'Day' : 'Days'} (₹${Number(venue?.pricePerDay || 0).toLocaleString('en-IN')}/day)` 
                            : `${estimatedHours.toFixed(1)} ${estimatedHours === 1 ? 'Hour' : 'Hours'} (₹${Number(venue?.pricePerHour || 0).toLocaleString('en-IN')}/hr)`}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/60 pt-1 mt-1">
                        <span className="font-semibold text-slate-700">Total Price:</span>
                        <span className="text-slate-950 font-extrabold text-xs">₹{Number(estimatedPrice).toLocaleString('en-IN')}</span>
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
