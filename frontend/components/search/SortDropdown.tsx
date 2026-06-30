import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const options = [
    { label: "Recommended", value: "recommended" },
    { label: "Highest Rated", value: "rating-desc" },
    { label: "Most Popular", value: "popular" },
    { label: "Lowest Price", value: "price-asc" },
    { label: "Highest Price", value: "price-desc" },
    { label: "Newest Added", value: "newest" },
  ];

  return (
    <div className="flex items-center gap-2 select-none shrink-0">
      <label htmlFor="sort-dropdown" className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
        <ArrowUpDown className="size-3.5 text-slate-400" />
        <span>Sort by</span>
      </label>
      <select
        id="sort-dropdown"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-40 sm:w-44 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition duration-150 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
