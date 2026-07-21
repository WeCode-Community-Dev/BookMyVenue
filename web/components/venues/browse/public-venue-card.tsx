"use client";

import {
  Heart,
  MapPin,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getImageUrl,
} from "@/lib/data/venue-detail";
import { cn } from "@/lib/utils";
import { BrowseVenueListItem, BrowseVenueSpace } from "@/services/venueServices";

type PublicVenueCardProps = {
  venue: BrowseVenueListItem;
  view: "grid" | "list";
};

const getStartingPrice = (spaces: BrowseVenueSpace[]): number|string => {
  const price = '—';
  if (spaces.length === 0) return price;
  let minPrice = Infinity;
  for (const space of spaces) {
    for(const spacePrice of space.spacePricing){
      if(spacePrice.pricingType == 'HOURLY'){
        minPrice = Math.min(minPrice, Number(spacePrice.amount));
      }
    }
  }
  return minPrice === Infinity ? price : minPrice;
}


export function PublicVenueCard({ venue, view }: PublicVenueCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const amenityLabels = venue.amenities.map((amenity) => amenity.name);


  const coverImage = venue.images[0];
  const locationLine = [venue.city, venue.address.split(",")[0]]
    .filter(Boolean)
    .join(", ");

  const capacityLabel = venue.spaces.length > 0 ?  `Max ${Math.max(...venue.spaces.map((space) =>  space.capacityValue ? Number(space.capacityValue) : 0))}` : '—';
  const startingPrice = getStartingPrice(venue.spaces);

  const imageSection = (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-container-low",
        view === "grid" ? "aspect-4/3 w-full" : "aspect-4/3 w-full sm:w-72 shrink-0",
      )}
    >
      {coverImage ? (
        <Image
          src={getImageUrl(coverImage.url)}
          alt={coverImage.altText || venue.name}
          fill
          className="object-cover"
          sizes={
            view === "grid"
              ? "(max-width: 640px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, 288px"
          }
        />
      ) : (
        <div className="flex h-full min-h-48 items-center justify-center text-on-surface-variant">
          No image
        </div>
      )}
      {/* {isAvailableToday && (
        <Badge
          className="absolute top-3 left-3 gap-1 border-transparent bg-surface-tint text-on-primary uppercase"
        >
          <Zap className="size-3" />
          Available Today
        </Badge>
      )} */}
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute top-3 right-3 size-9 rounded-full bg-white/90 shadow-sm hover:bg-white"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        onClick={() => setIsFavorite((prev) => !prev)}
      >
        <Heart
          className={cn(
            "size-4",
            isFavorite ? "fill-destructive text-destructive" : "text-on-surface",
          )}
        />
      </Button>
    </div>
  );

  const bodySection = (
    <CardContent
      className={cn(
        "flex flex-col gap-3 p-4",
        view === "list" && "flex-1",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold tracking-wider text-surface-tint uppercase">
          {/* {categoryLabel} */}
        </p>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-on-surface">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {/* {rating.toFixed(1)} */}
        </span>
      </div>

      <h3 className="text-base font-semibold text-on-surface">{venue.name}</h3>

      <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
        <MapPin className="size-3.5 shrink-0" />
        <span className="truncate">{locationLine}</span>
      </div>

      {amenityLabels.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
          {amenityLabels.map((label) => (
            <span key={label} className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 shrink-0 text-surface-tint" />
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
        <Users className="size-3.5 shrink-0" />
        {capacityLabel}
      </div>

      <div
        className={cn(
          "flex items-end justify-between gap-4 border-t border-outline-variant/40 pt-3",
          view === "list" && "mt-auto",
        )}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-on-surface-variant">Starting Price</span>
          <span className="text-lg font-bold text-on-surface">
            ${startingPrice}
            <span className="text-sm font-normal text-on-surface-variant">/hr</span>
          </span>
        </div>
        <Button
          type="button"
          asChild
          className="shrink-0 bg-surface-tint hover:bg-surface-tint/90"
        >
          <Link href={`/venues/${venue.id}`}>View Details</Link>
        </Button>
      </div>
    </CardContent>
  );

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0",
        view === "list" && "flex flex-col sm:flex-row",
      )}
    >
      {imageSection}
      {bodySection}
    </Card>
  );
}
