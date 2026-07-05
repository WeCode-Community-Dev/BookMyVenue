"use client";

import React from "react";
import { X } from "lucide-react";

interface SearchHeaderProps {
  totalCount: number;
  city: string;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  capacity: number | null;
  setCapacity: (cap: number | null) => void;
  rating: number | null;
  setRating: (rate: number | null) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  onClearAll: () => void;
}

export default function SearchHeader({
  totalCount,
  city,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  capacity,
  setCapacity,
  rating,
  setRating,
  selectedAmenities,
  setSelectedAmenities,
  onClearAll,
}: SearchHeaderProps) {
  
  // Build active filter pills list
  const activePills: { label: string; onRemove: () => void }[] = [];

  // City indicator (non-removable or removable. Let's make it show location)
  activePills.push({
    label: `📍 ${city}`,
    onRemove: () => {}, // City stays as search base
  });

  if (selectedCategory) {
    activePills.push({
      label: selectedCategory,
      onRemove: () => setSelectedCategory(null),
    });
  }

  // If price is restricted below maximum
  if (priceRange[1] < 300000) {
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(priceRange[1]);
    activePills.push({
      label: `Under ${formattedPrice}`,
      onRemove: () => setPriceRange([priceRange[0], 300000]),
    });
  }

  if (capacity !== null) {
    activePills.push({
      label: `${capacity}+ Guests`,
      onRemove: () => setCapacity(null),
    });
  }

  if (rating !== null) {
    activePills.push({
      label: `${rating}★+ Rating`,
      onRemove: () => setRating(null),
    });
  }

  selectedAmenities.forEach((amenity) => {
    activePills.push({
      label: amenity,
      onRemove: () => setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity)),
    });
  });

  const hasRemovableFilters = activePills.length > 1;

  return (
    <div className="space-y-3 select-none pb-4 border-b border-slate-100 mt-2">
      {/* Result Count Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
          Explore Venues
        </h1>
        <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-1.5">
          Find and book the perfect spaces for your events
        </p>
      </div>

      {/* Active Filter Pills List */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {activePills.map((pill, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 animate-in fade-in duration-150"
          >
            <span>{pill.label}</span>
            {pill.onRemove !== activePills[0].onRemove && (
              <button
                onClick={pill.onRemove}
                type="button"
                className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer"
                aria-label={`Remove ${pill.label} filter`}
              >
                <X className="size-3 stroke-[2.5px]" />
              </button>
            )}
          </div>
        ))}

        {/* Clear All Button */}
        {hasRemovableFilters && (
          <button
            onClick={onClearAll}
            type="button"
            className="text-xs font-extrabold text-rose-600 hover:text-rose-700 transition px-2.5 py-1.5 rounded-full hover:bg-rose-50/50 border border-transparent hover:border-rose-100/50 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
