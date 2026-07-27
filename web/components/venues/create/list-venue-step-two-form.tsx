"use client";

import { AmenityResponse } from "@/services/venueServices";
import { AmenitySelector } from "./amenity-selector";

type ListVenueStepTwoFormProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  amenities: AmenityResponse;
};

export function ListVenueStepTwoForm({
  selectedIds,
  onChange,
  amenities,
}: ListVenueStepTwoFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-on-surface">
          What does your venue offer?
        </h2>
        <p className="text-sm text-on-surface-variant">
          Select all the features that make your space stand out. Clear amenities
          help set the right expectations.
        </p>
      </div>
      <AmenitySelector selectedIds={selectedIds} onChange={onChange} amenities={amenities} />
    </div>
  );
}
