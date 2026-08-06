"use client";

import type { VenueAmenity } from "@/lib/data/list-venue";
import { venueAmenityIcons } from "@/lib/venue-amenity-icons";
import { cn } from "@/lib/utils";

type AmenityCardProps = {
  amenity: VenueAmenity;
  selected: boolean;
  onToggle: (id: string) => void;
};

export function AmenityCard({ amenity, selected, onToggle }: AmenityCardProps) {
  const Icon = venueAmenityIcons[amenity.icon];

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(amenity.id)}
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-colors",
        selected
          ? "border-surface-tint bg-primary-container/30"
          : "border-outline-variant bg-background hover:bg-surface-container-low"
      )}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          selected
            ? "bg-surface-tint text-on-primary"
            : "bg-surface-container text-muted-foreground"
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="text-sm font-medium text-on-surface">{amenity.label}</span>
    </button>
  );
}
