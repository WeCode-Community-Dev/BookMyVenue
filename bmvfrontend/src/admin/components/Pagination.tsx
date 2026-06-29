"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 7 page buttons
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    if (currentPage <= 4) return [...pages.slice(0, 5), -1, totalPages];
    if (currentPage >= totalPages - 3)
      return [1, -1, ...pages.slice(totalPages - 5)];
    return [
      1,
      -1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      -2,
      totalPages,
    ];
  };

  const visible = getVisiblePages();

  return (
    <div className={cn("flex items-center gap-1.5 justify-center", className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8 w-8 p-0 border-[#E2E2DE] rounded-lg"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visible.map((page, i) =>
        page < 0 ? (
          <span
            key={`ellipsis-${i}`}
            className="h-8 w-8 flex items-center justify-center text-[#70706e] text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-[#0D7377] text-white"
                : "text-[#70706e] hover:bg-[#F0F0EC]"
            )}
          >
            {page}
          </button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8 w-8 p-0 border-[#E2E2DE] rounded-lg"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
