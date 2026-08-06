"use client";

import { Heart, Share2, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Space } from "@/lib/data/venues";
import {
  getSpaceMaxGuests,
  isPremiumVenue,
} from "@/lib/data/public-venue-detail";
import { cn } from "@/lib/utils";

type SpaceBookingHeaderProps = {
  space: Space;
};

export function SpaceBookingHeader({ space }: SpaceBookingHeaderProps) {
  const [isSaved, setIsSaved] = useState(false);
  const guestLabel = getSpaceMaxGuests(space);
  const premium = isPremiumVenue();

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: space.name,
        url: window.location.href,
      }).catch(() => undefined);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-3">
        <h1 className="text-headline-md font-bold text-on-surface md:text-headline-lg">
          {space.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          {premium && (
            <Badge
              variant="secondary"
              className="bg-primary-container/40 text-surface-tint uppercase tracking-wide"
            >
              Premium Venue
            </Badge>
          )}
          {guestLabel && (
            <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
              <Users className="size-4" />
              {guestLabel}
            </span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleShare}
          aria-label="Share"
        >
          <Share2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setIsSaved((p) => !p)}
          aria-label="Save"
          aria-pressed={isSaved}
        >
          <Heart
            className={cn(
              "size-4",
              isSaved && "fill-destructive text-destructive",
            )}
          />
        </Button>
      </div>
    </div>
  );
}
