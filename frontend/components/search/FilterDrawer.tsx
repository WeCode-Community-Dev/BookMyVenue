"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  capacity: number | null;
  setCapacity: (cap: number | null) => void;
  rating: number | null;
  setRating: (rate: number | null) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  capacity,
  setCapacity,
  rating,
  setRating,
  selectedAmenities,
  setSelectedAmenities,
  onApply,
  onReset,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  const amenitiesOptions = [
    "Parking",
    "Air Conditioning",
    "WiFi",
    "Catering",
    "Projector",
    "Stage",
    "Generator Backup",
    "Wheelchair Accessible",
  ];

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-100 flex justify-end select-none animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs cursor-default" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200 z-10">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-150 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Filters</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer"
            aria-label="Close filters panel"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          
          {/* Price Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Price Range</h3>
            <div className="space-y-2">
              <input
                type="range"
                min={1000}
                max={300000}
                step={5000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none"
              />
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 pt-1">
                <span>Min: {formatPrice(priceRange[0])}</span>
                <span>Max: {formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Capacity Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Guest Capacity</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Any", value: null },
                { label: "50+", value: 50 },
                { label: "150+", value: 150 },
                { label: "300+", value: 300 },
                { label: "500+", value: 500 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setCapacity(opt.value)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                    capacity === opt.value
                      ? "border-rose-600 bg-rose-50 text-rose-700 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-350 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ratings Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Rating</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Any", value: null },
                { label: "4.0★+", value: 4.0 },
                { label: "4.5★+", value: 4.5 },
                { label: "4.8★+", value: 4.8 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setRating(opt.value)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                    rating === opt.value
                      ? "border-rose-600 bg-rose-50 text-rose-700 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-350 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {amenitiesOptions.map((opt) => {
                const isChecked = selectedAmenities.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAmenityToggle(opt)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      isChecked
                        ? "border-rose-600 bg-rose-50/50 text-rose-700"
                        : "border-slate-250 bg-white text-slate-650 hover:border-slate-350"
                    }`}
                  >
                    <div className={`size-4 rounded flex items-center justify-center border shrink-0 ${
                      isChecked ? "border-rose-600 bg-rose-600 text-white" : "border-slate-300"
                    }`}>
                      {isChecked && <Check className="size-3 text-white stroke-[3px]" />}
                    </div>
                    <span className="line-clamp-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-150 flex items-center justify-between gap-4 bg-slate-50">
          <button
            onClick={onReset}
            type="button"
            className="text-xs sm:text-sm font-extrabold text-slate-500 hover:text-slate-900 transition underline underline-offset-2 border-0 bg-transparent cursor-pointer"
          >
            Clear All
          </button>
          
          <Button
            onClick={() => { onApply(); onClose(); }}
            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-10 px-6 rounded-xl cursor-pointer shadow-xs border-none"
          >
            Apply Filters
          </Button>
        </div>

      </div>
    </div>
  );
}
