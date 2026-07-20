'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/axios';

interface PredefinedSlot {
  startTime: string;
  endTime: string;
  price: number;
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export function RescheduleModal({ isOpen, onClose, booking, onSuccess }: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Selection states
  const [selectedSlot, setSelectedSlot] = useState<PredefinedSlot | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customStartTime, setCustomStartTime] = useState('09:00');
  const [customEndTime, setCustomEndTime] = useState('10:00');
  const [reason, setReason] = useState('');

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const venue = booking?.venueId || {};
  const venueId = venue.id || venue._id;

  // Date range bounds (today to 1 year from now)
  const todayStr = new Date().toISOString().split('T')[0];
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const oneYearFromNowStr = oneYearFromNow.toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen && booking) {
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
      
      setSelectedSlot(null);
      setIsCustomMode(false);
      setCustomStartTime('09:00');
      setCustomEndTime('10:00');
      setReason('');
      setErrorMsg('');
    }
  }, [isOpen, booking]);

  useEffect(() => {
    if (isOpen && venueId && selectedDate) {
      const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
          const response = await api.get(`/bookings/venue/${venueId}`);
          setExistingBookings(response.data || []);
        } catch (err) {
          console.error('Error fetching bookings for venue:', err);
          setExistingBookings([]);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [isOpen, venueId, selectedDate]);

  if (!isOpen || !booking) return null;

  // Parse date to weekday
  const getDayOfWeekName = (dateString: string): string => {
    const parts = dateString.split('-');
    if (parts.length !== 3) return 'monday';
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[d.getDay()];
  };

  const dayName = selectedDate ? getDayOfWeekName(selectedDate) : 'monday';
  const availability = venue.availability?.[dayName] || {
    isOpen: true,
    slots: [],
  };

  const slots = availability.isOpen ? (availability.slots || []) : [];

  // Filter bookings on selected date (ignoring cancelled/expired/rejected)
  const bookingsOnDate = existingBookings.filter((b) => {
    if (!b.date || !b.date.startsWith(selectedDate)) {
      return false;
    }
    // Ignore self to allow swapping times if within the same day
    if (b.id === booking.id || b._id === booking.id || b._id === booking._id) {
      return false;
    }
    const statusUpper = (b.status || '').toUpperCase();
    if (
      ['CANCELLED', 'REJECTED', 'EXPIRED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_OWNER'].includes(statusUpper)
    ) {
      return false;
    }
    if (statusUpper === 'LOCKED' && b.lockedUntil && new Date(b.lockedUntil).getTime() <= Date.now()) {
      return false;
    }
    return true;
  });

  const timeToMinutes = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length < 2) return 0;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const isSlotBooked = (startTime: string, endTime: string) => {
    const slotStartMin = timeToMinutes(startTime);
    const slotEndMin = timeToMinutes(endTime);
    
    return bookingsOnDate.some((b) => {
      const timePart = b.date.split(' ')[1] || b.date.split('T')[1];
      if (!timePart) return true;
      
      const bookingStartMin = timeToMinutes(timePart);
      const bookingEndMin = bookingStartMin + b.hours * 60;
      
      return slotStartMin < bookingEndMin && bookingStartMin < slotEndMin;
    });
  };

  const checkCustomOverlap = (start: string, end: string) => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);
    
    return bookingsOnDate.some((b) => {
      const timePart = b.date.split(' ')[1] || b.date.split('T')[1];
      if (!timePart) return true;
      
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
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    let fullBookingDate = '';
    let hours = 0;
    let requestedSlot: any = null;

    if (isCustomMode) {
      if (!customStartTime || !customEndTime) {
        setErrorMsg('Please specify start and end times.');
        setSubmitting(false);
        return;
      }
      const startMin = timeToMinutes(customStartTime);
      const endMin = timeToMinutes(customEndTime);
      if (startMin >= endMin) {
        setErrorMsg('Start time must be before end time.');
        setSubmitting(false);
        return;
      }
      if (checkCustomOverlap(customStartTime, customEndTime)) {
        setErrorMsg('Requested time slot overlaps with an existing booking.');
        setSubmitting(false);
        return;
      }
      fullBookingDate = `${selectedDate} ${customStartTime}`;
      hours = (endMin - startMin) / 60;
    } else {
      if (!selectedSlot) {
        setErrorMsg('Please select a time slot.');
        setSubmitting(false);
        return;
      }
      if (isSlotBooked(selectedSlot.startTime, selectedSlot.endTime)) {
        setErrorMsg('Selected slot is already booked.');
        setSubmitting(false);
        return;
      }
      fullBookingDate = `${selectedDate} ${selectedSlot.startTime}`;
      hours = getSlotDuration(selectedSlot.startTime, selectedSlot.endTime);
      requestedSlot = selectedSlot;
    }

    try {
      const bookingId = booking.id || booking._id;
      await api.patch(`/bookings/${bookingId}/reschedule`, {
        requestedDate: fullBookingDate,
        requestedHours: hours,
        requestedSlot,
        reason,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Reschedule error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit reschedule request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400">Reschedule Workflow</span>
          <h3 className="text-xl font-bold mt-1">Request Venue Rescheduling</h3>
          <p className="text-xs text-slate-400 mt-1">Submit a reschedule request for owner approval. Original slot is kept confirmed until approved.</p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Current Booking Context */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-2">
            <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider text-indigo-600">Current Booking Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400 block">Date & Time</span>
                <span className="font-bold text-slate-700">{booking.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration</span>
                <span className="font-bold text-slate-700">{booking.hours} hour(s)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Venue</span>
                <span className="font-bold text-slate-700">{venue.name}</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Date Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select New Reschedule Date</label>
            <input
              type="date"
              min={todayStr}
              max={oneYearFromNowStr}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {loadingBookings ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-2 text-xs text-slate-500">Checking availability slot records...</p>
            </div>
          ) : !availability.isOpen ? (
            <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="text-sm font-bold text-slate-750">Closed on {dayName}s</h4>
              <p className="text-xs text-slate-500 mt-1">Please pick another date.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Predefined Slots */}
              {slots.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Predefined Time Slots</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {slots.map((slot: PredefinedSlot, index: number) => {
                      const booked = isSlotBooked(slot.startTime, slot.endTime);
                      const isSelected = selectedSlot === slot && !isCustomMode;

                      let styleStr = 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
                      if (booked) {
                        styleStr = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed';
                      } else if (isSelected) {
                        styleStr = 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200';
                      }

                      return (
                        <button
                          key={index}
                          type="button"
                          disabled={booked}
                          onClick={() => {
                            setIsCustomMode(false);
                            setSelectedSlot(slot);
                            setErrorMsg('');
                          }}
                          className={`px-3 py-2.5 border rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${styleStr}`}
                        >
                          {slot.startTime} - {slot.endTime}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Slot Option */}
              <div className="border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(!isCustomMode);
                    setSelectedSlot(null);
                    setErrorMsg('');
                  }}
                  className="flex items-center justify-between w-full py-2 text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  <span>Need a custom time range? Request one here</span>
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
                  <div className="mt-3 p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Start Time</span>
                      <input
                        type="time"
                        value={customStartTime}
                        onChange={(e) => {
                          setCustomStartTime(e.target.value);
                          setErrorMsg('');
                        }}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">End Time</span>
                      <input
                        type="time"
                        value={customEndTime}
                        onChange={(e) => {
                          setCustomEndTime(e.target.value);
                          setErrorMsg('');
                        }}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reason for Rescheduling (Optional)</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Weather forecast issues, scheduling conflicts..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting || (!selectedSlot && !isCustomMode)}
            onClick={handleSubmit}
            className="w-1/2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 text-center"
          >
            {submitting ? 'Submitting Request...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
