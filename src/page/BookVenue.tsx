import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, ShieldAlert,
  Maximize2, ArrowRight, CheckCircle2, Info,
  QrCode
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Venue } from '../data/venuesData';
import { cn } from '@/lib/utils';

/**
 * BookVenue Component
 * Renders the multi-step checkout wizard for booking a venue.
 * Step 1: Date/Time Slot selection (checks operating hours and daily/hourly overlaps).
 * Step 2: Renter information and mock UPI QR code verification.
 * Step 3: Success receipt confirmation.
 */
export default function BookVenue() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bookingStep, setBookingStep] = useState<'date-selection' | 'payment' | 'success'>('date-selection');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoadingVenue, setIsLoadingVenue] = useState(true);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Renter contact details
  const [renterName, setRenterName] = useState('');
  const [renterPhone, setRenterPhone] = useState('');
  const [renterEmail, setRenterEmail] = useState('');

  // Hours-based states
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');

  // Mock QR payment states
  const [transactionId, setTransactionId] = useState('');

  // Pre-fill user details from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !userStr) {
      // If not logged in, redirect to login
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      const userObj = JSON.parse(userStr);
      setRenterName(userObj.name || '');
      setRenterEmail(userObj.email || '');
    } catch (e) {
      console.error('Failed to parse user details for booking pre-fill:', e);
    }
  }, [navigate]);

  // Fetch the requested venue details
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setIsLoadingVenue(true);
        const response = await fetch(`http://localhost:5000/api/venues/${id}`);
        if (response.ok) {
          const data = await response.json();
          setVenue(data);
        } else {
          setVenue(null);
        }
      } catch (err) {
        console.error('Failed to fetch venue details from backend:', err);
        setVenue(null);
      } finally {
        setIsLoadingVenue(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id]);

  // Fetch booked slots for the venue (used for calendar display indicators)
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/venues/${id}/bookings`);
        if (response.ok) {
          const data = await response.json();
          setBookedSlots(data);
        }
      } catch (err) {
        console.error('Failed to fetch venue bookings:', err);
      }
    };
    if (id && bookingStep !== 'success') {
      fetchBookedSlots();
    }
  }, [id, bookingStep]);

  // Fetch actual venue availability from the backend availability endpoint
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!id || !venue) return;
      try {
        const url = venue.bookingType === 'hours'
          ? `http://localhost:5000/api/venues/${id}/availability?date=${selectedDate}`
          : `http://localhost:5000/api/venues/${id}/availability`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (venue.bookingType === 'hours') {
            setAvailabilitySlots(data.slots || []);
          } else {
            setUnavailableDates(data.unavailableDates || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch venue availability:', err);
      }
    };
    if (id && venue && bookingStep !== 'success') {
      fetchAvailability();
    }
  }, [id, venue, selectedDate, bookingStep]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoadingVenue) {
    return (
      <section className="relative w-full min-h-screen text-white bg-[#0a0a0c] flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading booking details...</h2>
        </div>
      </section>
    );
  }

  if (!venue) {
    return (
      <section className="relative w-full min-h-screen text-white bg-[#0a0a0c] flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-3xl font-bold">Venue Not Found</h2>
          <p className="text-white/60 text-sm">
            We couldn't find the location you were looking to book.
          </p>
          <Link to="/venues">
            <Button className="bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-full mt-4">
              Return to Venues
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const isHours = venue.bookingType === 'hours';

  const parseTimeStr = (tStr: string) => {
    if (!tStr) return 0;
    const [h, m] = tStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatTime12h = (timeStr: string) => {
    if (!timeStr) return '';
    const [hStr, mStr] = timeStr.split(':');
    const h = Number(hStr);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${mStr} ${ampm}`;
  };

  const combineDateAndHour = (dateStr: string, hourStr: string) => {
    return `${dateStr}T${hourStr}:00`;
  };

  const generateTimelineHours = () => {
    const slots = [];
    const startMin = parseTimeStr(venue.openingTime || '08:00');
    const endMin = parseTimeStr(venue.closingTime || '22:00');

    // Generate every hour
    for (let min = startMin; min + 60 <= endMin; min += 60) {
      const sh = Math.floor(min / 60);
      const sm = min % 60;
      const eh = Math.floor((min + 60) / 60);
      const em = (min + 60) % 60;

      const startStr = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
      const endStr = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
      slots.push({ start: startStr, end: endStr });
    }
    return slots;
  };

  const generateHourOptions = () => {
    const options = [];
    const startMin = parseTimeStr(venue.openingTime || '08:00');
    const endMin = parseTimeStr(venue.closingTime || '22:00');

    for (let min = startMin; min <= endMin; min += 60) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      options.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
    return options;
  };

  const isSlotWithinSelectedRange = (slotStartStr: string, slotEndStr: string) => {
    if (!startHour || !endHour) return false;
    const sMinutes = parseTimeStr(startHour);
    const eMinutes = parseTimeStr(endHour);
    const slotSMin = parseTimeStr(slotStartStr);
    const slotEMin = parseTimeStr(slotEndStr);

    return slotSMin >= sMinutes && slotEMin <= eMinutes;
  };

  const handleSlotClick = (slotStart: string, slotEnd: string) => {
    if (!startHour || (startHour && endHour)) {
      setStartHour(slotStart);
      setEndHour(slotEnd);
    } else {
      const startMin = parseTimeStr(startHour);
      const clickMin = parseTimeStr(slotStart);
      if (clickMin >= startMin) {
        setEndHour(slotEnd);
      } else {
        setStartHour(slotStart);
        setEndHour(slotEnd);
      }
    }
  };

  const getSlotStatus = (hStart: string, hEnd: string) => {
    const matched = availabilitySlots.find(s => s.start === hStart && s.end === hEnd);
    return matched ? matched.status : 'available';
  };

  const getHourBookingError = () => {
    if (venue.bookingType !== 'hours') return '';
    if (!selectedDate || !startHour || !endHour) return '';

    const getMinutes = (tStr: string) => {
      const [h, m] = tStr.split(':').map(Number);
      return h * 60 + m;
    };

    const startMin = getMinutes(startHour);
    const endMin = getMinutes(endHour);

    if (endMin <= startMin) {
      return 'End time must be after start time.';
    }

    // Check overlap by inspecting if any slot within [startHour, endHour) is not available
    const hasOverlap = availabilitySlots.some(slot => {
      const slotStartMin = getMinutes(slot.start);
      const slotEndMin = getMinutes(slot.end);

      if (slotStartMin < endMin && startMin < slotEndMin) {
        return slot.status !== 'available';
      }
      return false;
    });

    if (hasOverlap) {
      return 'The selected time range conflicts with an existing booking or its cleaning gap.';
    }

    return '';
  };

  const hourBookingError = getHourBookingError();

  // Date limit helpers for web bookings (only allowed within 30 days)
  const todayStr = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const getBookingDatesError = () => {
    if (!checkIn || !checkOut) return '';
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const limit = new Date(today);
    limit.setDate(today.getDate() + 30);
    limit.setHours(23, 59, 59, 999);

    if (start < today) {
      return 'Check-in date cannot be in the past.';
    }
    if (end <= start) {
      return 'Check-out date must be after check-in date.';
    }
    if (start > limit || end > limit) {
      const formattedLimit = limit.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `Website bookings are only available for dates within the next 30 days (up to ${formattedLimit}). For future dates, please contact the venue owner for an offline booking.`;
    }

    // Check overlap with daily blocked dates from backend
    const getLocalDateStr = (d: Date) => {
      const pad = (num: number) => String(num).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const hasOverlap = [];
    const loopDate = new Date(start);
    while (loopDate < end) {
      const dStr = getLocalDateStr(loopDate);
      if (unavailableDates.includes(dStr)) {
        hasOverlap.push(dStr);
      }
      loopDate.setDate(loopDate.getDate() + 1);
    }

    if (hasOverlap.length > 0) {
      return 'The selected dates conflict with an existing booking.';
    }

    return '';
  };

  const bookingDatesError = getBookingDatesError();

  const getDurationInHours = (s: string, e: string) => {
    if (!s || !e) return 0;
    const [sh, sm] = s.split(':').map(Number);
    const [eh, em] = e.split(':').map(Number);
    const diff = (eh + em / 60) - (sh + sm / 60);
    return diff > 0 ? diff : 0;
  };

  const getDurationInDays = (s: string, e: string) => {
    if (!s || !e) return 0;
    const sDate = new Date(s);
    const eDate = new Date(e);
    const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  const duration = isHours ? getDurationInHours(startHour, endHour) : getDurationInDays(checkIn, checkOut);
  const basePrice = venue.pricePerNight * (duration || 1);
  const serviceFee = Math.round(basePrice * 0.15);
  const totalPrice = basePrice + serviceFee;

  const isDatesSelected = isHours
    ? (selectedDate && startHour && endHour && !hourBookingError)
    : (checkIn && checkOut && !bookingDatesError);

  const handleAuthorizePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!renterName || !renterPhone || !renterEmail) {
      setBookingError('Please enter your name, phone number, and email address.');
      return;
    }

    try {
      setIsSubmittingBooking(true);
      setBookingError('');

      const finalStartDate = venue.bookingType === 'hours' ? combineDateAndHour(selectedDate, startHour) : checkIn;
      const finalEndDate = venue.bookingType === 'hours' ? combineDateAndHour(selectedDate, endHour) : checkOut;

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          venueId: venue.id,
          startDate: finalStartDate,
          endDate: finalEndDate,
          guests: venue.capacity,
          totalPrice: totalPrice,
          renterName,
          renterPhone,
          renterEmail
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete booking');
      }

      setBookingStep('success');
    } catch (err: any) {
      console.error('Booking error:', err);
      setBookingError(err.message || 'An error occurred during booking checkout. Please try again.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <section
      className="relative w-full min-h-screen text-white pb-20 overflow-y-auto"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      <Navbar />

      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">

        {/* Back Link */}
        <button
          onClick={() => {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (user?.role === 'venue_owner') {
              navigate(`/my-venues/${venue.id}`);
            } else {
              navigate(`/venue/${venue.id}`);
            }
          }}
          className="group flex items-center gap-2 text-white/50 hover:text-[#c5a059] text-sm font-semibold transition-all mb-8 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 hover:border-[#c5a059]/20"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Venue Details
        </button>

        {/* Title */}
        <div className="mb-10">
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Checkout Experience</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-1">
            Book <span className="text-[#c5a059]">{venue.title}</span>
          </h1>
        </div>

        {/* Main Grid: checkout on left, sticky summary on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Multi-Step Booking Wizard */}
          <div className="lg:col-span-8 space-y-6">

            {/* Steps indicator */}
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  bookingStep === 'date-selection' ? "bg-[#c5a059] text-black" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                )}>
                  {bookingStep !== 'date-selection' ? "✓" : "1"}
                </span>
                <span className={cn("text-xs font-medium", bookingStep === 'date-selection' ? "text-white" : "text-white/40")}>Select Dates</span>
              </div>
              <div className="h-px bg-white/10 flex-1" />
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  bookingStep === 'payment' ? "bg-[#c5a059] text-black" : bookingStep === 'success' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/40"
                )}>
                  {bookingStep === 'success' ? "✓" : "2"}
                </span>
                <span className={cn("text-xs font-medium", bookingStep === 'payment' ? "text-white" : "text-white/40")}>Payment & Info</span>
              </div>
              <div className="h-px bg-white/10 flex-1" />
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  bookingStep === 'success' ? "bg-[#c5a059] text-black" : "bg-white/5 text-white/40"
                )}>
                  3
                </span>
                <span className={cn("text-xs font-medium", bookingStep === 'success' ? "text-white" : "text-white/40")}>Success Receipt</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: DATE SELECTION */}
              {bookingStep === 'date-selection' && (
                <motion.div
                  key="date-selection"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/[0.01] border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      {isHours ? 'Select Date & Hours' : 'Select Booking Dates'}
                    </h2>
                    <p className="text-sm text-white/50">Configure your execution window for this venue.</p>
                  </div>

                  <hr className="border-white/5" />

                  {isHours ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Interactive Calendar Preview */}
                        <div className="bg-[#0e0e12]/60 border border-white/5 p-5 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-white">
                              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h4>
                            <div className="flex gap-2 text-[10px]">
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-zinc-800" /> Booked</span>
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/20" /> Open</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-white/40 mb-1 uppercase tracking-wider">
                            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                          </div>

                          <div className="grid grid-cols-7 gap-1.5">
                            {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, idx) => (
                              <div key={`empty-${idx}`} className="aspect-square" />
                            ))}

                            {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, idx) => {
                              const day = idx + 1;
                              const calYear = new Date().getFullYear();
                              const calMonth = new Date().getMonth();
                              const checkDateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                              const dayBookings = bookedSlots.filter(b => b.startDate.split('T')[0] === checkDateStr);
                              let status = 'available';
                              if (dayBookings.length > 0) {
                                const slots = generateTimelineHours();
                                let bookedSlotsCount = 0;
                                slots.forEach(slot => {
                                  if (getSlotStatus(slot.start, slot.end) !== 'available') {
                                    bookedSlotsCount++;
                                  }
                                });
                                status = bookedSlotsCount >= slots.length ? 'booked' : 'partial';
                              }

                              const isSelected = selectedDate === checkDateStr;

                              return (
                                <button
                                  key={`day-${day}`}
                                  type="button"
                                  onClick={() => setSelectedDate(checkDateStr)}
                                  className={cn(
                                    "aspect-square flex flex-col items-center justify-center text-[10px] rounded-lg transition-all duration-200",
                                    isSelected
                                      ? "bg-[#c5a059] text-black font-bold scale-105"
                                      : status === 'available'
                                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/20"
                                        : status === 'partial'
                                          ? "bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                                          : "bg-zinc-800 text-white/20 border-white/5 cursor-not-allowed"
                                  )}
                                >
                                  <span>{day}</span>
                                  {status === 'partial' && !isSelected && (
                                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Date input & Slots Selector */}
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-white/60 uppercase block">Selected Date</label>
                            <input
                              type="date"
                              value={selectedDate}
                              min={todayStr}
                              max={maxDateStr}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                            />
                          </div>

                          {selectedDate && (
                            <div className="space-y-3 pt-2">
                              <div className="flex justify-between items-center text-[10px] text-white/50">
                                <span>Operating Hours: {formatTime12h(venue.openingTime)} - {formatTime12h(venue.closingTime)}</span>
                                <span>Gap: {venue.cleaningGap} hr{venue.cleaningGap !== 1 && 's'}</span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                {generateTimelineHours().map((slot, idx) => {
                                  const status = getSlotStatus(slot.start, slot.end);
                                  const isSelected = isSlotWithinSelectedRange(slot.start, slot.end);
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      disabled={status !== 'available'}
                                      onClick={() => handleSlotClick(slot.start, slot.end)}
                                      className={cn(
                                        "flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] border transition-all text-center select-none",
                                        isSelected
                                          ? "bg-[#c5a059] text-black border-[#c5a059] font-bold"
                                          : status === 'booked'
                                            ? "bg-zinc-800 text-white/20 border-white/5 cursor-not-allowed"
                                            : status === 'cleaning'
                                              ? "bg-amber-500/10 text-amber-400/50 border-amber-500/20 cursor-not-allowed"
                                              : "bg-emerald-500/5 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15"
                                      )}
                                    >
                                      <span className="font-medium">{formatTime12h(slot.start)}</span>
                                      <span className="text-[8px] opacity-75">to {formatTime12h(slot.end)}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] text-white/50 uppercase block">Start Hour</label>
                                  <select
                                    value={startHour}
                                    onChange={(e) => setStartHour(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50"
                                  >
                                    <option value="" className="bg-[#0e0e12]">Select</option>
                                    {generateHourOptions().map(h => (
                                      <option key={h} value={h} className="bg-[#0e0e12]">{formatTime12h(h)}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] text-white/50 uppercase block">End Hour</label>
                                  <select
                                    value={endHour}
                                    onChange={(e) => setEndHour(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#c5a059]/50"
                                  >
                                    <option value="" className="bg-[#0e0e12]">Select</option>
                                    {generateHourOptions().map(h => (
                                      <option key={h} value={h} className="bg-[#0e0e12]">{formatTime12h(h)}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {hourBookingError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 leading-relaxed">
                          {hourBookingError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">Check-In Date</label>
                        <input
                          type="date"
                          value={checkIn}
                          min={todayStr}
                          max={maxDateStr}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">Check-Out Date</label>
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn || todayStr}
                          max={maxDateStr}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                        />
                      </div>

                      {bookingDatesError && (
                        <div className="col-span-1 md:col-span-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3.5 leading-relaxed">
                          {bookingDatesError}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-[#c5a059]/5 border border-[#c5a059]/10 text-white/70 text-xs rounded-xl p-3.5 flex flex-col gap-2.5 leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Booking Window Limit:</strong> Stays are only bookable online up to 30 days in advance (up to {maxDate.toLocaleDateString('en-GB')}). For dates further out, contact support.
                      </span>
                    </div>
                    {!isHours && (
                      <div className="flex items-start gap-2.5 pt-2.5 border-t border-white/5">
                        <Info className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Event Time Policy:</strong> Check-in is at <strong>12:00 AM (midnight)</strong> on your check-in date, and check-out is by <strong>12:00 PM (noon)</strong> on your check-out date. *For a single-day event, select check-out as the day after your event.*
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      disabled={!isDatesSelected}
                      onClick={() => setBookingStep('payment')}
                      className="bg-[#c5a059] hover:bg-[#b08e4d] disabled:opacity-40 disabled:hover:bg-[#c5a059] text-black font-semibold rounded-xl text-xs h-11 px-8 transition-all flex items-center gap-1.5"
                    >
                      Continue to Payment
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT & DETAILS */}
              {bookingStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/[0.01] border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-[#c5a059]" /> Secure Checkout
                    </h2>
                    <p className="text-sm text-white/50">Enter details to authorize guarantee holding.</p>
                  </div>

                  <hr className="border-white/5" />

                  <div className="space-y-4">

                    {/* Contact Details */}
                    <div>
                      <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">Renter Contact Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/50 uppercase">Full Name *</label>
                          <input
                            type="text"
                            value={renterName}
                            onChange={(e) => setRenterName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/50 uppercase">Phone Number *</label>
                          <input
                            type="tel"
                            value={renterPhone}
                            onChange={(e) => setRenterPhone(e.target.value)}
                            placeholder="+1 (555) 019-9231"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/50 uppercase">Email Address *</label>
                          <input
                            type="email"
                            value={renterEmail}
                            onChange={(e) => setRenterEmail(e.target.value)}
                            placeholder="johndoe@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c5a059]/50"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-white/5" />

                    {/* Mock UPI QR Scan Section */}
                    <div>
                      <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">UPI Scan to Pay (Mockup Guarantee)</h4>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-black/35 border border-white/5 p-6 rounded-2xl">

                        {/* QR Display */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-xl w-40 h-40 mx-auto border border-white/20">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&bgcolor=ffffff&data=${encodeURIComponent(`upi://pay?pa=pay@bookmyvenue.com&pn=BookMyVenue&am=${totalPrice}&cu=INR`)}`}
                            alt="Payment QR Code Mock"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Pay instructions */}
                        <div className="md:col-span-8 flex flex-col justify-center space-y-3.5">
                          <div className="space-y-1 text-center md:text-left">
                            <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold flex items-center gap-1 justify-center md:justify-start">
                              <QrCode className="w-3.5 h-3.5" /> Scannable UPI code
                            </span>
                            <h5 className="text-sm font-semibold text-white">Scan & Pay ₹{totalPrice.toLocaleString()}</h5>
                            <p className="text-[11px] text-white/50 leading-relaxed font-light">
                              Scan this QR code with any UPI app (GPay, PhonePe, Paytm) to transfer the booking guarantee fee of <strong>₹{totalPrice.toLocaleString()}</strong>.
                            </p>
                          </div>

                          <div className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-1 text-[11px]">
                            <div className="flex justify-between text-white/60">
                              <span>UPI Address:</span>
                              <span className="font-mono text-white font-medium select-all">pay@bookmyvenue.com</span>
                            </div>
                            <div className="flex justify-between text-white/60">
                              <span>Payee Name:</span>
                              <span className="text-white font-medium">BookMyVenue Payments</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <hr className="border-white/5" />

                    {/* Transaction Reference */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-white/55 uppercase block flex justify-between">
                        <span>UPI Transaction Ref Number *</span>
                        <span className="text-white/30 lowercase">12-digit code</span>
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={transactionId}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setTransactionId(val);
                        }}
                        placeholder="e.g. 302849182349"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#c5a059]/50 transition-colors"
                      />
                      {transactionId && transactionId.length !== 12 && (
                        <p className="text-[10px] text-amber-500/80">Ref number must be exactly 12 digits ({transactionId.length}/12)</p>
                      )}
                    </div>

                  </div>

                  {bookingError && (
                    <p className="text-red-500 text-xs font-semibold text-center bg-red-500/5 p-3 border border-red-500/10 rounded-xl">
                      {bookingError}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <Button
                      disabled={isSubmittingBooking}
                      onClick={() => setBookingStep('date-selection')}
                      className="bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-medium h-11 px-6"
                    >
                      Back to Date
                    </Button>
                    <Button
                      disabled={isSubmittingBooking || !renterName || !renterPhone || !renterEmail || transactionId.length !== 12}
                      onClick={handleAuthorizePayment}
                      className="bg-[#c5a059] hover:bg-[#b08e4d] disabled:opacity-40 disabled:hover:bg-[#c5a059] text-black font-semibold rounded-xl text-xs h-11 px-8 flex items-center justify-center gap-2"
                    >
                      {isSubmittingBooking ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Submitting Inquiry...
                        </>
                      ) : (
                        'Submit Inquiry'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS */}
              {bookingStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#c5a059]/10 border border-[#c5a059]/25 p-8 sm:p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-5 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/30 shadow-inner">
                    <CheckCircle2 className="w-8 h-8 text-[#c5a059] animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">Booking Inquiry Submitted!</h2>
                    <p className="text-sm text-[#c5a059] font-medium">
                      Your reservation request has been transmitted.
                    </p>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-light max-w-sm">
                    The host reviews all inquiries within 12 hours. A confirmation email and direct receipt invoice will be sent to you at <span className="font-semibold text-white underline">{renterEmail}</span>.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
                    <Link to="/mybooking" className="flex-1">
                      <Button className="w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-xl h-11 text-xs">
                        View My Bookings
                      </Button>
                    </Link>
                    <Link to="/venues" className="flex-1">
                      <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-11 text-xs">
                        Browse More Venues
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Sticky Summary Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">

            {/* Premium Venue Detail Box */}
            <div className="bg-[#0e0e12]/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="h-44 relative">
                <img
                  src={venue.images[0]}
                  alt={venue.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] to-transparent" />
                <Badge className="absolute top-4 right-4 bg-[#c5a059] text-black border-none font-bold hover:bg-[#c5a059]">
                  {venue.bookingType === 'hours' ? 'Hourly' : 'Daily'}
                </Badge>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{venue.title}</h3>
                  <p className="text-xs text-white/55 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                    {venue.location}
                  </p>
                </div>

                <hr className="border-white/5" />

                {/* Inline specs */}
                <div className="grid grid-cols-2 gap-4 text-xs text-white/70">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Up to {venue.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{venue.squareFeet.toLocaleString()} sq ft</span>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Cost Calculations */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40">Standard Rate:</span>
                    <span className="font-semibold text-white">₹{venue.pricePerNight.toLocaleString()} / {isHours ? 'hour' : 'day'}</span>
                  </div>

                  {isDatesSelected ? (
                    <>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40">
                          Base Price ({duration} {isHours ? 'Hour' + (duration !== 1 ? 's' : '') : 'Day' + (duration !== 1 ? 's' : '')}):
                        </span>
                        <span className="font-semibold text-white">₹{basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40">Service & Cleaning Fee (15%):</span>
                        <span className="font-semibold text-white">₹{serviceFee.toLocaleString()}</span>
                      </div>
                      <hr className="border-white/5 border-dashed" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-white/90">Total Cost:</span>
                        <span className="text-base font-bold text-[#c5a059]">₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center text-[10px] text-white/40 leading-relaxed font-light">
                      Select {isHours ? 'date & hours' : 'check-in & check-out dates'} on the left to review price calculations.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Policies */}
            <div className="bg-[#0e0e12]/60 border border-white/5 p-5 rounded-2xl space-y-3 text-xs text-white/60">
              <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#c5a059]" /> Quick Policies
              </h4>
              <ul className="space-y-2 list-none font-light leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#c5a059] mt-2 flex-shrink-0" />
                  <span><strong>Cleaning Interval:</strong> A mandatory cleaning slot is reserved between sequential bookings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#c5a059] mt-2 flex-shrink-0" />
                  <span><strong>Capacity Guarantee:</strong> Renters must verify that maximum capacities are respected.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
