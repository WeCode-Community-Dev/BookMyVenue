import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Users, MapPin } from "lucide-react";
import { Venue } from "@/types";
import { Badge } from "@/components/ui/badge";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/venue/${venue.id}`} className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video sm:aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={venue.thumbnail}
          alt={venue.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          priority={false}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="rose" className="shadow-xs backdrop-blur-md bg-white/90 border-slate-200/50">
            {venue.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-800">{venue.rating.toFixed(1)}</span>
            <span className="text-slate-400">({venue.reviewCount} reviews)</span>
          </div>

          {/* Title & City */}
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 text-[15px] sm:text-base leading-snug">
              {venue.name}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 mt-1">
              <MapPin className="size-3 text-slate-400 shrink-0" />
              <span className="text-xs font-medium">{venue.city}</span>
            </div>
          </div>
        </div>

        {/* Capacity and Price Footer */}
        <div className="border-t border-slate-100 pt-3.5 mt-4 flex items-center justify-between gap-2">
          {/* Capacity */}
          <div className="flex items-center gap-1 text-slate-600 text-xs font-medium">
            <Users className="size-3.5 text-slate-400 shrink-0" />
            <span>Up to {venue.capacity} guests</span>
          </div>

          {/* Pricing */}
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-0.5">Starts at</p>
            <p className="text-[13px] sm:text-sm font-extrabold text-slate-900 leading-tight">
              {formatPrice(venue.startingPrice)}
              <span className="text-[10px] text-slate-500 font-normal">/day</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
