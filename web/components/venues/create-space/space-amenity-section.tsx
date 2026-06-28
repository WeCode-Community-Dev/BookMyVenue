"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { AmenityCard } from "@/components/venues/create/amenity-card";
import { Input } from "@/components/ui/input";
import { venueAmenityIcons } from "@/lib/data/list-venue";
import { fetchAmenities, type AmenityResponse } from "@/services/venueServices";

type SpaceAmenitySectionProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

const VISIBLE_TAG_LIMIT = 3;

export function SpaceAmenitySection({
  selectedIds,
  onChange,
}: SpaceAmenitySectionProps) {
  const [amenities, setAmenities] = React.useState<AmenityResponse>([]);
  const [query, setQuery] = React.useState("");
  const [showAllTags, setShowAllTags] = React.useState(false);

  React.useEffect(() => {
    fetchAmenities().then(setAmenities);
  }, []);

  const filteredAmenities = amenities.filter((amenity) =>
    amenity.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const selectedAmenities = amenities.filter((amenity) =>
    selectedIds.includes(amenity.id)
  );

  const visibleTags = showAllTags
    ? selectedAmenities
    : selectedAmenities.slice(0, VISIBLE_TAG_LIMIT);

  const hiddenTagCount = selectedAmenities.length - VISIBLE_TAG_LIMIT;

  function handleToggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );
  }

  function handleRemove(id: string) {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-xs self-end">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filteredAmenities.map((amenity) => (
          <AmenityCard
            key={amenity.id}
            amenity={{
              id: amenity.id,
              label: amenity.name,
              icon: venueAmenityIcons[amenity.name] ?? "wifi",
            }}
            selected={selectedIds.includes(amenity.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {selectedAmenities.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {visibleTags.map((amenity) => (
            <span
              key={amenity.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/30 px-3 py-1 text-sm font-medium text-surface-tint"
            >
              {amenity.name}
              <button
                type="button"
                onClick={() => handleRemove(amenity.id)}
                className="rounded-full p-0.5 transition-colors hover:bg-primary-container/50"
                aria-label={`Remove ${amenity.name}`}
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          {!showAllTags && hiddenTagCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowAllTags(true)}
              className="text-sm font-medium text-surface-tint hover:underline"
            >
              + {hiddenTagCount} more available
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
