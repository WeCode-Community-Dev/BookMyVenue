import { formatSlotDate, formatSlotDateCompact, toDateKey } from "../../../utils/formatDate";
import AvailabilitySlotRow, {
  AvailabilityTableHeader,
} from "./AvailabilitySlotRow";

const AvailabilityListGrouped = ({
  groups,
  processingSlotId,
  onActivate,
  onDeactivate,
}) => (
  <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white ring-1 ring-gray-100/80">
    <AvailabilityTableHeader />

    <div className="divide-y divide-gray-100">
      {groups.map((group) => {
        const dateKey = toDateKey(group.date);
        const dateLabel = formatSlotDateCompact(group.date);

        return (
          <div key={dateKey}>
            <div className="flex items-center justify-between bg-gray-50/90 px-3 py-2 sm:px-4">
              <h3
                className="text-xs font-semibold text-gray-800 sm:text-sm"
                title={formatSlotDate(group.date)}
              >
                {dateLabel}
              </h3>
              <span className="text-[11px] text-gray-500">
                {group.slots.length} slot{group.slots.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {group.slots.map((slot) => (
                <AvailabilitySlotRow
                  key={slot._id}
                  slot={slot}
                  onActivate={onActivate}
                  onDeactivate={onDeactivate}
                  isProcessing={processingSlotId === slot._id}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default AvailabilityListGrouped;
