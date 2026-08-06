"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { VenueDetails } from "@/lib/data/venues";

const PREVIEW_LENGTH = 280;

type VenueAboutSectionProps = {
  venue: VenueDetails;
};

export function VenueAboutSection({ venue }: VenueAboutSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const description = venue.description?.trim() || "No description available.";
  const needsTruncate = description.length > PREVIEW_LENGTH;
  const displayText =
    expanded || !needsTruncate
      ? description
      : `${description.slice(0, PREVIEW_LENGTH).trim()}...`;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-on-surface">About this venue</h2>
      <p className="text-body-md text-on-surface-variant leading-relaxed">
        {displayText}
      </p>
      {needsTruncate && (
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-surface-tint"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "Read more"}
        </Button>
      )}
    </section>
  );
}
