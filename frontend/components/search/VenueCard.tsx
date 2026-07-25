"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Users, MapPin, Heart, BadgeCheck } from "lucide-react";
import { Venue } from "@/types";
import { Badge } from "@/components/ui/badge";

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const [isFavorite, setIsFavorite] = useState(venue.favorite || false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents card navigation
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    alert(isFavorite ? "Removed from Wishlist!" : "Added to Wishlist!");
  };

  // Preview only the first 3 amenities
  const amenitiesPreview = (venue.amenities || []).slice(0, 3);

  return (
    <Link href={`/venue/${venue.id}`} className="group bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-350 flex flex-col h-full select-none hover:-translate-y-1">
      
      {/* Thumbnail and Tags container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 shrink-0">
        <Image
          src={venue.thumbnail}
          alt={venue.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Category Tag Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1 max-w-[80%]">
          {venue.categories && venue.categories.length > 0 ? (
            venue.categories.map((cat) => (
              <Badge key={cat} variant="rose" className="shadow-sm backdrop-blur-md bg-white/90 border-slate-200/50 text-[10px] py-0.5 px-2 font-bold">
                {cat}
              </Badge>
            ))
          ) : (
            <Badge variant="rose" className="shadow-sm backdrop-blur-md bg-white/90 border-slate-200/50 text-[10px] py-0.5 px-2 font-bold">
              {venue.category}
            </Badge>
          )}
        </div>

        {/* Favorite Heart Button Overlay */}
        <button
          onClick={handleFavoriteClick}
          type="button"
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs shadow-xs text-slate-400 hover:text-rose-600 transition active:scale-90 border-0 cursor-pointer"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`size-4 ${isFavorite ? "fill-rose-600 text-rose-600" : ""}`} />
        </button>

        {/* Verified Owner Badge Icon */}
        {venue.verified && (
          <div className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider border border-white/10">
            <BadgeCheck className="size-3.5 fill-rose-600 text-white shrink-0" />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        
        {/* Info Column */}
        <div className="space-y-2">
          
          {/* Rating statistics */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-800">{venue.rating.toFixed(1)}</span>
            <span className="text-slate-400">({venue.reviewCount} reviews)</span>
          </div>

          {/* Title and location */}
          <div>
            <h3 className="font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 text-base leading-snug">
              {venue.name}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 mt-1.5">
              <MapPin className="size-3.5 text-slate-400 shrink-0" />
              <span className="text-xs font-bold line-clamp-1">
                {venue.area ? `${venue.area}, ` : ""}{venue.city}
              </span>
            </div>
          </div>

          {/* Amenities checklist previews */}
          {amenitiesPreview.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
              {amenitiesPreview.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/30"
                >
                  {amenity}
                </span>
              ))}
              {venue.amenities && venue.amenities.length > 3 && (
                <span className="text-[10px] font-bold text-slate-400">
                  +{venue.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer specs (Capacity & Price) */}
        <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2 shrink-0">
          
          {/* Capacity guest limit */}
          <div className="flex items-center gap-1.5 text-slate-650 text-xs font-bold">
            <Users className="size-3.5 text-slate-400 shrink-0" />
            <span>Up to {venue.capacity} guests</span>
          </div>

          {/* Starting rate */}
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-0.5">Starts at</p>
            <p className="text-sm font-extrabold text-slate-900 leading-tight">
              {formatPrice(venue.startingPrice)}
              <span className="text-[10px] text-slate-500 font-normal">/day</span>
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
}
