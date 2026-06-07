// src/components/venues/search-bar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { MapPin, Users, Search, Loader2 } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      const params = new URLSearchParams();
      
      if (location.trim()) params.set("location", location.trim());
      if (guests) params.set("guests", guests);

      router.push(`/venues?${params.toString()}`);
    });
  };

  return (
    <form 
      onSubmit={handleSearchSubmit}
      className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl md:rounded-full p-2 md:pl-6 shadow-xl 
      flex flex-col md:flex-row items-center gap-2 md:gap-0 transition-all focus-within:border-gray-300">
      <div className="w-full flex items-center gap-3 px-2 py-2 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group">
        <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Where</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search cities or spaces..."
            className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>

      <div className="w-full flex items-center gap-3 px-2 md:pl-6 py-2 md:py-0 group">
        <Users className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Who</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="Add guest count"
            className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-auto bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-sm rounded-xl md:rounded-full px-6 py-3 md:py-4 flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span>Search</span>
      </button>
    </form>
  );
}