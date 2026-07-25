import React from "react";
import { Map, MapPin } from "lucide-react";

export default function MapPlaceholder() {
  // Mock pin offsets to make it look like a map view
  const mockPins = [
    { top: "25%", left: "30%", price: "₹1,50L" },
    { top: "45%", left: "65%", price: "₹75K" },
    { top: "60%", left: "20%", price: "₹20K" },
    { top: "35%", left: "80%", price: "₹1,80L" },
    { top: "75%", left: "55%", price: "₹12K" },
  ];

  return (
    <div className="relative w-full h-full bg-slate-50 border border-slate-200/60 rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center select-none shadow-xs">
      
      {/* Visual map coordinate grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />
      <div className="absolute inset-0 bg-linear-to-b from-rose-500/5 to-transparent pointer-events-none" />

      {/* Floating Mock Venue Price Pins */}
      {mockPins.map((pin, idx) => (
        <div
          key={idx}
          className="absolute flex flex-col items-center animate-in zoom-in duration-300"
          style={{ top: pin.top, left: pin.left }}
        >
          <div className="bg-slate-900 border border-slate-750 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-0.5 whitespace-nowrap active:scale-95 transition-transform cursor-pointer">
            <MapPin className="size-2.5 text-rose-500 fill-rose-500" />
            <span>{pin.price}</span>
          </div>
          {/* Subtle triangle indicator */}
          <div className="size-1.5 bg-slate-900 rotate-45 -mt-1 shadow-sm" />
        </div>
      ))}

      {/* Center Coming Soon Panel Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md border border-slate-200/55 shadow-xl rounded-2xl p-6 text-center max-w-xs mx-4 space-y-4">
        <div className="mx-auto size-12 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100/50">
          <Map className="size-6 text-rose-600" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Interactive Map Coming Soon</h4>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Airbnb-style location pinning, area listings, and direct street distance mapping will be integrated soon.
          </p>
        </div>
      </div>
    </div>
  );
}
