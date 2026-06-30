"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 transition duration-150 shadow-xs cursor-pointer select-none"
      >
        <MapPin className="size-3.5 text-rose-600" />
        <span>Kochi</span>
        <ChevronDown className={`size-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-100 shadow-lg py-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Select City</div>
          <button className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50/50">Kochi</button>
          <button className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">Bangalore</button>
          <button className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">Mumbai</button>
          <button className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">Delhi</button>
        </div>
      )}
    </div>
  );
}
