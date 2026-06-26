import { ListChecks } from "lucide-react";

import { venueAmenities } from "@/lib/data/list-venue";

import { ReviewAmenityPill } from "./review-amenity-pill";
import { ReviewSectionCard } from "./review-section-card";

type ReviewAmenitiesSectionProps = {
  selectedAmenityIds: string[];
  onEditStep: (step: number) => void;
};

export function ReviewAmenitiesSection({
  selectedAmenityIds,
  onEditStep,
}: ReviewAmenitiesSectionProps) {
  const selectedAmenities = venueAmenities.filter((amenity) =>
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
            <ReviewAmenityPill key={amenity.id} amenity={amenity} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">No amenities selected</p>
      )}
    </ReviewSectionCard>
  );
}
