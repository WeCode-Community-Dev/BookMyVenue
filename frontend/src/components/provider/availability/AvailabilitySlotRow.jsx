import {
  getDisplayLabelForSlot,
  getSlotStatusLabel,
} from "../../../utils/predefinedSlots";

const statusStyles = {
  Available: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Booked: "bg-amber-50 text-amber-700 ring-amber-100",
  Inactive: "bg-gray-100 text-gray-600 ring-gray-200",
};

const ROW_GRID =
  "md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto_auto] md:items-center md:gap-3";

const AvailabilitySlotRow = ({
  slot,
  onActivate,
  onDeactivate,
  isProcessing,
}) => {
  const status = getSlotStatusLabel(slot);
  const isBooked = Boolean(slot.isBooked);
  const isActive = Boolean(slot.isActive);

  return (
    <article
      className={`group px-3 py-2.5 transition-colors hover:bg-gray-50/80 sm:px-4 ${ROW_GRID}`}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          {getDisplayLabelForSlot(slot)}
        </p>
      </div>

      <div className="mt-0.5 min-w-0 text-xs text-gray-500 md:mt-0">
        {slot.startTime} – {slot.endTime}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 md:mt-0">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
            statusStyles[status]
          }`}
        >
          {status}
        </span>
        {isBooked && (
          <span className="text-[10px] text-amber-800">Cannot deactivate</span>
        )}
      </div>

      <div className="mt-2 flex justify-end md:mt-0">
        {!isBooked && (
          <>
            {isActive ? (
              <button
                type="button"
                onClick={() => onDeactivate(slot)}
                disabled={isProcessing}
                className="inline-flex min-h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? "..." : "Deactivate"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onActivate(slot)}
                disabled={isProcessing}
                className="inline-flex min-h-8 items-center justify-center rounded-lg bg-red-600 px-2.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? "..." : "Activate"}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
};

export const AvailabilityTableHeader = () => (
  <div
    className={`hidden border-b border-gray-100 bg-gray-50/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 md:grid ${ROW_GRID.replace("md:grid ", "")}`}
  >
    <span>Slot</span>
    <span>Time</span>
    <span>Status</span>
    <span className="text-right">Action</span>
  </div>
);

export default AvailabilitySlotRow;
