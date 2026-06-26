import type { VenueAmenity } from "@/lib/data/list-venue";
import { venueAmenityIcons } from "@/lib/venue-amenity-icons";

type ReviewAmenityPillProps = {
  amenity: VenueAmenity;
};

export function ReviewAmenityPill({ amenity }: ReviewAmenityPillProps) {
  const Icon = venueAmenityIcons[amenity.icon];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-sm text-on-surface">
      <Icon className="size-3.5 text-on-surface-variant" />
      {amenity.label}
    </span>
  );
}
