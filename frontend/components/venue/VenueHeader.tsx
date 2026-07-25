import React from "react";
import { Star, MapPin, Share, Heart } from "lucide-react";
import { Venue } from "@/types";
import { Badge } from "@/components/ui/badge";

interface VenueHeaderProps {
  venue: Venue;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  const handleShare = () => {
    alert("Share option triggered! Copy link to clipboard: " + window.location.href);
  };

  const handleSave = () => {
    alert("Saved venue to your wishlist!");
  };

  return (
    <div className="space-y-3 pb-6 border-b border-slate-200/80">
      {/* Category Badge & Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1">
          {venue.categories && venue.categories.length > 0 ? (
            venue.categories.map((cat) => (
              <Badge key={cat} variant="rose" className="font-extrabold uppercase px-3 py-1 tracking-wider text-[11px]">
                {cat}
              </Badge>
            ))
          ) : (
            <Badge variant="rose" className="font-extrabold uppercase px-3 py-1 tracking-wider text-[11px]">
              {venue.category}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition hover:bg-slate-100/80 px-2.5 py-1.5 rounded-lg border-0 bg-transparent cursor-pointer"
          >
            <Share className="size-3.5" />
            <span>Share</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition hover:bg-slate-100/80 px-2.5 py-1.5 rounded-lg border-0 bg-transparent cursor-pointer"
          >
            <Heart className="size-3.5 text-slate-500 hover:fill-rose-500 hover:text-rose-500" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
        {venue.name}
      </h1>

      {/* Meta Indicators */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 select-none">
        <div className="flex items-center gap-1">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="text-slate-950 font-bold">{venue.rating.toFixed(1)}</span>
          <span className="text-slate-400">({venue.reviewCount} reviews)</span>
        </div>
        <div className="hidden sm:block text-slate-300">•</div>
        <div className="flex items-center gap-1">
          <MapPin className="size-4 text-slate-400 shrink-0" />
          <span className="underline hover:text-rose-600 transition duration-150 cursor-pointer">
            {venue.address || `${venue.city}, Kerala, India`}
          </span>
        </div>
      </div>
    </div>
  );
}
