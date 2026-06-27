"use client";

import { useMemo, useState } from "react";

import type { VenueDetails } from "@/lib/data/venues";
import {
  computeVenueStats,
  filterSpacesByCategory,
  getUniqueCategories,
} from "@/lib/data/venue-detail";

import { AddSpaceCard } from "./add-space-card";
import { SpaceCard } from "./space-card";
import { VenueCategoryFilter } from "./venue-category-filter";
import { VenueSpacesStats } from "./venue-spaces-stats";

type VenueSpacesTabProps = {
  venue: VenueDetails;
};

export function VenueSpacesTab({ venue }: VenueSpacesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const stats = useMemo(() => computeVenueStats(venue), [venue]);
  const categories = useMemo(
    () => getUniqueCategories(venue.spaces),
    [venue.spaces],
  );
  const filteredSpaces = useMemo(
    () => filterSpacesByCategory(venue.spaces, selectedCategory),
    [venue.spaces, selectedCategory],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="flex flex-col gap-4">
        <VenueSpacesStats stats={stats} />
        <VenueCategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </aside>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSpaces.map((space) => (
          <SpaceCard key={space.id} space={space} venueId={venue.id} />
        ))}
        <AddSpaceCard venueId={venue.id} />
      </div>
    </div>
  );
}
