import React, { useState } from 'react';
import { 
  X, MapPin, Star, Users, CheckCircle2, Calendar, Clock 
} from 'lucide-react';

export function VenueDetailModal({ venue, onClose }) {
  // Local active image state for the preview gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking states
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const calculateHours = () => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startDecimal = startH + startM / 60;
    const endDecimal = endH + endM / 60;
    const diff = endDecimal - startDecimal;
    return diff > 0 ? diff : 0;
  };

  const calculateTotal = (pricePerHour) => {
    const hours = calculateHours();
    const subtotal = hours * pricePerHour;
    const serviceFee = subtotal * 0.08;
    return {
      hours: hours.toFixed(1),
      subtotal: Math.round(subtotal),
      serviceFee: Math.round(serviceFee),
      total: Math.round(subtotal + serviceFee)
    };
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!bookingDate) {
      alert("Please select a date for your inquiry.");
      return;
    }
    if (calculateHours() <= 0) {
      alert("End time must be after the start time.");
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onClose();
      setBookingDate("");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative bg-[#F7F5EE] border border-slate-200 max-w-3xl w-full rounded-3xl shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] overflow-y-auto md:overflow-hidden animate-fade-in-up"
        style={{ animationDuration: '0.4s' }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-[#F7F5EE] hover:bg-slate-100 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery & Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col gap-6 md:overflow-y-auto custom-scrollbar">
          
          {/* Image Hero Gallery */}
          <div className="relative h-60 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 animate-fade-in-up-stagger delay-75">
            <img 
              src={venue.images[activeImageIndex]} 
              alt={venue.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-ticket-yellow text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {venue.category}
              </span>
              <h4 className="text-white font-bold text-lg mt-1">{venue.name}</h4>
            </div>
          </div>
 
          {/* Smaller Preview Gallery */}
          <div className="grid grid-cols-3 gap-2 flex-shrink-0 animate-fade-in-up-stagger delay-100">
            {venue.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImageIndex(i)}
                className={`h-16 rounded-xl overflow-hidden border cursor-pointer hover:border-ticket-orange/50 transition-colors ${
                  activeImageIndex === i ? 'border-ticket-orange shadow-sm' : 'border-slate-200'
                }`}
              >
                <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
 
          {/* Description */}
          <div className="animate-fade-in-up-stagger delay-150">
            <span className="text-ticket-orange font-bold text-xs uppercase tracking-wider">{venue.type}</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 leading-snug">{venue.name}</h3>
            
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
              <MapPin className="w-4 h-4 text-ticket-orange" />
              <span>{venue.location}</span>
            </div>
 
            <div className="flex items-center gap-4 text-sm mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-ticket-yellow text-ticket-yellow" />
                <span className="text-slate-900 font-bold">{venue.rating}</span>
                <span className="text-slate-400">({venue.reviewsCount} reviews)</span>
              </div>
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
              <div className="flex items-center gap-1 text-slate-650">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Up to {venue.capacity} guests</span>
              </div>
            </div>
 
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              {venue.description}
            </p>
          </div>
 
          {/* Amenities */}
          <div className="animate-fade-in-up-stagger delay-225">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Amenities Included</h4>
            <div className="flex flex-wrap gap-2">
              {venue.amenities.map((amenity, i) => (
                <span 
                  key={i} 
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-650 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-ticket-orange"></span>
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>
 
        {/* Right Column: Pricing & Inquiry Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-slate-50 md:overflow-y-auto custom-scrollbar animate-fade-in-up-stagger delay-300">
          
          {bookingSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-6 animate-pulse">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Inquiry Submitted!</h3>
              <p className="text-slate-500 text-sm max-w-xs">
                We've received your request for {venue.name}. The host will review and contact you shortly.
              </p>
              <div className="mt-6 bg-[#FAF9F6] border border-slate-200 rounded-2xl p-4 text-left w-full text-xs space-y-1 shadow-sm">
                <div className="text-slate-400 font-bold">Inquiry Summary:</div>
                <div><span className="text-slate-500">Date:</span> {bookingDate}</div>
                <div><span className="text-slate-500">Hours:</span> {calculateHours().toFixed(1)} hrs ({startTime} - {endTime})</div>
                <div><span className="text-slate-500">Est. Total:</span> ${calculateTotal(venue.price).total}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="flex-1 flex flex-col h-full justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-ticket-orange" /> Request Booking Inquiry
                </h3>
                
                <div className="space-y-4">
                  {/* Date Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input 
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 pl-12 pr-4 text-slate-800 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Start / End Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input 
                          type="time"
                          required
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 pl-12 pr-4 text-slate-800 text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input 
                          type="time"
                          required
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 pl-12 pr-4 text-slate-800 text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Pricing Summary */}
              {bookingDate && calculateHours() > 0 ? (
                <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm animate-fade-in text-sm">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Rate per hour</span>
                    <span className="font-bold text-slate-800">${venue.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Duration</span>
                    <span className="font-bold text-slate-800">{calculateTotal(venue.price).hours} hours</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">${calculateTotal(venue.price).subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Service fee (8%)</span>
                    <span className="font-bold text-slate-800">${calculateTotal(venue.price).serviceFee}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base font-bold">
                    <span className="text-ticket-orange">Estimated Total</span>
                    <span className="text-2xl font-black text-slate-900">${calculateTotal(venue.price).total}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAF9F6] border border-slate-150 rounded-2xl p-4 text-center text-xs text-slate-400">
                  Select date and valid hours to view pricing estimator.
                </div>
              )}

              {/* Submission Buttons */}
              <div className="space-y-3">
                <button 
                  type="submit"
                  className="w-full bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 py-4 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-[0.98]"
                >
                  Send Booking Inquiry
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full bg-transparent border border-slate-200 hover:bg-slate-100 text-slate-650 py-3 rounded-xl font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default VenueDetailModal;
