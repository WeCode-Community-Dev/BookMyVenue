"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { VenueDetails } from "@/lib/data/venues";
import {
  browseFiltersToSearchParams,
  defaultBrowseFilters,
  filterVenues,
  paginateVenues,
  parseBrowseFiltersFromSearchParams,
  sortVenues,
} from "@/lib/data/venues-browse";
import type {
  AmenityResponse,
  BrowseVenueListItem,
  PaginationMeta,
  SpaceCategoryResponse,
} from "@/services/venueServices";

import { PublicVenueCard } from "./public-venue-card";
import { VenuesBrowseFilters } from "./venues-browse-filters";
import { VenuesBrowseHeader } from "./venues-browse-header";
import { VenuesPagination } from "./venues-pagination";

type VenuesBrowseProps = {
  venues: BrowseVenueListItem[];
  meta: PaginationMeta;
};

export function VenuesBrowse({
  venues,
  meta
}: VenuesBrowseProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const filters = useMemo(() => {
  //   const params: Record<string, string | undefined> = {};
  //   searchParams.forEach((value, key) => {
  //     params[key] = value;
  //   });
  //   if (Object.keys(params).length === 0) {
  //     return parseBrowseFiltersFromSearchParams(initialSearchParams);
  //   }
  //   return parseBrowseFiltersFromSearchParams(params);
  // }, [searchParams, initialSearchParams]);

  // const syncFiltersToUrl = useCallback(
  //   (nextFilters: typeof filters) => {
  //     const params = browseFiltersToSearchParams(nextFilters);
  //     const query = new URLSearchParams(params).toString();
  //     router.push(query ? `/venues?${query}` : "/venues", { scroll: false });
  //   },
  //   [router],
  // );

  // const filtered = filterVenues(venues, filters);
  // const sorted = sortVenues(filtered, filters.sort);
  // const { items, totalPages } = paginateVenues(sorted, filters.page);

  // const categoryName = filters.categoryId
  //   ? categories.find((c) => c.id === filters.categoryId)?.name
  //   : undefined;

  // function handleFiltersChange(next: typeof filters) {
  //   syncFiltersToUrl(next);
  // }

  // function handleReset() {
  //   syncFiltersToUrl(defaultBrowseFilters);
  // }

  // function handlePageChange(page: number) {
  //   syncFiltersToUrl({ ...filters, page });
  // }

  // function handleViewChange(view: "grid" | "list") {
  //   syncFiltersToUrl({ ...filters, view });
  // }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      {/* <VenuesBrowseHeader
        totalCount={filtered.length}
        filters={filters}
        categoryName={categoryName}
        onViewChange={handleViewChange}
      /> */}

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full shrink-0 lg:w-72">
          <VenuesBrowseFilters
            // filters={filters}
            // categories={categories}
            // amenities={amenities}
            // onChange={handleFiltersChange}
            // onReset={handleReset}
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
                // filters.view === "grid" ?
                "grid gap-6 sm:grid-cols-2"
                  // : "flex flex-col gap-6"
              }
            >
              {venues.map((venue) => (
                <PublicVenueCard
                  key={venue.id}
                  venue={venue}
                  view={"grid"}
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
