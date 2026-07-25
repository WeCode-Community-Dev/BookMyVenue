"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function WishlistTab() {
  const { wishlist, venues, toggleWishlist } = useAuth();

  const wishlistedVenues = venues.filter((v) => wishlist.includes(v.id));

  return (
    <div className="space-y-6 select-none">
      <div className="text-left">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          My Wishlist
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
          Spaces you have saved for your future event plans
        </p>
      </div>

      {wishlistedVenues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistedVenues.map((venue) => {
            const formattedPrice = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(venue.startingPrice);

            return (
              <div
                key={venue.id}
                className="group relative bg-white border border-slate-200/60 shadow-xs rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-200"
              >
                {/* Photo Thumbnail with heart */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={venue.thumbnail}
                    alt={venue.name}
                    fill
                    className="object-cover transition-transform duration-350 group-hover:scale-105"
                  />
                  {/* Floating heart icon */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(venue.id);
                    }}
                    className="absolute top-2.5 right-2.5 size-8 rounded-full bg-white/90 hover:bg-white text-rose-600 shadow-xs flex items-center justify-center transition active:scale-90 border-none cursor-pointer"
                    aria-label="Remove from Wishlist"
                  >
                    <Heart className="size-4.5 fill-rose-600 stroke-rose-600" />
                  </button>
                </div>

                {/* Info Text */}
                <Link href={`/venue/${venue.id}`} className="block p-4 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {venue.categories && venue.categories.length > 0 ? venue.categories.join(", ") : venue.category}
                    </span>
                    <div className="flex items-center gap-1 text-slate-900 font-bold text-xs">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      <span>{venue.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight group-hover:text-rose-600 transition truncate">
                    {venue.name}
                  </h3>

                  <div className="text-[11px] font-semibold text-slate-400">
                    {venue.city}, India
                  </div>

                  <div className="border-t border-slate-100/60 pt-2 flex items-baseline gap-1 select-none">
                    <span className="text-sm font-black text-slate-900">{formattedPrice}</span>
                    <span className="text-[10px] text-slate-400 font-bold">/ day onwards</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-150/50 rounded-2xl py-12 px-6 text-center text-slate-450 font-semibold text-sm max-w-lg mx-auto space-y-3">
          <Heart className="size-8 text-slate-300 mx-auto" />
          <p>Your wishlist is empty.</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Click the heart icon on any venue card while browsing the home page or search listings to save spaces here.
          </p>
        </div>
      )}
    </div>
  );
}
