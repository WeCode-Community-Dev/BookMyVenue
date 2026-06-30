"use client";

import React, { useState } from "react";
import { Star, Share2, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  startingPrice: number;
  rating: number;
  reviewCount: number;
}

export default function BookingCard({ startingPrice, rating, reviewCount }: BookingCardProps) {
  const [guests, setGuests] = useState("100");
  const [date, setDate] = useState("2026-07-15");
  const [showCalendar, setShowCalendar] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mock Booking requested! Date: ${date}, Estimated Guests: ${guests}. Loading mock payment checkout...`);
  };

  const handleShare = () => {
    alert("Share option triggered! Copy link to clipboard: " + window.location.href);
  };

  const handleSave = () => {
    alert("Saved venue to your wishlist!");
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-xl rounded-3xl p-6 space-y-5 sticky top-24 select-none hover:shadow-2xl transition-all duration-300">
      
      {/* Price and Ratings Row */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
            {formatPrice(startingPrice)}
          </span>
          <span className="text-xs font-semibold text-slate-500 block mt-0.5">
            starting from per event day
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-800">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span>{rating.toFixed(1)}</span>
          <span className="text-slate-400">({reviewCount})</span>
        </div>
      </div>

      {/* Booking Form Inputs */}
      <form onSubmit={handleBooking} className="space-y-4">
        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-250/70">
          
          {/* Date Selector */}
          <div className="p-3.5 space-y-1 relative">
            <label htmlFor="booking-date" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Event Date
            </label>
            <div className="flex items-center justify-between gap-2">
              <input
                id="booking-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-sm font-extrabold text-slate-800 outline-none w-full cursor-pointer"
                required
              />
              <Calendar className="size-4 text-slate-450 shrink-0" />
            </div>
          </div>

          {/* Guest Capacity Dropdown */}
          <div className="p-3.5 space-y-1">
            <label htmlFor="booking-guests" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Estimated Guests
            </label>
            <select
              id="booking-guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="bg-transparent text-sm font-extrabold text-slate-800 outline-none w-full cursor-pointer"
            >
              <option value="50">Up to 50 guests</option>
              <option value="100">50 - 150 guests</option>
              <option value="250">150 - 300 guests</option>
              <option value="500">300 - 500 guests</option>
              <option value="1000">More than 500 guests</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 rounded-2xl cursor-pointer shadow-md active:translate-y-px transition-all border-none text-sm tracking-wide"
        >
          Book Now
        </Button>
      </form>

      {/* Charged Footnote */}
      <p className="text-center text-[11px] font-semibold text-slate-400 mt-2 select-none">
        You won&apos;t be charged yet.
      </p>

      {/* Share / Wishlist grid button links */}
      <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 select-none">
        <button
          onClick={handleSave}
          type="button"
          className="flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white text-xs font-bold text-slate-600 hover:text-slate-800 transition cursor-pointer"
        >
          <Heart className="size-3.5 text-slate-500 hover:fill-rose-500 hover:text-rose-500" />
          <span>Save Venue</span>
        </button>

        <button
          onClick={handleShare}
          type="button"
          className="flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white text-xs font-bold text-slate-600 hover:text-slate-800 transition cursor-pointer"
        >
          <Share2 className="size-3.5 text-slate-500" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
