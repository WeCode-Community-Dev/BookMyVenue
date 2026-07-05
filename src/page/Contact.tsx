import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0c] pb-12">
      {/* Navigation */}
      <Navbar />

      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-32 sm:pt-40 flex flex-col lg:flex-row gap-12 items-center justify-between">
        
        {/* Left Side: Contact Information */}
        <div className="w-full lg:w-1/2 text-left">
          <h1
            className="font-normal leading-[0.95] text-white text-[2rem] sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] max-w-lg mb-6"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: '-0.035em' }}
          >
            Get in touch <span className="text-[#c5a059]">with us</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            Have questions about booking or listing a venue? Our support specialists are available 24/7.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wide">Email Us</h4>
                <p className="text-sm font-semibold text-white">support@bookmyvenue.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wide">Call Us</h4>
                <p className="text-sm font-semibold text-white">+1 (800) 555-VENUE</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wide">HQ Office</h4>
                <p className="text-sm font-semibold text-white">100 Luxury Avenue, San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Glassmorphic Form Card */}
        <div className="w-full lg:w-1/2 max-w-lg bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          {submitted ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] mb-6">
                <Mail className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-white/60 text-sm max-w-sm">
                Thank you for contacting us. A support representative will get back to you within 2-4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter your name"
                  className="w-full bg-[#0a0a0c]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email"
                  className="w-full bg-[#0a0a0c]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wide">Your Message</label>
                <textarea 
                  required 
                  rows={4}
                  placeholder="Tell us what you need help with..."
                  className="w-full bg-[#0a0a0c]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:border-[#c5a059] focus:outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#c5a059] hover:bg-[#ab8237] text-white text-sm font-semibold py-4 rounded-xl transition-all duration-300 shadow-md hover:scale-[1.01]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
