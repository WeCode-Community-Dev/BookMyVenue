"use client";

import Link from "next/link";
import { ChevronRight, Heart, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Space, VenueDetails } from "@/lib/data/venues";
import { cn } from "@/lib/utils";

type SpaceBookingBreadcrumbsProps = {
  venue: VenueDetails;
  space: Space;
};

export function SpaceBookingBreadcrumbs({
  venue,
  space,
}: SpaceBookingBreadcrumbsProps) {
  const [isSaved, setIsSaved] = useState(false);

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: space.name,
        url: window.location.href,
      }).catch(() => undefined);
    }
  }

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-on-surface-variant">
      <Link href="/venues" className="hover:text-on-surface transition-colors">
        Venues
      </Link>
      <ChevronRight className="size-4 shrink-0" />
      <Link
        href={`/venues/${venue.id}`}
        className="hover:text-on-surface transition-colors"
      >
        {venue.name}
      </Link>
      <ChevronRight className="size-4 shrink-0" />
      <span className="font-medium text-on-surface">{space.name}</span>

      <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:hidden">
        <Button type="button" variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsSaved((p) => !p)}
        >
          <Heart
            className={cn(
              "size-4",
              isSaved && "fill-destructive text-destructive",
            )}
          />
        </Button>
      </div>
    </nav>
  );
}
