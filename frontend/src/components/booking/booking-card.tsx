import React from "react";

export interface BookingCardProps {
  booking: any;
  onViewDetails?: (booking: any) => void;
  children?: React.ReactNode;
}

export function BookingCard({ booking, onViewDetails, children }: BookingCardProps) {
  const venue = booking.venueId || {};
  const bookingId = booking.id || booking._id;

  const getStatusBadgeClass = (status: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "CONFIRMED":
        return "bg-emerald-50 border-emerald-150 text-emerald-700";
      case "COMPLETED":
        return "bg-blue-50 border-blue-150 text-blue-700";
      case "NO_SHOW":
        return "bg-orange-50 border-orange-150 text-orange-700";
      case "REQUESTED":
      case "PAYMENT_PENDING":
      case "LOCKED":
      case "PENDING":
        return "bg-amber-50 border-amber-150 text-amber-700 animate-pulse";
      case "REJECTED":
      case "EXPIRED":
      case "CANCELLED":
      case "CANCELLED_BY_OWNER":
      case "CANCELLED_BY_CUSTOMER":
      default:
        return "bg-rose-50 border-rose-150 text-rose-700";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Card Header */}
        <div className="flex justify-between items-start gap-2">
          <div className="overflow-hidden">
            <h3 className="font-extrabold text-slate-850 text-sm leading-snug truncate">
              {venue.name || "Unknown Venue"}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
              <svg className="w-3 h-3 text-slate-350 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate">{venue.location || "No address"}</span>
            </p>
            {booking.rescheduleStatus === 'PENDING' && (
              <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-violet-50 border border-violet-200 text-violet-700 animate-pulse mt-1.5">
                Reschedule Pending
              </span>
            )}
          </div>
          <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border uppercase tracking-wider shrink-0 ${getStatusBadgeClass(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        {/* Card Schedule Info */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-205/60 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Date & Start Time:</span>
            <span className="font-bold text-slate-700">{booking.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Duration:</span>
            <span className="font-bold text-slate-700">{booking.hours} hour(s)</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-200/50">
            <span className="text-slate-505 font-semibold">Total Price:</span>
            <span className="font-extrabold text-indigo-600">RS {booking.totalPrice}</span>
          </div>
        </div>

        {/* Card Metadata / Timestamps Summary */}
        {booking.cancellationReason && (
          <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-[11px] text-rose-800 leading-relaxed truncate">
            <span className="font-extrabold text-[9px] text-rose-500 uppercase block tracking-wider mb-0.5">Cancellation Reason</span>
            <span className="block truncate">{booking.cancellationReason}</span>
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-2">
        <button
          onClick={() => onViewDetails?.(booking)}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
        >
          View Details
        </button>
        {children && <div className="flex gap-2 w-full pt-1">{children}</div>}
      </div>
    </div>
  );
}