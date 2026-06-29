import { Sparkles } from "lucide-react";

import type { Space, VenueDetails } from "@/lib/data/venues";
import { venueAmenityIcons as amenityNameToIconKey } from "@/lib/data/list-venue";
import type { VenueAmenityIcon } from "@/lib/data/list-venue";
import { getSpaceAmenities } from "@/lib/data/public-venue-detail";
import { venueAmenityIcons } from "@/lib/venue-amenity-icons";

type SpaceAmenitiesPanelProps = {
  space: Space;
  venue: VenueDetails;
};

function getAmenityIcon(name: string) {
  const iconKey = amenityNameToIconKey[name] as VenueAmenityIcon | undefined;
  if (iconKey && venueAmenityIcons[iconKey]) {
    return venueAmenityIcons[iconKey];
  }
  return Sparkles;
}

export function SpaceAmenitiesPanel({ space, venue }: SpaceAmenitiesPanelProps) {
  const amenities = getSpaceAmenities(space, venue);

  if (amenities.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-on-surface">Amenities</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {amenities.map((amenity) => {
          const Icon = getAmenityIcon(amenity.name);
          return (
            <div
              key={amenity.id}
              className="flex items-center gap-3 rounded-lg bg-primary-container/20 p-3"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-container/40">
                <Icon className="size-5 text-surface-tint" />
              </span>
              <span className="text-sm font-medium text-on-surface">
                {amenity.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
