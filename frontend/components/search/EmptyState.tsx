import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-slate-150 border-dashed rounded-3xl bg-slate-50/50 max-w-lg mx-auto my-6 space-y-5 select-none">
      
      {/* Icon block */}
      <div className="size-12 rounded-full bg-rose-50 border border-rose-100/50 flex items-center justify-center">
        <AlertCircle className="size-6 text-rose-600" />
      </div>

      {/* Description headings */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">No Venues Found</h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-xs leading-relaxed">
          Try loosening your pricing sliders, decreasing guest counts, or resetting other amenity tags.
        </p>
      </div>

      {/* Action button */}
      <div className="pt-1">
        <Button
          onClick={onReset}
          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-9 px-5 rounded-xl cursor-pointer shadow-xs border-none text-xs"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
