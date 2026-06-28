"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPaginationRange } from "@/lib/data/venues-browse";
import { cn } from "@/lib/utils";

type VenuesPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function VenuesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: VenuesPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1 py-8"
      aria-label="Venue results pagination"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-on-surface-variant"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            type="button"
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            className={cn(
              "size-9",
              page === currentPage && "bg-surface-tint text-on-primary",
            )}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
