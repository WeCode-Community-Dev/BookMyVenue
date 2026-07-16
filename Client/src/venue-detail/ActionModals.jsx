import React, { useState } from 'react';
import { X, CheckCircle, Mail, Phone, User, Calendar, Clock, Sparkles } from 'lucide-react';

export function ActionModals({ 
  type, // 'contact' or 'tour'
  venue,
  onClose 
}) {
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I am interested in inquiring about lease details for ${venue.name}. Please contact me as soon as possible.`,
    tourDate: '',
    tourTime: '10:00 AM'
  });

  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate submission validation
    if (type === 'contact') {
      if (!formData.name || !formData.email) {
        alert("Please fill out your Name and Email address.");
        return;
      }
    } else {
      if (!formData.name || !formData.tourDate) {
        alert("Please fill out your Name and select a Tour Date.");
        return;
      }
    }

    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-[#FAF9F6] border border-slate-200 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative animate-fade-in-up"
        style={{ animationDuration: '0.35s' }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 bg-white/80 hover:bg-white text-slate-500 w-8 h-8 rounded-full flex items-center justify-center border border-slate-200/60 shadow-sm transition-colors active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          /* Success Panel */
          <div className="p-8 text-center flex flex-col items-center gap-4 py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-250 flex items-center justify-center mb-2 animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800">
              {type === 'contact' ? 'Inquiry Submitted!' : 'Tour Scheduled!'}
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              {type === 'contact' 
                ? `Thank you for reaching out! A dedicated agent will review your inquiry for ${venue.name} and get back to you within 24 hours at ${formData.email}.`
                : `Awesome! Your booking tour at ${venue.name} is scheduled for ${formData.tourDate} at ${formData.tourTime}. We have sent a confirmation email to ${formData.email}.`
              }
            </p>
            
            <button
              onClick={onClose}
              className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-8 rounded-xl shadow-md transition-colors active:scale-95"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-5">
            <div>
              <div className="text-[10px] font-black text-ticket-orange uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Direct Request
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-1">
                {type === 'contact' ? 'Contact Property Agent' : 'Schedule a Private Tour'}
              </h3>
              <p className="text-xs text-slate-450 mt-1 leading-snug">
                {type === 'contact' 
                  ? `Send a message to receive detailed specifications and lease contracts for ${venue.name}.`
                  : `Select a preferred day and time window for a private guide through ${venue.name}.`
                }
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5">
              {/* Name */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 pl-11 pr-4 text-slate-700 text-xs font-bold transition-all outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 pl-11 pr-4 text-slate-700 text-xs font-bold transition-all outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 pl-11 pr-4 text-slate-700 text-xs font-bold transition-all outline-none"
                  />
                </div>
              </div>

              {/* Conditional Inputs */}
              {type === 'contact' ? (
                /* Message for Contact form */
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Message</label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-2.5 px-4 text-slate-700 text-xs font-bold transition-all outline-none resize-none"
                  />
                </div>
              ) : (
                /* Date & Time for Tour Scheduler */
                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Tour Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                      <input
                        type="date"
                        name="tourDate"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.tourDate}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 pl-9 pr-2 text-slate-700 text-[10px] font-black transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Preferred Time</label>
                    <div className="relative">
                      <select
                        name="tourTime"
                        value={formData.tourTime}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-xl py-3 px-3 pr-8 text-slate-700 text-[10px] font-black appearance-none cursor-pointer transition-all outline-none"
                      >
                        {timeSlots.map((slot, idx) => (
                          <option key={idx} value={slot}>{slot}</option>
                        ))}
                      </select>
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 py-3.5 rounded-xl font-bold text-xs transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-xs transition-colors shadow-sm active:scale-[0.98]"
              >
                {type === 'contact' ? 'Submit Inquiry' : 'Confirm Tour'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ActionModals;
