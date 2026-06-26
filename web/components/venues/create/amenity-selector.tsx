"use client";

import { venueAmenities } from "@/lib/data/list-venue";

import { AmenityCard } from "./amenity-card";

type AmenitySelectorProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function AmenitySelector({ selectedIds, onChange }: AmenitySelectorProps) {
  function handleToggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {venueAmenities.map((amenity) => (
        <AmenityCard
          key={amenity.id}
          amenity={amenity}
          selected={selectedIds.includes(amenity.id)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
