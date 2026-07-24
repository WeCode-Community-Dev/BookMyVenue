import { formatBookingPriceDisplay } from "../../utils/formatPrice";
import { formatSlotDate, formatTimeRange } from "../../utils/formatDate";
import { getDisplayLabelForSlot } from "../../utils/predefinedSlots";

const MobileBookingBar = ({
  venue,
  selectedSlot,
  canBook,
  isPaying,
  onBookNow,
  onSelectSlot,
}) => {
  const priceLabel = formatBookingPriceDisplay(venue?.price);
  const hasSelection = Boolean(selectedSlot);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:px-4 lg:hidden">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-2 sm:gap-4">
        <button
          type="button"
          onClick={!hasSelection ? onSelectSlot : undefined}
          className={[
            "min-w-0 flex-1 text-left",
            !hasSelection ? "cursor-pointer" : "cursor-default",
          ].join(" ")}
          disabled={hasSelection}
          aria-label={hasSelection ? "Selected booking summary" : "Select a slot to continue"}
        >
          {hasSelection ? (
            <>
              <p className="truncate text-sm font-bold text-gray-900">
                {formatSlotDate(selectedSlot.date)}
              </p>
              <p className="truncate text-xs font-medium text-gray-800">
                {getDisplayLabelForSlot(selectedSlot)} ·{" "}
                {formatTimeRange(selectedSlot.startTime, selectedSlot.endTime)}
              </p>
              <p className="truncate text-xs font-semibold text-red-600">
                {priceLabel}
              </p>
            </>
          ) : (
            <>
              <p className="truncate text-sm font-bold text-gray-900">{priceLabel}</p>
              <p className="text-xs text-gray-500">Select a slot to continue</p>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBookNow}
          disabled={!canBook || isPaying}
          className="shrink-0 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
        >
          {isPaying ? "Processing..." : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default MobileBookingBar;
