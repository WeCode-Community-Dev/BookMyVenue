import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  CreditCard,
  ArrowLeft,
  Info,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { VenueMap } from '@/components/map';
import type { Booking } from './UserBookings';

export default function BookingDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        setErrorMsg('Please login to view booking details.');
        return;
      }

      try {
        setIsLoading(true);
        setErrorMsg('');
        const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          const data = await response.json();
          setErrorMsg(data.message || 'Failed to load booking details.');
        }
      } catch (err) {
        console.error('Failed to load booking details:', err);
        setErrorMsg('Failed to connect to the booking service.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatBookingRange = (start: string, end: string, bookingType?: string): string => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return `${start} to ${end}`;
    
    const dateOpt: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    
    if (bookingType === 'hours') {
      const timeOpt: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
      const dateStr = s.toLocaleDateString('en-US', dateOpt);
      const startStr = s.toLocaleTimeString('en-US', timeOpt);
      const endStr = e.toLocaleTimeString('en-US', timeOpt);
      return `${dateStr}, ${startStr} - ${endStr}`;
    } else {
      return `${s.toLocaleDateString('en-US', dateOpt)} to ${e.toLocaleDateString('en-US', dateOpt)}`;
    }
  };

  return (
    <section
      className="relative w-full min-h-screen text-white pt-10 pb-24 overflow-y-auto font-sans"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      <Navbar />

      {/* Backdrop Gradients */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/mybooking')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-semibold mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Bookings
        </button>

        {isLoading ? (
          <div className="text-center py-32 bg-black/20 border border-white/5 rounded-3xl">
            <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading booking details...</p>
          </div>
        ) : errorMsg || !booking ? (
          <div className="text-center py-24 bg-black/20 border border-white/5 rounded-3xl px-6 max-w-2xl mx-auto">
            <Info className="w-8 h-8 text-[#c5a059] mx-auto mb-4" />
            <p className="text-white/80 font-semibold mb-2">{errorMsg || 'Booking details not found.'}</p>
            {errorMsg.toLowerCase().includes('login') && (
              <Link to="/login?redirect=/mybooking" className="inline-block mt-4 px-6 py-2.5 bg-[#c5a059] hover:bg-[#ab8237] text-[#0a0a0c] font-bold rounded-full text-xs transition-all shadow-md">
                Login Now
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-mono">Lease Details</span>
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                  {booking.venueTitle}
                </h1>
                <p className="text-xs text-white/50 mt-1">Booking Reference: <strong className="text-white">{booking.id}</strong></p>
              </div>
              
              <div className="flex items-center gap-3">
                {booking.status === 'upcoming' && (
                  <span className="px-4 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Upcoming Stay
                  </span>
                )}
                {booking.status === 'completed' && (
                  <span className="px-4 py-1.5 rounded-full text-[11px] font-semibold bg-white/5 text-white/60 border border-white/10 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" /> Completed
                  </span>
                )}
                {booking.status === 'cancelled' && (
                  <span className="px-4 py-1.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/25 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Cancelled
                  </span>
                )}
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Details & Receipt */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Venue Cover Image */}
                <div className="h-64 sm:h-80 w-full rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                  <img
                    src={booking.venueImage}
                    alt={booking.venueTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200";
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />
                </div>

                {/* Invoice Receipt Panel */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                    <CreditCard className="w-5 h-5 text-[#c5a059]" />
                    <h3 className="font-semibold text-base">Invoice Summary</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                      <span className="text-white/50">Base Price Rate</span>
                      <span className="text-white font-medium">Included in Total</span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                      <span className="text-white/50">Booking Type</span>
                      <span className="text-white font-medium capitalize">{booking.bookingType || 'days'}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                      <span className="text-white/50">Maximum Guests Allowed</span>
                      <span className="text-white font-medium">{booking.guests} Guests</span>
                    </div>

                    <div className="flex justify-between items-start text-sm py-1 border-b border-white/5 gap-4">
                      <span className="text-white/50 flex-shrink-0">Schedule / Range</span>
                      <span className="text-white font-medium text-right leading-relaxed">
                        {formatBookingRange(booking.startDate, booking.endDate, booking.bookingType)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                      <span className="text-white/50">Payment Status</span>
                      <span className="font-semibold uppercase tracking-wider text-xs px-2.5 py-1 rounded bg-[#c5a059]/10 text-[#ebd5a7]">
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <div className="text-sm font-semibold text-[#c5a059]">Total Cost Paid</div>
                      <div className="text-2xl font-bold text-white">{formatPrice(booking.totalPrice)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Maps, Address, Host & Instructions */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Map Panel */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
                  <div>
                    <h3 className="font-semibold text-base mb-1">Destination Map</h3>
                    <div className="flex items-start gap-1.5 text-xs text-white/50 mt-1">
                      <MapPin className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                      <span>{booking.fullAddress || booking.venueLocation}</span>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/5">
                    <VenueMap
                      latitude={booking.latitude}
                      longitude={booking.longitude}
                      venueName={booking.venueTitle}
                      address={booking.fullAddress || booking.venueLocation}
                    />
                  </div>
                </div>

                {/* Host Details */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
                  <div>
                    <h3 className="font-semibold text-base">Host Contact</h3>
                    <p className="text-xs text-white/50 mt-1">Reach out directly to arrange keys, check-in, or logistics.</p>
                  </div>

                  <div className="space-y-3.5 border-t border-white/5 pt-4">
                    <div className="text-sm font-bold text-white">{booking.hostName}</div>
                    
                    <div className="flex flex-col gap-2.5 text-xs text-white/70">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-white/40" />
                        <span>{booking.hostPhone || '+1 (555) 234-5678'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-white/40" />
                        <span>{booking.hostMail}</span>
                      </div>
                    </div>

                    <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 mt-2 text-xs text-white/60 leading-relaxed">
                      <strong className="text-[#c5a059] block mb-1">Check-in Policy & Codes:</strong>
                      {booking.checkInInstructions}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
