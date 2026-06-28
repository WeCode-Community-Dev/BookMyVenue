"use client";

import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { BrowseFilters } from "@/lib/data/venues-browse";
import { buildResultsSubtitle } from "@/lib/data/venues-browse";
import { cn } from "@/lib/utils";

type VenuesBrowseHeaderProps = {
  totalCount: number;
  filters: BrowseFilters;
  categoryName?: string;
  onViewChange: (view: "grid" | "list") => void;
};

export function VenuesBrowseHeader({
  totalCount,
  filters,
  categoryName,
  onViewChange,
}: VenuesBrowseHeaderProps) {
  const subtitle = buildResultsSubtitle(filters, categoryName);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline-sm font-bold text-on-surface md:text-headline-md">
          {totalCount} Venues found
        </h1>
        <p className="text-body-sm text-on-surface-variant">{subtitle}</p>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-outline-variant/40 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-9",
            filters.view === "grid" && "bg-surface-container-low",
          )}
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
          aria-pressed={filters.view === "grid"}
        >
          <LayoutGrid className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-9",
            filters.view === "list" && "bg-surface-container-low",
          )}
          onClick={() => onViewChange("list")}
          aria-label="List view"
          aria-pressed={filters.view === "list"}
        >
          <List className="size-4" />
        </Button>
      </div>
    </div>
  );
}
