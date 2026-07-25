"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Sparkles, Users, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

interface SearchBarProps {
  variant?: "nav" | "hero";
  placeholder?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onFilterChange?: (filters: { category: string | null; city: string | null; capacity: number | null }) => void;
}

export function SearchBar({ variant = "nav", placeholder, searchQuery, setSearchQuery, onFilterChange }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSegment, setActiveSegment] = useState<"where" | "when" | "category" | "guests" | null>(null);

  const handleSearchSubmit = () => {
    if (pathname !== "/search") {
      router.push(`/search?q=${encodeURIComponent(searchQuery || "")}`);
    }
  };

  const handleHeroSearchSubmit = () => {
    const params = new URLSearchParams();
    if (selectedCity && selectedCity !== "Anywhere") params.set("city", selectedCity);
    if (selectedCategory && selectedCategory !== "What's the occasion?") params.set("category", selectedCategory);
    if (guestCount > 0) params.set("capacity", guestCount.toString());
    if (selectedDates && selectedDates !== "Add dates") params.set("date", selectedDates);
    
    router.push(`/search?${params.toString()}`);
  };
  
  // Selection States
  const [selectedCity, setSelectedCity] = useState<string>("Kochi");
  const [selectedDates, setSelectedDates] = useState<string>("Add dates");
  const [selectedCategory, setSelectedCategory] = useState<string>("What's the occasion?");
  const [guestCount, setGuestCount] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveSegment(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setActiveSegment("when"); // auto advance
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setActiveSegment("guests"); // auto advance
  };

  const handleGuestCountChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setGuestCount(prev => prev + 10);
    } else {
      setGuestCount(prev => Math.max(0, prev - 10));
    }
  };

  // Nav Variant: Simple normal input box (visible on all screens)
  if (variant === "nav") {
    return (
      <div className="flex items-center w-full max-w-[130px] xs:max-w-[170px] sm:max-w-xs md:max-w-md border border-slate-200 rounded-full py-1.5 pl-3.5 pr-1.5 shadow-xs hover:shadow-sm hover:border-slate-350 transition-all duration-200 bg-white gap-2">
        <input
          suppressHydrationWarning
          type="text"
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
          placeholder={placeholder || "Search venues..."}
          className="text-xs md:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-0 outline-none w-full focus:ring-0 p-0"
        />
        <div 
          onClick={handleSearchSubmit}
          className="bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 transition duration-150 shrink-0 cursor-pointer"
        >
          <Search className="size-3 md:size-3.5" />
        </div>
      </div>
    );
  }

  // Hero Variant (Redesigned & Interactive)
  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mt-8 z-30">
      <div 
        className={`w-full bg-white border border-slate-200/90 shadow-xl rounded-3xl md:rounded-full p-2 flex flex-col md:flex-row items-stretch md:items-center gap-1 transition-all duration-300 ${
          activeSegment ? "ring-4 ring-rose-50 shadow-2xl border-rose-200" : ""
        }`}
      >
        {/* Segment 1: Where */}
        <div 
          onClick={() => setActiveSegment("where")}
          className={`flex-1 px-5 py-2.5 rounded-2xl md:rounded-full flex items-center gap-3 cursor-pointer select-none transition ${
            activeSegment === "where" ? "bg-slate-50 shadow-xs" : "hover:bg-slate-50/70"
          }`}
        >
          <div className="p-2 bg-rose-50 text-rose-600 rounded-full shrink-0">
            <MapPin className="size-4" />
          </div>
          <div className="flex-grow text-left">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Where</label>
            <span className="text-sm font-semibold text-slate-700">{selectedCity}</span>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-100 shrink-0" />

        {/* Segment 2: When (Dates) */}
        <div 
          onClick={() => setActiveSegment("when")}
          className={`flex-1 px-5 py-2.5 rounded-2xl md:rounded-full flex items-center gap-3 cursor-pointer select-none transition ${
            activeSegment === "when" ? "bg-slate-50 shadow-xs" : "hover:bg-slate-50/70"
          }`}
        >
          <div className="p-2 bg-rose-50 text-rose-600 rounded-full shrink-0">
            <Calendar className="size-4" />
          </div>
          <div className="flex-grow text-left">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">When</label>
            <span className={`text-sm font-semibold ${selectedDates === "Add dates" ? "text-slate-400 font-medium" : "text-slate-700"}`}>
              {selectedDates}
            </span>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-100 shrink-0" />

        {/* Segment 3: Occasion (Category) */}
        <div 
          onClick={() => setActiveSegment("category")}
          className={`flex-1 px-5 py-2.5 rounded-2xl md:rounded-full flex items-center gap-3 cursor-pointer select-none transition ${
            activeSegment === "category" ? "bg-slate-50 shadow-xs" : "hover:bg-slate-50/70"
          }`}
        >
          <div className="p-2 bg-rose-50 text-rose-600 rounded-full shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div className="flex-grow text-left">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occasion</label>
            <span className={`text-sm font-semibold truncate block max-w-[130px] ${selectedCategory === "What's the occasion?" ? "text-slate-400 font-medium" : "text-slate-700"}`}>
              {selectedCategory}
            </span>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-100 shrink-0" />

        {/* Segment 4: Capacity */}
        <div 
          onClick={() => setActiveSegment("guests")}
          className={`flex-1 px-5 py-2.5 rounded-2xl md:rounded-full flex items-center gap-3 cursor-pointer select-none transition ${
            activeSegment === "guests" ? "bg-slate-50 shadow-xs" : "hover:bg-slate-50/70"
          }`}
        >
          <div className="p-2 bg-rose-50 text-rose-600 rounded-full shrink-0">
            <Users className="size-4" />
          </div>
          <div className="flex-grow text-left">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity</label>
            <span className={`text-sm font-semibold ${guestCount === 0 ? "text-slate-400 font-medium" : "text-slate-700"}`}>
              {guestCount === 0 ? "Add guests" : `${guestCount}+ guests`}
            </span>
          </div>
        </div>

        {/* Search CTA */}
        <Button 
          onClick={handleHeroSearchSubmit}
          className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl md:rounded-full h-12 md:h-14 px-6 md:px-8 gap-2 flex items-center justify-center font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all select-none cursor-pointer shrink-0"
        >
          <Search className="size-4" />
          <span>Find Space</span>
        </Button>
      </div>

      {/* Dropdown Overlays */}
      {activeSegment === "where" && (
        <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 text-left animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Locations</p>
          <div className="space-y-1">
            {["Kochi", "Bangalore", "Mumbai", "Delhi"].map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-700 font-semibold hover:bg-slate-50 hover:text-rose-600 transition text-left cursor-pointer"
              >
                <MapPin className="size-4 text-slate-400" />
                <span>{city}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSegment === "when" && (
        <div className="absolute top-full left-0 md:left-1/4 mt-3 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 text-left animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Select</p>
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {["This Weekend", "Next Weekend", "Next 30 Days"].map((opt) => (
              <button 
                key={opt}
                onClick={() => { setSelectedDates(opt); setActiveSegment("category"); }}
                className={`px-2 py-1.5 border rounded-xl text-[10px] font-bold text-slate-600 transition text-center cursor-pointer ${
                  selectedDates === opt ? "border-rose-600 bg-rose-50/50 text-rose-600" : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(prev => prev - 1);
                    } else {
                      setCurrentMonth(prev => prev - 1);
                    }
                  }}
                  className="p-1 rounded hover:bg-slate-100 cursor-pointer border-0 bg-transparent text-slate-600"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <p className="text-xs font-bold text-slate-800 w-28 text-center select-none">
                  {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(prev => prev + 1);
                    } else {
                      setCurrentMonth(prev => prev + 1);
                    }
                  }}
                  className="p-1 rounded hover:bg-slate-100 cursor-pointer border-0 bg-transparent text-slate-600"
                  aria-label="Next Month"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold select-none">Select event date</span>
            </div>
            
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1 select-none">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d}>{d}</div>)}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for starting offset */}
              {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Days List */}
              {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }).map((_, i) => {
                const dayNum = i + 1;
                const shortMonth = new Date(currentYear, currentMonth).toLocaleString("default", { month: "short" });
                const dateStr = `${shortMonth} ${dayNum}, ${currentYear}`;
                const isSelected = selectedDates === dateStr;

                return (
                  <button
                    type="button"
                    key={dayNum}
                    onClick={() => {
                      setSelectedDates(dateStr);
                      setActiveSegment("category");
                    }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition cursor-pointer border-0 bg-transparent ${
                      isSelected
                        ? "bg-rose-600 text-white shadow-xs"
                        : "text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSegment === "category" && (
        <div className="absolute top-full left-0 md:left-2/4 mt-3 w-72 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 text-left animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Event Type</p>
          <div className="grid grid-cols-2 gap-2">
            {["Wedding", "Birthday", "Conference", "Resort", "Party", "Cafe", "Auditorium"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="px-3 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:border-rose-350 hover:bg-rose-50/20 hover:text-rose-600 transition text-center cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSegment === "guests" && (
        <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 text-left animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">Total Guests</p>
              <p className="text-xs text-slate-400">Estimated capacity size</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleGuestCountChange("dec")}
                className="size-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-355 text-slate-600 active:scale-95 transition"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="text-sm font-bold text-slate-800 w-8 text-center">{guestCount}</span>
              <button 
                onClick={() => handleGuestCountChange("inc")}
                className="size-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-355 text-slate-600 active:scale-95 transition"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
          <div className="border-t border-slate-100 mt-4 pt-3 flex justify-end">
            <button 
              onClick={() => setActiveSegment(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 transition"
            >
              Apply Guests
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

