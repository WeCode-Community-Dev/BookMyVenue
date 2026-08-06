import { ListChecks } from "lucide-react";

import { venueAmenities, venueAmenityIcons } from "@/lib/data/list-venue";

import { ReviewAmenityPill } from "./review-amenity-pill";
import { ReviewSectionCard } from "./review-section-card";
import { AmenityResponse } from "@/services/venueServices";

type ReviewAmenitiesSectionProps = {
  selectedAmenityIds: string[];
  onEditStep: (step: number) => void;
  amenities: AmenityResponse;
};

export function ReviewAmenitiesSection({
  selectedAmenityIds,
  onEditStep,
  amenities,
}: ReviewAmenitiesSectionProps) {
  const selectedAmenities = amenities.filter((amenity) =>
    selectedAmenityIds.includes(amenity.id)
  );

  return (
    <ReviewSectionCard
      title="Amenities & Facilities"
      icon={ListChecks}
      onEdit={() => onEditStep(2)}
    >
      {selectedAmenities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedAmenities.map((amenity) => (
            <ReviewAmenityPill key={amenity.id} amenity={{ id: amenity.id, label: amenity.name, icon: venueAmenityIcons[amenity.name] }} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">No amenities selected</p>
      )}
    </ReviewSectionCard>
  );
}
