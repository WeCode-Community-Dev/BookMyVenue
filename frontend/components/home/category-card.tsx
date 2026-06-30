"use client";

import React from "react";
import * as Icons from "lucide-react";

interface CategoryCardProps {
  label: string;
  iconName: keyof typeof Icons;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryCard({ label, iconName, isActive = false, onClick }: CategoryCardProps) {
  const IconComponent = Icons[iconName] as React.ComponentType<{ className?: string }>;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[80px] sm:min-w-[96px] p-3 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group ${
        isActive
          ? "border-rose-600 bg-rose-50/50 text-rose-700 shadow-xs"
          : "border-slate-200/60 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 hover:-translate-y-0.5 hover:shadow-xs"
      }`}
    >
      {IconComponent && (
        <div className={`transition-transform duration-200 group-hover:scale-115 ${isActive ? "text-rose-600" : "text-slate-400 group-hover:text-rose-500"}`}>
          <IconComponent className="size-5 sm:size-6" />
        </div>
      )}
      <span className="text-[11px] sm:text-xs font-semibold mt-2 tracking-tight text-center">{label}</span>
    </button>
  );
}
