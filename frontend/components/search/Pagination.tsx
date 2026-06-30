import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-6 border-t border-slate-100 select-none">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        type="button"
        className="inline-flex items-center justify-center size-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-350 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {/* Pages indexes list */}
      {pages.map((p) => {
        const isCurrent = currentPage === p;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            type="button"
            className={`inline-flex items-center justify-center size-9 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              isCurrent
                ? "bg-slate-900 text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-650 hover:border-slate-350 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        type="button"
        className="inline-flex items-center justify-center size-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-350 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
