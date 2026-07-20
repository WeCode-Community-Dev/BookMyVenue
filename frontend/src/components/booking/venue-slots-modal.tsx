/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { User } from "@/types/user";

interface PredefinedSlot {
  startTime: string;
  endTime: string;
  price: number;
}

interface DayAvailability {
  isOpen: boolean;
  slots: PredefinedSlot[];
}

interface Venue {
  id: string;
  _id?: string;
  name: string;
  type: string;
  location: string;
  pricePerHour: number;
  imageUrl?: string;
  availability?: {
    monday?: DayAvailability;
    tuesday?: DayAvailability;
    wednesday?: DayAvailability;
    thursday?: DayAvailability;
    friday?: DayAvailability;
    saturday?: DayAvailability;
    sunday?: DayAvailability;
  };
}

enum BookingStatus {
  LOCKED = 'LOCKED',
  REQUESTED = 'REQUESTED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',
  CANCELLED_BY_OWNER = 'CANCELLED_BY_OWNER',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  NO_SHOW = 'NO_SHOW',
  CANCELLED = 'CANCELLED',
}

interface Booking {
  id: string;
  _id?: string;
  venueId: string;
  date: string; // "YYYY-MM-DD" or "YYYY-MM-DD HH:MM"
  hours: number;
  status: string;
  lockedUntil?: string;
  totalPrice?: number;
}

interface VenueSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: Venue | null;
  currentUser: (User & { _id?: string }) | null;
  onBookSuccess?: () => void;
  onGuestBookAttempt?: (venueName: string) => void;
}

export function VenueSlotsModal({
  isOpen,
  onClose,
  venue,
  currentUser,
  onBookSuccess,
  onGuestBookAttempt,
}: VenueSlotsModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Selection states
  const [selectedSlot, setSelectedSlot] = useState<PredefinedSlot | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customStartTime, setCustomStartTime] = useState("09:00");
  const [customEndTime, setCustomEndTime] = useState("10:00");

  // Booking submit states
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Payment states
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [lockedBooking, setLockedBooking] = useState<Booking | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [paymentError, setPaymentError] = useState("");
  const [paying, setPaying] = useState(false);

  // Get date range bounds (today to 1 year from now)
  const todayStr = new Date().toISOString().split("T")[0];
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const oneYearFromNowStr = oneYearFromNow.toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      // Default to tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split("T")[0]);
      
      setSelectedSlot(null);
      setIsCustomMode(false);
      setCustomStartTime("09:00");
      setCustomEndTime("10:00");
      setBookingSuccess(false);
      setBookingError("");
      setShowPaymentScreen(false);
      setLockedBooking(null);
      setPaymentError("");
      setPaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && venue && selectedDate) {
      const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
          const venueId = venue.id || venue._id;
          const response = await api.get(`/bookings/venue/${venueId}`);
          setExistingBookings(response.data || []);
        } catch (err) {
          console.error("Error fetching bookings for venue:", err);
          setExistingBookings([]);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [isOpen, venue, selectedDate]);

  useEffect(() => {
    if (!showPaymentScreen || timeLeft <= 0) {
      if (timeLeft === 0 && showPaymentScreen) {
        setPaymentError("Your 10-minute slot lock has expired. Please close this modal and try again.");
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentError("Your 10-minute slot lock has expired. Please close this modal and try again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showPaymentScreen, timeLeft]);

  if (!isOpen || !venue) return null;

  // Helper to parse date to weekday safely independent of local timezone offset
  const getDayOfWeekName = (dateString: string): string => {
    const parts = dateString.split("-");
    if (parts.length !== 3) return "monday";
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[d.getDay()];
  };

  const dayName = selectedDate ? getDayOfWeekName(selectedDate) : "monday";
  
  // Get availability
  const availability = venue.availability?.[dayName as keyof typeof venue.availability] || {
    isOpen: true,
    slots: [],
  };

  const slots = availability.isOpen ? (availability.slots || []) : [];

  // Filter bookings for the selected date (matching YYYY-MM-DD prefix)
  const bookingsOnDate = existingBookings.filter((b) => {
    if (!b.date || !b.date.startsWith(selectedDate)) {
      return false;
    }
    // Ignore inactive statuses
    if (
      b.status === "cancelled" || 
      b.status === "rejected" || 
      b.status === "EXPIRED" || 
      b.status === "CANCELLED" || 
      b.status === "REJECTED" ||
      b.status === "CANCELLED_BY_CUSTOMER" ||
      b.status === "CANCELLED_BY_OWNER"
    ) {
      return false;
    }
    // Ignore expired locks
    if (b.status === "LOCKED" && b.lockedUntil && new Date(b.lockedUntil).getTime() <= Date.now()) {
      return false;
    }
    return true;
  });

  const timeToMinutes = (timeStr: string): number => {
    const parts = timeStr.split(":");
    if (parts.length < 2) return 0;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const isSlotBooked = (startTime: string, endTime: string) => {
    const slotStartMin = timeToMinutes(startTime);
    const slotEndMin = timeToMinutes(endTime);
    
    return bookingsOnDate.some((b) => {
      const timePart = b.date.split(" ")[1] || b.date.split("T")[1];
      if (!timePart) return true; // Whole day booking
      
      const bookingStartMin = timeToMinutes(timePart);
      const bookingEndMin = bookingStartMin + b.hours * 60;
      
      return slotStartMin < bookingEndMin && bookingStartMin < slotEndMin;
    });
  };

  const checkCustomOverlap = (start: string, end: string) => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);
    
    return bookingsOnDate.some((b) => {
      const timePart = b.date.split(" ")[1] || b.date.split("T")[1];
      if (!timePart) return true; // Whole day booking
      
      const bookingStartMin = timeToMinutes(timePart);
      const bookingEndMin = bookingStartMin + b.hours * 60;
      
      return startMin < bookingEndMin && bookingStartMin < endMin;
    });
  };

  const getSlotDuration = (start: string, end: string): number => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);
    return Math.max(0.5, (endMin - startMin) / 60);
  };

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setBookingError("");
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    const nextDateStr = current.toISOString().split("T")[0];
    if (nextDateStr <= oneYearFromNowStr) {
      handleDateChange(nextDateStr);
    }
  };

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    const prevDateStr = current.toISOString().split("T")[0];
    if (prevDateStr >= todayStr) {
      handleDateChange(prevDateStr);
    }
  };

  const handleSlotClick = (slot: PredefinedSlot) => {
    setIsCustomMode(false);
    setSelectedSlot(slot);
    setBookingError("");
  };

  const handleConfirmBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onGuestBookAttempt) {
        onGuestBookAttempt(venue.name);
      }
      onClose();
      return;
    }

    setSubmittingBooking(true);
    setBookingError("");

    const userId = currentUser.id || currentUser._id;
    const venueId = venue.id || venue._id;

    let fullBookingDate = "";
    let hours = 0;
    let totalPrice = 0;
    let status = BookingStatus.LOCKED;

    if (isCustomMode) {
      if (!customStartTime || !customEndTime) {
        setBookingError("Please specify start and end times.");
        setSubmittingBooking(false);
        return;
      }
      const startMin = timeToMinutes(customStartTime);
      const endMin = timeToMinutes(customEndTime);
      if (startMin >= endMin) {
        setBookingError("Start time must be before end time.");
        setSubmittingBooking(false);
        return;
      }
      if (checkCustomOverlap(customStartTime, customEndTime)) {
        setBookingError("Requested custom time slot overlaps with an existing booking.");
        setSubmittingBooking(false);
        return;
      }

      fullBookingDate = `${selectedDate} ${customStartTime}`;
      hours = (endMin - startMin) / 60;
      totalPrice = hours * venue.pricePerHour;
      status = BookingStatus.REQUESTED;
    } else {
      if (!selectedSlot) {
        setBookingError("Please select a time slot.");
        setSubmittingBooking(false);
        return;
      }
      if (isSlotBooked(selectedSlot.startTime, selectedSlot.endTime)) {
        setBookingError("Selected slot is already booked.");
        setSubmittingBooking(false);
        return;
      }
      fullBookingDate = `${selectedDate} ${selectedSlot.startTime}`;
      hours = getSlotDuration(selectedSlot.startTime, selectedSlot.endTime);
      totalPrice = selectedSlot.price;
      status = BookingStatus.LOCKED;
    }

    try {
      const response = await api.post("/bookings", {
        userId,
        venueId,
        date: fullBookingDate,
        hours,
        totalPrice,
        status,
      });

      const createdBooking = response.data;
      if (status === BookingStatus.LOCKED) {
        setLockedBooking(createdBooking);
        setShowPaymentScreen(true);
        const expireTime = createdBooking.lockedUntil ? new Date(createdBooking.lockedUntil).getTime() : (Date.now() + 10 * 60 * 1000);
        const secondsLeft = Math.max(0, Math.floor((expireTime - Date.now()) / 1000));
        setTimeLeft(secondsLeft);
      } else {
        setBookingSuccess(true);
        if (onBookSuccess) {
          onBookSuccess();
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error("Booking error:", error);
      setBookingError(error.response?.data?.message || "Failed to finalize booking. Slot might have been booked.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!lockedBooking) return;
    setPaying(true);
    setPaymentError("");
    try {
      await api.post("/payments", {
        bookingId: lockedBooking.id || lockedBooking._id,
        amount: lockedBooking.totalPrice,
        paymentMethod: "mock"
      });
      setBookingSuccess(true);
      setShowPaymentScreen(false);
      setLockedBooking(null);
      if (onBookSuccess) {
        onBookSuccess();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error("Payment confirmation failed:", error);
      setPaymentError(error.response?.data?.message || "Payment processing failed. Your lock may have expired.");
    } finally {
      setPaying(false);
    }
  };

  const handleCancelPayment = async () => {
    if (lockedBooking) {
      try {
        const bookingId = lockedBooking.id || lockedBooking._id;
        await api.patch(`/bookings/${bookingId}/status`, { status: BookingStatus.CANCELLED });
      } catch (e) {
        console.error("Failed to cancel booking lock:", e);
      }
    }
    setShowPaymentScreen(false);
    setLockedBooking(null);
    setBookingError("");
    setPaymentError("");
    if (onBookSuccess) {
      onBookSuccess();
    }
  };

  const formatHourString = (timeStr: string) => {
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;
    const hour = parseInt(parts[0], 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}:${parts[1]} ${ampm}`;
  };

  if (showPaymentScreen && lockedBooking) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const isExpired = timeLeft === 0;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-500">Secure Checkout</span>
            <h3 className="text-xl font-bold mt-1 text-slate-900">Secure Your Slot</h3>
            <p className="text-xs text-slate-500 mt-1">Please complete your mock payment within the time limit.</p>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className={`w-28 h-28 rounded-full border-4 ${isExpired ? 'border-rose-200 bg-rose-50' : 'border-indigo-100 bg-indigo-50/30'} flex flex-col items-center justify-center relative animate-pulse`}>
              <span className={`text-2xl font-black ${isExpired ? 'text-rose-600' : 'text-indigo-600'}`}>
                {formattedTime}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Time Left</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2.5 text-xs text-slate-705">
            <div className="flex justify-between">
              <span className="text-slate-400">Venue:</span>
              <span className="font-semibold text-slate-800">{venue.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Date:</span>
              <span className="font-semibold text-slate-800">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span className="font-semibold text-slate-800">{lockedBooking.hours} hour(s)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
              <span className="font-bold text-slate-800">Total Price:</span>
              <span className="font-black text-indigo-600">RS {lockedBooking.totalPrice}</span>
            </div>
          </div>

          {paymentError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold text-center leading-relaxed">
              {paymentError}
            </div>
          )}

          <div className="space-y-2">
            {!isExpired ? (
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={paying}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing Payment...
                  </>
                ) : (
                  "Complete Mock Payment"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelPayment}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3.5 rounded-xl tracking-wide transition-all shadow-md cursor-pointer"
              >
                Close Modal
              </button>
            )}

            {!paying && !isExpired && (
              <button
                type="button"
                onClick={handleCancelPayment}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3.5 rounded-xl tracking-wide transition-all cursor-pointer"
              >
                Cancel and Release Slot
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400">Available Slots</span>
          <h3 className="text-xl font-bold mt-1">{venue.name}</h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {venue.location} &bull; Base Price: RS {venue.pricePerHour}/hour
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Date Selector Banner */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-150">
            <button
              onClick={handlePrevDay}
              disabled={selectedDate <= todayStr}
              className="p-2 bg-white hover:bg-slate-100 disabled:opacity-30 rounded-xl border border-slate-200 text-slate-700 font-bold transition-all"
            >
              &larr; Prev Day
            </button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                {dayName} availability
              </span>
              <input
                type="date"
                min={todayStr}
                max={oneYearFromNowStr}
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="bg-transparent border-0 font-bold text-slate-800 text-center focus:outline-none focus:ring-0 p-0 cursor-pointer"
              />
            </div>
            <button
              onClick={handleNextDay}
              disabled={selectedDate >= oneYearFromNowStr}
              className="p-2 bg-white hover:bg-slate-100 disabled:opacity-30 rounded-xl border border-slate-200 text-slate-700 font-bold transition-all"
            >
              Next Day &rarr;
            </button>
          </div>

          {bookingSuccess ? (
            /* Success View */
            <div className="text-center py-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-105">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900">Booking Submitted!</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                {isCustomMode
                  ? "Your custom time request has been submitted for owner approval."
                  : "Your slot reservation has been successfully confirmed."}
              </p>
              
              <div className="w-full max-w-md mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-slate-400">Selected Date:</span><span className="font-semibold text-slate-800">{selectedDate}</span></div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reserved Slot:</span>
                  <span className="font-semibold text-slate-800">
                    {isCustomMode
                      ? `${formatHourString(customStartTime)} - ${formatHourString(customEndTime)}`
                      : selectedSlot && `${selectedSlot.startTime} - ${selectedSlot.endTime}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-150 pt-1.5">
                  <span className="text-slate-500 font-bold">Total Cost:</span>
                  <span className="font-bold text-indigo-600">
                    RS {isCustomMode
                      ? (getSlotDuration(customStartTime, customEndTime) * venue.pricePerHour).toFixed(2)
                      : selectedSlot?.price}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="font-bold uppercase text-indigo-600">{isCustomMode ? "Pending Approval" : "Pending"}</span></div>
              </div>

              <button
                onClick={onClose}
                className="mt-6 w-full max-w-md bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer"
              >
                Back to Listings
              </button>
            </div>
          ) : (
            /* Main Booking Flow */
            <>
              {bookingError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs">
                  {bookingError}
                </div>
              )}

              {loadingBookings ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="mt-3 text-xs text-slate-550">Loading booking slot records...</p>
                </div>
              ) : !availability.isOpen ? (
                <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl">
                  <svg className="w-10 h-10 text-slate-350 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-sm font-bold text-slate-700">Closed Today</h4>
                  <p className="text-xs text-slate-500 mt-1">This venue does not operate on {dayName}s.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Slots Grid */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Predefined Availability Slots</h4>
                    {slots.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No predefined time slots configured for {dayName}s by the owner.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slots.map((slot, index) => {
                          const booked = isSlotBooked(slot.startTime, slot.endTime);
                          const isSelected = selectedSlot === slot && !isCustomMode;
                          
                          let slotStyle = "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-350";
                          if (booked) {
                            slotStyle = "bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed";
                          } else if (isSelected) {
                            slotStyle = "bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200";
                          }

                          return (
                            <button
                              key={index}
                              type="button"
                              disabled={booked}
                              onClick={() => handleSlotClick(slot)}
                              className={`px-3 py-3 border rounded-xl font-semibold text-xs text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${slotStyle}`}
                            >
                              <span className="font-bold">{slot.startTime} - {slot.endTime}</span>
                              <span className="text-[10px] font-bold">
                                {booked ? "Booked" : `RS ${slot.price}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Accordion trigger for Custom Booking Slot */}
                  <div className="border-t border-slate-100 pt-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomMode(!isCustomMode);
                        setSelectedSlot(null);
                        setBookingError("");
                      }}
                      className="flex items-center justify-between w-full py-2 text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      <span>Need a custom time slot? Request one here</span>
                      <svg
                        className={`w-4 h-4 transform transition-transform ${isCustomMode ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isCustomMode && (
                      <div className="mt-3 p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl space-y-4 animate-in fade-in duration-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Custom Start Time</span>
                            <input
                              type="time"
                              value={customStartTime}
                              onChange={(e) => {
                                setCustomStartTime(e.target.value);
                                setBookingError("");
                              }}
                              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Custom End Time</span>
                            <input
                              type="time"
                              value={customEndTime}
                              onChange={(e) => {
                                setCustomEndTime(e.target.value);
                                setBookingError("");
                              }}
                              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        {/* Calculated pricing summary */}
                        {(() => {
                          const startMin = timeToMinutes(customStartTime);
                          const endMin = timeToMinutes(customEndTime);
                          const customHrs = Math.max(0, (endMin - startMin) / 60);
                          const customCost = customHrs * venue.pricePerHour;
                          const overlap = checkCustomOverlap(customStartTime, customEndTime);

                          return (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-indigo-50/80 text-xs">
                                <div>
                                  <span className="font-semibold text-slate-800">Custom Duration:</span> {customHrs.toFixed(1)} hour(s) @ RS {venue.pricePerHour}/hr
                                </div>
                                <div className="text-right">
                                  <span className="text-base font-bold text-indigo-755">RS {customCost.toFixed(2)}</span>
                                </div>
                              </div>

                              {overlap && (
                                <p className="text-[11px] font-medium text-rose-600">
                                  Warning: This custom slot overlaps with an existing confirmed booking.
                                </p>
                              )}

                              {startMin >= endMin && (
                                <p className="text-[11px] font-medium text-rose-600">
                                  Warning: Start time must be before end time.
                                </p>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Summary / Confirmation checkout box */}
                  {!isCustomMode && selectedSlot && (
                    <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider block">Selected Slot</span>
                          <span className="text-slate-800 font-bold text-sm">
                            {selectedSlot.startTime} - {selectedSlot.endTime} on {selectedDate}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Duration</span>
                          <span className="text-slate-800 font-bold text-sm">
                            {getSlotDuration(selectedSlot.startTime, selectedSlot.endTime)} hr(s)
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-indigo-50/80">
                        <span className="text-xs font-semibold text-slate-800">Slot Price:</span>
                        <span className="text-lg font-black text-indigo-750">RS {selectedSlot.price}</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Booking Request Form Action Button */}
                  {(selectedSlot || isCustomMode) && (
                    <form onSubmit={handleConfirmBookingSubmit} className="pt-2">
                      <button
                        type="submit"
                        disabled={submittingBooking || (isCustomMode && (timeToMinutes(customStartTime) >= timeToMinutes(customEndTime) || checkCustomOverlap(customStartTime, customEndTime)))}
                        className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs py-3 rounded-xl tracking-wide transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingBooking ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Processing Reservation...
                          </>
                        ) : !currentUser ? (
                          "Log In to Secure Booking"
                        ) : isCustomMode ? (
                          "Submit Custom Request (Pending Owner Approval)"
                        ) : (
                          "Book Predefined Slot"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
