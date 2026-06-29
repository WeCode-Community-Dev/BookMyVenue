"use client";

import type { TimeSlotOption } from "@/lib/data/public-venue-detail";
import { TIME_SLOT_OPTIONS, formatShortDate } from "@/lib/data/public-venue-detail";
import { cn } from "@/lib/utils";

type TimeSlotPickerProps = {
  selectedDate: Date;
  selectedSlotId: string;
  onSelectSlot: (slot: TimeSlotOption) => void;
};

export function TimeSlotPicker({
  selectedDate,
  selectedSlotId,
  onSelectSlot,
}: TimeSlotPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-on-surface">
        Available Time Slots ({formatShortDate(selectedDate)})
      </h3>
      <div className="flex flex-wrap gap-2">
        {TIME_SLOT_OPTIONS.map((slot) => {
          const isSelected = slot.id === selectedSlotId;
          const isDisabled = slot.disabled;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelectSlot(slot)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isDisabled
                  ? "border-outline-variant/30 text-on-surface-variant/40 line-through cursor-not-allowed"
                  : isSelected
                    ? "border-surface-tint bg-primary-container/30 text-surface-tint"
                    : "border-outline-variant/60 text-on-surface hover:border-surface-tint/50",
              )}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { TIME_SLOT_OPTIONS };
