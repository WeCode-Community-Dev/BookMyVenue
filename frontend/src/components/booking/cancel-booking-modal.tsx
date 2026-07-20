'use client';

import React, { useState } from 'react';
import { api } from '@/lib/axios';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export function CancelBookingModal({ isOpen, onClose, booking, onSuccess }: CancelBookingModalProps) {
  const [cancellationReason, setCancellationReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !booking) return null;

  const venue = booking.venueId || {};

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const bookingId = booking.id || booking._id;
      await api.patch(`/bookings/${bookingId}/status`, {
        status: 'CANCELLED_BY_CUSTOMER',
        cancellationReason: cancellationReason || 'Cancelled by customer',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Cancellation error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to cancel the booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const isPaid = booking.paymentStatus === 'PAID';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-rose-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-rose-400">Cancel Booking</span>
          <h3 className="text-xl font-bold mt-1">Confirm Cancellation</h3>
          <p className="text-xs text-rose-350 mt-1">Are you sure you want to cancel this booking?</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Booking Info Card */}
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs space-y-2.5">
            <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider text-rose-650">Booking Summary</h4>
            <div className="space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Venue:</span>
                <span className="font-bold">{venue.name || 'Unknown Venue'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-bold">{booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold">{booking.hours} hour(s)</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-200/60 font-semibold">
                <span className="text-slate-500">Total Price Paid:</span>
                <span className="font-extrabold text-slate-850">₹{booking.totalPrice}</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Policy Information */}
          <div className="space-y-3.5">
            <div className="p-3 rounded-2xl bg-amber-50/40 border border-amber-100 text-[11px] text-amber-800 leading-relaxed">
              <span className="font-extrabold uppercase text-[9px] tracking-wider text-amber-600 block mb-0.5">Cancellation Policy</span>
              Bookings can be cancelled prior to the event date. Once cancelled, your booked slot will be released back to the general public instantly.
            </div>

            {isPaid && (
              <div className="p-3 rounded-2xl bg-indigo-50/45 border border-indigo-100 text-[11px] text-indigo-850 leading-relaxed">
                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-600 block mb-0.5">Refund Policy</span>
                Since your booking is pre-paid (paid online), a full refund of <strong className="font-extrabold text-indigo-950">₹{booking.totalPrice}</strong> will be initiated automatically. Refund status will remain PENDING until approved.
              </div>
            )}
          </div>

          {/* Cancellation Reason input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reason for cancellation (optional)</label>
            <input
              type="text"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="e.g. Change of plans, event conflict..."
              className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
          >
            Keep Booking
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleCancelSubmit}
            className="w-1/2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md text-center"
          >
            {submitting ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
