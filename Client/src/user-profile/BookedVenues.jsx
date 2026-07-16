import React, { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Eye, Trash2, X, AlertTriangle, ShieldCheck, Clock, XCircle } from 'lucide-react';

export default function BookedVenues({ bookings, onCancelBooking }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-full flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'Pending Admin Approval':
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
      case 'Completed':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-650 border border-slate-200 text-xs font-bold rounded-full flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-full flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handleCancelClick = (e, id) => {
    e.stopPropagation();
    setConfirmCancelId(id);
  };

  const handleConfirmCancel = () => {
    onCancelBooking(confirmCancelId);
    setConfirmCancelId(null);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Booked Venues ({bookings.length})</h3>
        <p className="text-xs text-slate-400 font-medium">Keep track of your upcoming and past reservations</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-base font-bold text-slate-700">No Reservations Yet</h4>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">You haven't booked any premium spaces yet. Explore locations and plan your next event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_10px_25px_-12px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] flex flex-col h-full"
            >
              {/* Card Thumbnail */}
              <div className="h-44 relative overflow-hidden group">
                <img 
                  src={booking.venueImage} 
                  alt={booking.venueName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  {getStatusBadge(booking.status)}
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-xl text-sm border border-white/10">
                  ${booking.totalPaid} Paid
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="text-lg font-bold text-slate-800 tracking-tight mb-1">{booking.venueName}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {booking.venueLocation}
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-650 mb-5">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Check-in</span>
                    <span className="text-slate-800">{formatDate(booking.checkIn)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Check-out</span>
                    <span className="text-slate-800">{formatDate(booking.checkOut)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-auto pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {booking.guests} Guests
                  </span>

                  <div className="flex gap-2">
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <button 
                        onClick={(e) => handleCancelClick(e, booking.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-550 hover:text-red-650 border border-red-100 rounded-xl transition-all active:scale-95"
                        title="Cancel Reservation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95"
                    >
                      <Eye className="w-4 h-4" /> Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservation Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Reservation Receipt</h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="flex gap-4">
                <img 
                  src={selectedBooking.venueImage} 
                  alt={selectedBooking.venueName} 
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{selectedBooking.venueName}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5" /> {selectedBooking.venueLocation}
                  </p>
                  <div className="mt-2.5">
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-5 space-y-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-400">Booking Reference</span>
                  <span className="text-slate-800 select-all">#{selectedBooking.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-slate-800">
                    {formatDate(selectedBooking.checkIn)} — {formatDate(selectedBooking.checkOut)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-400">Guests</span>
                  <span className="text-slate-800">{selectedBooking.guests} Adults</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-100 pt-3 text-base">
                  <span className="text-slate-700">Total Paid</span>
                  <span className="text-ticket-orange">${selectedBooking.totalPaid} USD</span>
                </div>
              </div>

              {selectedBooking.hostName && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-ticket-yellow/20 flex items-center justify-center text-ticket-orange font-bold text-[10px]">
                      {selectedBooking.hostName.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-700">Host: {selectedBooking.hostName}</span>
                  </div>
                  <p className="text-xs text-slate-500 italic pl-8 leading-relaxed font-medium">
                    "{selectedBooking.hostMessage}"
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-slate-200 p-6 shadow-2xl animate-fade-in-up text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-150 flex items-center justify-center text-red-500 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800">Cancel Booking</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
              Are you sure you want to cancel this booking? This will immediately free up the reserved slot and process a refund if eligible.
            </p>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md shadow-red-200"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
