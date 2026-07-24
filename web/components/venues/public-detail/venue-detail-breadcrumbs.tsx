"use client";

import Link from "next/link";
import { ChevronRight, Heart, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { VenueDetails } from "@/lib/data/venues";
import { cn } from "@/lib/utils";

type VenueDetailBreadcrumbsProps = {
  venue: VenueDetails;
};

export function VenueDetailBreadcrumbs({ venue }: VenueDetailBreadcrumbsProps) {
  const [isSaved, setIsSaved] = useState(false);

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: venue.name,
        url: window.location.href,
      }).catch(() => undefined);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-on-surface-variant">
        <Link
          href="/venues"
          className="hover:text-on-surface transition-colors"
        >
          Venues
        </Link>
        <ChevronRight className="size-4 shrink-0" />
        <span className="font-medium text-on-surface truncate max-w-50 sm:max-w-none">
          {venue.name}
        </span>
      </nav>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleShare}
        >
          <Share2 className="size-3.5" />
          Share
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setIsSaved((prev) => !prev)}
          aria-pressed={isSaved}
        >
          <Heart
            className={cn(
              "size-3.5",
              isSaved && "fill-destructive text-destructive",
            )}
          />
          Save
        </Button>
      </div>
    </div>
  );
}
