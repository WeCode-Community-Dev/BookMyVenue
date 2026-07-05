import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, Car, Check, ShieldAlert, Utensils,
  Maximize2, Calendar, Star, Sparkles, Phone, Mail, ArrowRight, CheckCircle, Info
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Venue } from '../data/venuesData';
import { cn } from '@/lib/utils';
import { VenueMap } from '@/components/map';

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoadingVenue, setIsLoadingVenue] = useState(true);

  // Hours-based states
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch booked slots for the venue
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
    if (id) {
      fetchBookedSlots();
    }
  }, [id]);

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
    if (!venue) return [];
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
    if (!venue) return [];
    const options = [];
    const startMin = parseTimeStr(venue.openingTime || '08:00');
    const endMin = parseTimeStr(venue.closingTime || '22:00');

    for (let min = startMin; min <= endMin; min += 30) {
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
    if (!selectedDate) return 'available';
    const slotStart = new Date(combineDateAndHour(selectedDate, hStart));
    const slotEnd = new Date(combineDateAndHour(selectedDate, hEnd));

    for (const b of bookedSlots) {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      const gapHours = Number(venue?.cleaningGap || 0);
      const bCleaningEnd = new Date(bEnd.getTime() + gapHours * 60 * 60 * 1000);

      if (slotStart < bEnd && bStart < slotEnd) {
        return 'booked';
      }
      if (slotStart < bCleaningEnd && bEnd <= slotStart) {
        return 'cleaning';
      }
    }
    return 'available';
  };

  // Load user details from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setCurrentUser(userObj);
      } catch (e) {
        console.error('Failed to parse user details:', e);
      }
    }
  }, []);

  // Redirect venue owners to their dedicated view/manage page
  useEffect(() => {
    if (currentUser?.role === 'venue_owner' && id) {
      navigate(`/my-venues/${id}`);
    }
  }, [currentUser, id, navigate]);

  // Fetch the requested venue dynamically
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

  // Scroll to top on mount or when id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoadingVenue) {
    return (
      <section className="relative w-full min-h-screen text-white bg-[#0a0a0c] flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading venue details...</h2>
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
            We couldn't find the location you were looking for. It may have been unlisted or moved.
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

  const handleBook = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      // Redirect to login page and redirect back on success
      navigate(`/login?redirect=${encodeURIComponent(`/book/${id}`)}`);
      return;
    }
    navigate(`/book/${id}`);
  };

  return (
    <section
      className="relative w-full min-h-screen text-white pb-20 overflow-y-auto"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      {/* Navigation */}
      <Navbar />

      {/* Gradients */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">

        {/* Back Link */}
        <button
          onClick={() => {
            if (currentUser?.role === 'venue_owner') {
              navigate('/my-venues');
            } else {
              navigate('/venues');
            }
          }}
          className="group flex items-center gap-2 text-white/50 hover:text-[#c5a059] text-sm font-semibold transition-all mb-8 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 hover:border-[#c5a059]/20"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {currentUser?.role === 'venue_owner' ? 'Back to My Listings' : 'Back to Venues'}
        </button>

        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {venue.title}
            </h1>

          </div>


        </div>

        {/* Widescreen Cinematic Visual Showcase */}
        <div className="flex flex-col gap-4 mb-12 w-full">

          {/* Big Image Display */}
          <div className="relative h-[320px] sm:h-[500px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group w-full">
            <img
              src={venue.images[activeImageIdx]}
              alt={`${venue.title} main view`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-101"
            />



            {/* Photo Indicator */}
            <div className="absolute bottom-5 right-5 bg-black/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs text-white/80 border border-white/10">
              Photo {activeImageIdx + 1} of {venue.images.length}
            </div>
          </div>

          {/* Thumbnail Selectors */}
          <div className="flex gap-3 overflow-x-auto pb-1.5 custom-scrollbar">
            {venue.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={cn(
                  "relative flex-shrink-0 w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 active:scale-95",
                  activeImageIdx === idx
                    ? "border-[#c5a059] scale-[1.03] shadow-lg shadow-[#c5a059]/10"
                    : "border-white/10 hover:border-white/30"
                )}
              >
                <img src={img} alt="thumbnail selector" className="w-full h-full object-cover" />
                {activeImageIdx !== idx && (
                  <div className="absolute inset-0 bg-black/40 transition-opacity hover:opacity-0" />
                )}
              </button>
            ))}
          </div>

        </div>

        {/* Detailed Information & Booking Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Consolidated Detailed Info (8-cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Main Info Box */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-10">

              {/* Section 1: Overview */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  Overview
                </h3>

                {/* Inline specifications row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-white/5 text-sm text-white/70">
                  <div className="flex items-center gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">

                    <span><strong>Max Capacity:</strong> {venue.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">

                    <span><strong>Space Area:</strong> {venue.squareFeet.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">

                    <span><strong>Location:</strong> {venue.location}</span>
                  </div>
                </div>

                <p className="text-base text-white/80 leading-relaxed font-light pt-2">
                  {venue.description}
                </p>
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Perfect For</h4>
                  <div className="flex flex-wrap gap-2">
                    {venue.eventTypes.map((type) => (
                      <Badge
                        key={type}
                        className="bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 hover:bg-[#c5a059]/20 text-xs font-medium py-1.5 px-4 rounded-full"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Amenities */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {venue.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 shadow-sm hover:border-white/10 transition-colors">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30">
                        <Check className="w-4 h-4 text-[#c5a059]" />
                      </div>
                      <span className="text-sm text-white/80">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Location & Parking */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  Location & Parking
                </h3>

                <div className="space-y-4 pt-1">
                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Street Address</h4>
                    <p className="text-sm sm:text-base text-white/90 bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-light leading-relaxed mb-4">
                      {venue.fullAddress}
                    </p>
                    <VenueMap
                      latitude={venue.latitude}
                      longitude={venue.longitude}
                      venueName={venue.title}
                      address={venue.fullAddress}
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      Parking Accommodations
                    </h4>
                    <p className="text-sm text-white/70 leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-light">
                      {venue.parking}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: Catering & Rules */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  Policies & Guidelines
                </h3>

                <div className="space-y-4 pt-1">
                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      Food & Catering Policy
                    </h4>
                    <p className="text-sm text-white/80 leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-light">
                      {venue.catering}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">House Rules</h4>
                    <ul className="space-y-3">
                      {venue.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] mt-2 flex-shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 5: Availability & Calendar */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  Availability & Booked Dates
                </h3>

                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h4>
                      <p className="text-xs text-white/50 mt-1">
                        Official active booking calendar schedules for {venue.title}
                      </p>
                    </div>

                    {/* Calendar Legend */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.03] border border-white/10 flex-shrink-0" />
                        <span className="text-white/40">Booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0" />
                        <span className="text-emerald-400 font-semibold">Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="max-w-md mx-auto">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-white/40 mb-3 uppercase tracking-wider">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {/* Empty slots for month start offset */}
                      {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="aspect-square" />
                      ))}

                      {/* Days list */}
                      {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, idx) => {
                        const day = idx + 1;
                        const calYear = new Date().getFullYear();
                        const calMonth = new Date().getMonth();
                        const checkDateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const checkDate = new Date(`${checkDateStr}T00:00:00`);

                        let status = 'available';
                        if (venue.bookingType === 'hours') {
                          const dayBookings = bookedSlots.filter(b => b.startDate.split('T')[0] === checkDateStr);
                          if (dayBookings.length > 0) {
                            const slots = generateTimelineHours();
                            let bookedSlotsCount = 0;
                            slots.forEach(slot => {
                              if (getSlotStatus(slot.start, slot.end) !== 'available') {
                                bookedSlotsCount++;
                              }
                            });
                            if (bookedSlotsCount >= slots.length) {
                              status = 'booked';
                            } else {
                              status = 'partial';
                            }
                          }
                        } else {
                          const hasBooking = bookedSlots.some(b => {
                            const bStart = new Date(b.startDate.split('T')[0] + 'T00:00:00');
                            const bEnd = new Date(b.endDate.split('T')[0] + 'T00:00:00');
                            return checkDate >= bStart && checkDate < bEnd;
                          });
                          status = hasBooking ? 'booked' : 'available';
                        }

                        return (
                          <div
                            key={`day-${day}`}
                            onClick={() => {
                              if (venue.bookingType === 'hours') {
                                setSelectedDate(checkDateStr);
                              }
                            }}
                            className={cn(
                              "aspect-square flex flex-col items-center justify-center text-xs rounded-xl transition-all duration-200 cursor-pointer",
                              status === 'available'
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold hover:scale-105"
                                : status === 'partial'
                                  ? "bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold hover:scale-105"
                                  : "bg-zinc-800 text-white/20 border-white/5 cursor-not-allowed"
                            )}
                          >
                            <span>{day}</span>
                            {status === 'partial' && (
                              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calendar details footer */}
                  <p className="text-xs text-white/50 text-center font-light leading-relaxed pt-2 border-t border-white/5">
                    This location has an active booking rate of <span className="text-white font-semibold">₹{venue.pricePerNight}/{venue.bookingType === 'hours' ? 'hour' : 'day'}</span>.
                    Dates highlighted in <span className="text-emerald-400 font-semibold">green</span> are open for booking.
                    {venue.bookingType === 'hours' && (
                      <span> Click on any day to select it and view available slots on the right widget.</span>
                    )}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Contact Card */}
            <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-lg">
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Dedicated Host Support</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-white/80 font-medium">
                <div className="flex items-center gap-3 bg-black/30 border border-white/5 p-4 rounded-2xl">
                  <Phone className="w-4 h-4 text-[#c5a059]" />
                  <span>+1 (800) 555-8368</span>
                </div>
                <div className="flex items-center gap-3 bg-black/30 border border-white/5 p-4 rounded-2xl overflow-hidden">
                  <Mail className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                  <span className="truncate">booking@{venue.title.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget (4-cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            {currentUser?.role === 'venue_owner' ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0e0e12]/95 border border-[#c5a059]/30 p-6 rounded-3xl shadow-2xl backdrop-blur-md space-y-6"
              >
                <div className="w-12 h-12 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-full flex items-center justify-center text-[#c5a059] mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-2 text-center">
                  <h4 className="text-lg font-bold text-white">Host Preview Mode</h4>
                  <p className="text-xs text-white/60 leading-relaxed font-light">
                    You are logged in as a Venue Host. Booking inquiries and date/time selections are disabled in preview mode.
                  </p>
                </div>
                <hr className="border-white/10" />
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/my-venues')}
                    className="w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-2xl h-11 text-xs transition-all"
                  >
                    Go to My Listings
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 h-11 text-xs transition-all"
                  >
                    Host Dashboard
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0e0e12]/95 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-md space-y-6"
              >
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                    {venue.bookingType === 'hours' ? 'Standard Hourly Rate' : 'Standard Daily Rate'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-bold text-white">₹{venue.pricePerNight}</span>
                    <span className="text-sm text-white/55 font-medium">
                      {venue.bookingType === 'hours' ? ' / hour' : ' / day'}
                    </span>
                  </div>
                </div>

                <hr className="border-white/10" />

                <div className="space-y-4">
                  <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Included Services</h4>
                  <ul className="space-y-2.5 text-xs text-white/70 font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                      <span>Instant Booking Verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                      <span>Mandatory Cleaning gap intervals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                      <span>Dedicated host assistance support</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handleBook}
                  className="w-full group bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-2xl h-12 shadow-lg shadow-[#c5a059]/10 border border-[#c5a059]/10 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  Book Venue Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <p className="text-[10px] text-center text-white/30 leading-relaxed font-light">
                  You will select your dates, verify availability slots, and finalize booking parameters in the next steps.
                </p>
              </motion.div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
