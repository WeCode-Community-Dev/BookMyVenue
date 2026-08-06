"use client";

import type {
  BrowseVenueListItem,
  PaginationMeta,
} from "@/services/venueServices";

import { PublicVenueCard } from "./public-venue-card";
import { VenuesBrowseFilters } from "./venues-browse-filters";
import { VenuesBrowseHeader } from "./venues-browse-header";
import { VenuesPagination } from "./venues-pagination";
import { useState } from "react";
import { BrowseViewMode } from "@/lib/data/venues-browse";

type VenuesBrowseProps = {
  venues: BrowseVenueListItem[];
  meta: PaginationMeta;
};

export function VenuesBrowse({
  venues,
  meta
}: VenuesBrowseProps) {

  const [view, setView] = useState<BrowseViewMode>("grid");
  
  const handleViewChange = (view: BrowseViewMode) => {
    setView(view);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <VenuesBrowseHeader
        totalCount={meta.total}
        onViewChange={handleViewChange}
        view={view}
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full shrink-0 lg:w-72">
          <VenuesBrowseFilters
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {venues.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-surface-container-low p-12 text-center">
              <p className="text-body-md font-medium text-on-surface">
                No venues match your filters
              </p>
              <p className="text-body-sm text-on-surface-variant">
                Try adjusting your search or reset filters to see more results.
              </p>
            </div>
          ) : (
            <div
              className={
                view === "grid" ?
                "grid gap-6 sm:grid-cols-2"
                  : "flex flex-col gap-6"
              }
            >
              {venues.map((venue) => (
                <PublicVenueCard
                  key={venue.id}
                  venue={venue}
                  view={view}
                />
              ))}
            </div>
          )}

          <VenuesPagination
            meta={meta}
          />
        </div>
      </div>
    </div>
  );
}
