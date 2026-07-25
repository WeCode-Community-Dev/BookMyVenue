"use client";

import React from "react";
import { CategoryCard } from "./category-card";
import * as Icons from "lucide-react";

export interface CategoryItem {
  label: string;
  iconName: keyof typeof Icons;
}

export const CATEGORIES: CategoryItem[] = [
  { label: "Wedding", iconName: "Heart" },
  { label: "Birthday", iconName: "Cake" },
  { label: "Conference", iconName: "Users" },
  { label: "Sports", iconName: "Trophy" },
  { label: "Party", iconName: "Music" },
  { label: "Resort", iconName: "Palmtree" },
  { label: "Cafe", iconName: "Coffee" },
  { label: "Auditorium", iconName: "Mic" },
];

interface CategoryListProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div className="w-full border-b border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Scrollable Container */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mb-2 w-full">
            <button
              onClick={() => onSelectCategory(null)}
              className={`flex flex-col items-center justify-center min-w-[80px] sm:min-w-[96px] p-3 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group ${
                selectedCategory === null
                  ? "border-rose-600 bg-rose-50/50 text-rose-700 shadow-xs"
                  : "border-slate-200/60 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 hover:-translate-y-0.5 hover:shadow-xs"
              }`}
            >
              <div className={`transition-transform duration-200 group-hover:scale-115 ${selectedCategory === null ? "text-rose-600" : "text-slate-400 group-hover:text-rose-500"}`}>
                <Icons.Grid className="size-5 sm:size-6" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold mt-2 tracking-tight text-center">All Venues</span>
            </button>

            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.label}
                label={cat.label}
                iconName={cat.iconName}
                isActive={selectedCategory === cat.label}
                onClick={() => onSelectCategory(cat.label)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
