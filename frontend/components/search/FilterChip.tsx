import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function FilterChip({ label, isActive = false, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-150 select-none cursor-pointer shrink-0",
        isActive
          ? "border-rose-600 bg-rose-50 text-rose-700 font-bold shadow-xs scale-[1.02]"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
      )}
    >
      {isActive && <Check className="size-3.5 text-rose-600 stroke-[3px] animate-in zoom-in-50 duration-150" />}
      <span>{label}</span>
    </button>
  );
}
