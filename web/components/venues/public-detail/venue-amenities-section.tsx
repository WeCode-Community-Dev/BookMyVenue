import { Sparkles } from "lucide-react";

import type { VenueDetails } from "@/lib/data/venues";
import { venueAmenityIcons as amenityNameToIconKey } from "@/lib/data/list-venue";
import type { VenueAmenityIcon } from "@/lib/data/list-venue";
import { venueAmenityIcons } from "@/lib/venue-amenity-icons";

type VenueAmenitiesSectionProps = {
  venue: VenueDetails;
};

function getAmenityIcon(name: string) {
  const iconKey = amenityNameToIconKey[name] as VenueAmenityIcon | undefined;
  if (iconKey && venueAmenityIcons[iconKey]) {
    return venueAmenityIcons[iconKey];
  }
  return Sparkles;
}

export function VenueAmenitiesSection({ venue }: VenueAmenitiesSectionProps) {
  const amenities = venue.amenities;

  if (amenities.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-on-surface">
        What this venue offers
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {amenities.map((item) => {
          const Icon = getAmenityIcon(item.amenity.name);
          return (
            <div
              key={item.amenityId}
              className="flex items-center gap-3 text-sm text-on-surface"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
                <Icon className="size-5 text-surface-tint" />
              </span>
              <span>{item.amenity.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
