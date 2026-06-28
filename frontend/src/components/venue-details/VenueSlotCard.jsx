import { Check } from "lucide-react";
import { getDisplayLabelForSlot } from "../../utils/predefinedSlots";
import { formatTimeRange } from "../../utils/formatDate";

const VenueSlotCard = ({ slot, selected = false, onSelect, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(slot)}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors",
        selected
          ? "border-red-500 bg-red-50 ring-1 ring-red-200"
          : "border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/30",
        disabled ? "cursor-not-allowed opacity-60" : "",
      ].join(" ")}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold leading-tight text-gray-900">
          {getDisplayLabelForSlot(slot)}
        </span>
        <span className="block truncate text-[11px] leading-tight text-gray-500">
          {formatTimeRange(slot.startTime, slot.endTime)}
        </span>
      </span>

      {selected && (
        <Check className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
      )}
    </button>
  );
};

export default VenueSlotCard;
