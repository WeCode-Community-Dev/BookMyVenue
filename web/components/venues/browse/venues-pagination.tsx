"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PaginationMeta } from "@/services/venueServices";
import { useRouter, useSearchParams } from "next/navigation";

type VenuesPaginationProps = {
  meta: PaginationMeta;
};

export function VenuesPagination({
  meta,
}: VenuesPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { page, totalPages, hasNext, hasPrevious } = meta;
  if (totalPages <= 1) return null;


  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/venues?${params.toString()}`);
  };

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
        disabled={!hasPrevious}
        onClick={() => handlePageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, index) => (
        <Button
        key={index}
        type="button"
        variant={index+1 === page ? "default" : "outline"}
        size="icon"
        className={cn(
          "size-9",
          index+1 === page && "bg-surface-tint text-on-primary",
        )}
        onClick={() => handlePageChange(index+1)}
        aria-label={`Page ${index+1}`}
        aria-current={index+1 === page ? "page" : undefined}
      >
        {index+1}
      </Button>
      ))}

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        disabled={!hasNext}
        onClick={() => handlePageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
