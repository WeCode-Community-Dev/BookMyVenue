"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import FilterChip from "./FilterChip";

interface FilterBarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onOpenDrawer: () => void;
  activeFiltersCount: number;
}

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  onOpenDrawer,
  activeFiltersCount,
}: FilterBarProps) {
  const categories = [
    "Wedding",
    "Birthday",
    "Conference",
    "Party",
    "Cafe",
    "Resort",
    "Auditorium",
    "Meeting Hall",
    "Outdoor",
    "Indoor",
  ];

  return (
    <div className="w-full flex items-center justify-between gap-4 py-3 select-none border-b border-slate-200/60 bg-white">
      {/* Category Tags scroll section */}
      <div className="flex-grow overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-2">
          {/* 'All' tag */}
          <FilterChip
            label="All Venues"
            isActive={selectedCategory === null}
            onClick={() => onSelectCategory(null)}
          />

          {categories.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              isActive={selectedCategory === cat}
              onClick={() => onSelectCategory(selectedCategory === cat ? null : cat)}
            />
          ))}
        </div>
      </div>

      {/* Advanced Filters Button */}
      <button
        onClick={onOpenDrawer}
        type="button"
        className="flex items-center gap-2 px-4 py-2.5 h-10 border border-slate-200 hover:border-slate-350 rounded-full text-xs sm:text-sm font-extrabold text-slate-700 bg-white hover:bg-slate-50 transition shadow-xs cursor-pointer shrink-0 active:scale-95"
      >
        <SlidersHorizontal className="size-3.5 sm:size-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="flex items-center justify-center size-5 bg-rose-600 text-white text-[10px] font-black rounded-full leading-none animate-in zoom-in-50 duration-150">
            {activeFiltersCount}
          </span>
        )}
      </button>
    </div>
  );
}
