import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Info,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';




export interface Booking {
  id: string;
  venueId: string;
  venueTitle: string;
  venueLocation: string;
  venueImage: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingDate: string;
  paymentStatus: string;
  hostName: string;
  hostPhone: string;
  hostMail: string;
  checkInInstructions: string;
  bookingType?: string;
  latitude?: number | null;
  longitude?: number | null;
  fullAddress?: string;
  refundAmount?: number;
  refundPercentage?: number;
}

export interface PlaceCardProps {
  images?: string[];
  tags?: string[];
  rating?: number;
  title: string;
  dateRange: string;
  hostType?: string;
  isTopRated?: boolean;
  description: string;
  pricePerNight?: number;
  capacity: number;
  eventTypes?: string[];
  className?: string;
  onClick?: () => void;
}


export function PlaceCard({
  images = [],

  title,
  dateRange,
  description,
  capacity,
  className = "",
  onClick
}: PlaceCardProps): React.JSX.Element {
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  const nextImage = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl transition-all duration-500 ${onClick ? 'hover:border-[#c5a059]/40 cursor-pointer' : ''} ${className}`}
    >
      {/* Visual media gallery wrapper */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={images[activeImgIndex]}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${onClick ? 'group-hover:scale-105' : ''}`}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600";
          }}
        />

        {/* Carousel controls if multi-image */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={prevImage}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}



        {/* Backdrop bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Details Container */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">


        </div>

        <h3 className={`text-lg sm:text-xl font-semibold text-white tracking-tight ${onClick ? 'group-hover:text-[#c5a059]' : ''} transition-colors mb-2`}>
          {title}
        </h3>

        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between text-xs text-white/80 border-t border-white/5 pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{dateRange}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Cap: {capacity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Bookings(): React.JSX.Element {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Custom dialog state handlers
  const [cancelTargetBooking, setCancelTargetBooking] = useState<Booking | null>(null);
  const [successToast, setSuccessToast] = useState<string>('');

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        setErrorMsg('Please login to view your bookings.');
        return;
      }

      try {
        setIsLoading(true);
        setErrorMsg('');
        const response = await fetch('http://localhost:5000/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          setErrorMsg('Failed to load bookings.');
        }
      } catch (err) {
        console.error('Failed to load bookings from API:', err);
        setErrorMsg('Failed to connect to the booking service.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Auto-dismiss toast alert
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => {
        setSuccessToast('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const handleConfirmCancel = async () => {
    if (!cancelTargetBooking) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${cancelTargetBooking.id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === cancelTargetBooking.id
            ? {
              ...b,
              status: 'cancelled',
              paymentStatus: data.booking.payment_status,
              refundAmount: data.refundAmount,
              refundPercentage: data.refundPercentage
            }
            : b
        )
      );

      const refundInfo = data.refundPercentage > 0
        ? `Refund of ${formatPrice(data.refundAmount)} (${data.refundPercentage}%) initiated.`
        : `Booking cancelled. Under policy terms, no refund was issued.`;
      setSuccessToast(`Successfully cancelled booking ${cancelTargetBooking.id}. ${refundInfo}`);
    } catch (err: any) {
      console.error('Cancellation error:', err);
      alert(err.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancelTargetBooking(null);
    }
  };

  const getRefundPreview = (booking: Booking) => {
    const today = new Date();
    const startDate = new Date(booking.startDate);
    const diffTime = startDate.getTime() - today.getTime();

    let pct = 0;
    let amt = 0;
    let description = '';

    if (booking.bookingType === 'hours') {
      const hoursRemaining = diffTime / (1000 * 60 * 60);

      if (hoursRemaining >= 36) {
        pct = 100;
        amt = booking.totalPrice;
        description = `You are cancelling ${Math.floor(hoursRemaining)} hours before the start time. You are eligible for a FULL refund.`;
      } else if (hoursRemaining >= 24) {
        pct = 50;
        amt = booking.totalPrice * 0.5;
        description = `You are cancelling ${Math.floor(hoursRemaining)} hours before the start time. You are eligible for a 50% partial refund.`;
      } else if (hoursRemaining >= 6) {
        pct = 10;
        amt = booking.totalPrice * 0.1;
        description = `You are cancelling ${Math.floor(hoursRemaining)} hours before the start time. You are eligible for a 10% partial refund.`;
      } else {
        pct = 0;
        amt = 0;
        description = `You are cancelling less than 6 hours before the start time. No refund will be issued.`;
      }
    } else {
      const daysRemaining = diffTime / (1000 * 60 * 60 * 24);

      if (daysRemaining >= 10) {
        pct = 100;
        amt = booking.totalPrice;
        description = `You are cancelling ${Math.floor(daysRemaining)} days before the start date. You are eligible for a FULL refund.`;
      } else if (daysRemaining >= 3) {
        pct = 50;
        amt = booking.totalPrice * 0.5;
        description = `You are cancelling ${Math.floor(daysRemaining)} days before the start date. You are eligible for a 50% partial refund.`;
      } else {
        pct = 0;
        amt = 0;
        description = `You are cancelling less than 3 days before the start date. No refund will be issued.`;
      }
    }

    return { pct, amt, description };
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDateString = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const getDueDateString = (dateStr: string): string => {
    // Calculates exactly 1 day before check-in arrival
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (

    <section
      className="relative w-full min-h-screen text-white pt-10 pb-24 overflow-y-auto font-sans"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      {/* Call custom self-contained premium Navbar */}
      <Navbar />

      {/* Backdrop Gradients matching Venues Page */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      {/* Main Container */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">

        {/* Toast Alert Banner */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-zinc-900/95 border-l-4 border-[#c5a059] text-white p-4 rounded-r-xl shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-[#c5a059] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Action Confirmed</p>
              <p className="text-xs text-white/70 mt-1">{successToast}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast('')}
              className="text-white/40 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Title and Subtitle */}
        <div className="text-center mb-16">
          <h1
            className="font-normal leading-[0.95] text-white text-[2.5rem] sm:text-5xl md:text-6xl tracking-tight"
            style={{
              fontFamily: "'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              letterSpacing: '-0.035em'
            }}
          >
            My <span className="text-[#c5a059]">Bookings</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-white/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Manage your booked stays, examine payment plans, and keep track of completed host experiences.
          </p>
        </div>

        {/* Bookings List mapping to PlaceCard */}
        <div className="space-y-12">
          {isLoading ? (
            <div className="text-center py-24 bg-black/20 border border-white/5 rounded-3xl max-w-2xl mx-auto">
              <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading your bookings...</p>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-24 bg-black/20 border border-white/5 rounded-3xl max-w-2xl mx-auto px-6">
              <Info className="w-8 h-8 text-[#c5a059] mx-auto mb-4" />
              <p className="text-white/80 font-semibold mb-2">{errorMsg}</p>
              {errorMsg.toLowerCase().includes('login') && (
                <Link to="/login?redirect=/mybooking" className="inline-block mt-4 px-6 py-2.5 bg-[#c5a059] hover:bg-[#ab8237] text-[#0a0a0c] font-bold rounded-full text-xs transition-all shadow-md">
                  Login Now
                </Link>
              )}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-24 bg-black/20 border border-white/5 rounded-3xl max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Info className="w-6 h-6 text-[#c5a059]/60" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No bookings found</h3>
              <p className="text-sm text-white/40 max-w-xs mx-auto">
                You currently don't have any bookings listed under your account.
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const isUpcoming = booking.status === 'upcoming';
              const isCompleted = booking.status === 'completed';
              const isCancelled = booking.status === 'cancelled';

              return (
                <div
                  key={booking.id}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300"
                >
                  {/* Embedded Native Card Component */}
                  <PlaceCard
                    images={[booking.venueImage]}
                    tags={[
                      booking.status.toUpperCase(),
                      `${booking.guests} Guests Maximum`
                    ]}

                    title={booking.venueTitle}
                    dateRange={formatBookingRange(booking.startDate, booking.endDate, booking.bookingType)}
                    hostType="Verified Elite Host"
                    isTopRated={isUpcoming}
                    description={booking.checkInInstructions}
                    pricePerNight={Math.round(booking.totalPrice / 2)}
                    capacity={booking.guests}
                    eventTypes={['Celebration', 'Gatherative']}
                    className="border-none bg-transparent shadow-none hover:border-transparent p-0"
                  />

                  {/* Unified Booking Action Bar under the Card */}
                  <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    {/* Status Indicator */}
                    <div className="flex flex-col gap-1">
                      <div className="text-xs">
                        {isUpcoming && (
                          <div className="flex items-center gap-1.5 text-emerald-400">


                          </div>
                        )}
                        {isCompleted && (
                          <span className="text-white/40 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059]" /> Hope you enjoyed your stay!
                          </span>
                        )}
                        {isCancelled && (
                          <div className="flex flex-col gap-0.5 text-left">
                            <span className="text-red-400/80 flex items-center gap-1.5 font-medium">
                              <XCircle className="w-3.5 h-3.5" /> Stay Cancelled
                            </span>
                            {booking.refundPercentage !== undefined && (
                              <span className="text-xs text-white/50">
                                {booking.refundPercentage > 0 ? (
                                  <>Refunded: <strong className="text-[#c5a059]">{formatPrice(booking.refundAmount || 0)}</strong> ({booking.refundPercentage}% refund)</>
                                ) : (
                                  <span className="text-white/40 font-medium">
                                    No refund issued ({booking.bookingType === 'hours' ? 'cancelled less than 6 hours prior' : 'cancelled less than 3 days prior'})
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Specific Interaction Button Matrix */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Active reservation interactions */}
                      {isUpcoming && (
                        <>
                          <button
                            type="button"
                            onClick={() => setCancelTargetBooking(booking)}
                            className="px-5 py-2.5 text-xs font-semibold tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full border border-red-500/20 transition-all duration-300 active:scale-[0.98]"
                          >
                            Cancel Stay
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/mybooking/${booking.id}`)}
                            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-wider bg-[#c5a059] text-black hover:bg-[#ebd5a7] rounded-full shadow-lg transition-all duration-300 active:scale-[0.98]"
                          >
                            Details
                          </button>
                        </>
                      )}

                      {/* Past reservation interactions */}
                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => navigate(`/mybooking/${booking.id}`)}
                          className="px-5 py-2.5 text-xs font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-all"
                        >
                          Receipt
                        </button>
                      )}

                      {/* Cancelled reservation option */}
                      {isCancelled && (
                        <button
                          type="button"
                          onClick={() => {
                            setSuccessToast("Re-booking slot coordinates for " + booking.venueTitle + "...");
                          }}
                          className="px-6 py-2.5 text-xs font-semibold text-[#c5a059] border border-[#c5a059]/30 hover:bg-[#c5a059]/10 rounded-full transition-all"
                        >
                          Rebook Venue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= MODAL DIALOGS ================= */}

      {/* 2. Cancel Confirmation Modal */}
      {cancelTargetBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setCancelTargetBooking(null)} />

          <div className="relative bg-[#0d0d11] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Cancel Lease Agreement?</h4>
                <p className="text-xs text-white/60">
                  You are requesting to cancel the reservation for <strong className="text-white">{cancelTargetBooking.venueTitle}</strong> starting {new Date(cancelTargetBooking.startDate).toLocaleDateString()}.
                </p>
              </div>

              {/* Cancellation Warning Terms */}
              {(() => {
                const { pct, amt, description } = getRefundPreview(cancelTargetBooking);
                return (
                  <div className="bg-[#1a1113] border border-[#c5a059]/20 rounded-2xl p-4 text-left text-xs space-y-2">
                    <p className="font-semibold text-[#c5a059]">Cancellation Policy & Refund Breakdown:</p>
                    <p className="text-white/80">{description}</p>
                    <div className="pt-2 border-t border-white/5 space-y-1 text-white/70">
                      <div className="flex justify-between">
                        <span>Original Price:</span>
                        <span className="font-medium text-white">{formatPrice(cancelTargetBooking.totalPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Refund Percentage:</span>
                        <span className="font-semibold text-[#c5a059]">{pct}%</span>
                      </div>
                      <div className="flex justify-between text-sm pt-1 font-bold border-t border-white/5">
                        <span>Est. Refund Amount:</span>
                        <span className="text-[#c5a059]">{formatPrice(amt)}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/40 pt-1">
                      Note: Cancellations are final. Released dates will become instantly open to other users.
                    </p>
                  </div>
                );
              })()}
            </div>

            <div className="p-6 bg-[#13131a] border-t border-white/5 flex gap-3">
              <button
                type="button"
                onClick={() => setCancelTargetBooking(null)}
                className="flex-1 py-3 text-xs font-semibold tracking-wider text-center text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
              >
                Keep Stay
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-3 text-xs font-semibold tracking-wider text-center text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}



    </section>
  );
}