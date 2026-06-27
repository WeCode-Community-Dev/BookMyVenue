"use client";


import { venueAmenityIcons } from "@/lib/data/list-venue";
import { AmenityCard } from "./amenity-card";
import { AmenityResponse, fetchAmenities } from "@/services/venueServices";
import { useEffect, useState } from "react";

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

  const [amenities, setAmenities] = useState<AmenityResponse>([]);

  useEffect(() => {
    fetchAmenities().then((response: AmenityResponse) => {
      setAmenities(response);
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {amenities.map((amenity) => (
        <AmenityCard
          key={amenity.id}
          amenity={{ id: amenity.id, label: amenity.name, icon: venueAmenityIcons[amenity.name] }}
          selected={selectedIds.includes(amenity.id)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
