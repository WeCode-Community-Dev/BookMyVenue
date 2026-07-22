"use client";

import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VenuesBrowseHeaderProps = {
  totalCount: number;
  onViewChange: (view: "grid" | "list") => void;
  view: "grid" | "list";
};

export function VenuesBrowseHeader({
  totalCount,
  onViewChange,
  view,
}: VenuesBrowseHeaderProps) {

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline-sm font-bold text-on-surface md:text-headline-md">
          {totalCount} Venues found
        </h1>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-outline-variant/40 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-9",
            view === "grid" && "bg-surface-container-low",
          )}
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
          aria-pressed={view === "grid"}
        >
          <LayoutGrid className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-9",
            view === "list" && "bg-surface-container-low",
          )}
          onClick={() => onViewChange("list")}
          aria-label="List view"
          aria-pressed={view === "list"}
        >
          <List className="size-4" />
        </Button>
      </div>
    </div>
  );
}
