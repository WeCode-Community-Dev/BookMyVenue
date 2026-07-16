import React from 'react';
import { Sparkles } from 'lucide-react';

export function VenueHero() {
  return (
    <header className="relative py-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
     
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto w-full transition-all duration-500 animate-fade-in-up "
        >
        <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-semibold text-ticket-orange mb-6 shadow-sm animate-fade-in-up-stagger delay-0">
          <Sparkles className="w-3.5 h-3.5 text-ticket-yellow" /> Over 1,200 curated workspaces and events venues
        </span>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-slate-900 animate-fade-in-up-stagger delay-75">
         Find the Perfect Venue for <br />
          <span className="bg-gradient-to-r from-ticket-orange to-amber-500 bg-clip-text text-transparent">Every Occasion</span>
        </h1>
        <p className="mt-5 text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md animate-fade-in-up-stagger delay-150">
          From luxury penthouses and rooftop lounges to vineyards and creative studios, discover unique spaces designed to make your event unforgettable.
        </p>
      </div>

      
      <div className="mt-8 flex flex-wrap gap-4 items-center justify-center z-10 text-sm transition-all duration-500 animate-fade-in-up "
        style={{
          animationDelay: "0.4s",
        }}>
        <span className="bg-[#F7F5EE] border border-slate-250/80 text-slate-700 px-4 py-2 rounded-full font-medium shadow-sm hover:scale-105 transition-all cursor-default animate-fade-in-up-stagger delay-225">
          ✨ Premium Event Spaces
        </span>
        <span className="bg-[#F7F5EE] border border-slate-250/80 text-slate-700 px-4 py-2 rounded-full font-medium shadow-sm hover:scale-105 transition-all cursor-default animate-fade-in-up-stagger delay-300">
          📅 Instant Availability Checks
        </span>
        <span className="bg-[#F7F5EE] border border-slate-250/80 text-slate-700 px-4 py-2 rounded-full font-medium shadow-sm hover:scale-105 transition-all cursor-default animate-fade-in-up-stagger delay-375">
          🛡️ 100% Verified Hosts
        </span>
      </div>
    </header>
  );
}

export default VenueHero;
