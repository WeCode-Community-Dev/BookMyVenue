import React, { useState } from 'react';
import VenueNavbar from '../venue-list/VenueNavbar';
import { Mail, Phone, MapPin, Send, Check, Globe } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API request delay
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-b from-[#D4CEB8] via-[#F4F1E6] to-[#FAF9F6] text-slate-800 selection:bg-ticket-yellow selection:text-slate-900 pb-20 relative overflow-x-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-ticket-orange/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-ticket-yellow/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navbar */}
      <VenueNavbar />

      <main className="max-w-5xl mx-auto px-6 md:px-12 mt-12 relative z-10">
        
        {/* Header Greeting */}
        <div className="mb-10 text-center animate-fade-in-up" style={{ opacity: 0 }}>
          <span className="text-xs font-bold text-ticket-orange uppercase tracking-widest pl-0.5">Contact Us</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
            We'd Love to Hear <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-850 to-ticket-orange">From You</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-3 max-w-xl mx-auto leading-relaxed">
            Have questions about our premium spaces, hosts, or booking process? Our customer success team is here to assist you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          
          {/* Left Column: Contact details card (Span 5) */}
          <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] space-y-6">
              
              <h3 className="text-xl font-bold text-slate-850 tracking-tight">Contact Information</h3>
              <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                Reach out to us directly or stop by our Oakland headquarters. We try to respond to all inquiries within 2 hours.
              </p>

              <hr className="border-slate-100" />

              {/* Info Elements */}
              <div className="space-y-4.5">
                <a 
                  href="tel:+15553049900"
                  className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/70 hover:bg-slate-100/70 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-ticket-orange/10 flex items-center justify-center text-ticket-orange group-hover:scale-105 transition-transform">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone</div>
                    <div className="text-xs md:text-sm font-bold text-slate-700">+1 (555) 304-9900</div>
                  </div>
                </a>

                <a 
                  href="mailto:support@ticketseats.com"
                  className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/70 hover:bg-slate-100/70 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-ticket-orange/10 flex items-center justify-center text-ticket-orange group-hover:scale-105 transition-transform">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</div>
                    <div className="text-xs md:text-sm font-bold text-slate-700">support@ticketseats.com</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/70">
                  <div className="w-10 h-10 rounded-xl bg-ticket-orange/10 flex items-center justify-center text-ticket-orange">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Headquarters</div>
                    <div className="text-xs md:text-sm font-bold text-slate-700">480 Grand Ave, Oakland, CA</div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Social Channels */}
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Connect on Socials</span>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-ticket-orange hover:border-ticket-orange/40 hover:bg-ticket-orange/5 transition-all duration-200 active:scale-95" title="Twitter / X">
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-ticket-orange hover:border-ticket-orange/40 hover:bg-ticket-orange/5 transition-all duration-200 active:scale-95" title="LinkedIn">
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-ticket-orange hover:border-ticket-orange/40 hover:bg-ticket-orange/5 transition-all duration-200 active:scale-95">
                    <Globe className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Us Form (Span 7) */}
          <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
              
              {status === 'success' ? (
                <div className="text-center py-10 px-4 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Message Sent!</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to TicketSeats. We have received your inquiry and a ticket has been created. A support specialist will follow up with you at your email address shortly.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl font-bold text-xs shadow-sm transition-all duration-200 active:scale-95"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-slate-850 tracking-tight pl-0.5">Send a Message</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Question regarding a booking or venue..."
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Your Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Provide detailed information regarding your inquiry..."
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-2 focus:ring-ticket-orange/20 transition-all outline-none text-slate-700 font-medium text-sm resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="w-full bg-ticket-yellow hover:bg-ticket-yellow/90 text-slate-900 py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(255,193,7,0.15)] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                        Sending message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
