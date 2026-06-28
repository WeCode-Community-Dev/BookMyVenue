import { useEffect, useMemo, useState } from "react";
import {
  areAllSlotsExpiredForToday,
  getCreatablePresetsForDate,
  getSlotOptionStateWithSelection,
  getTodayDateInputValue,
  getVisibleSlotOptions,
  SLOT_RULES_HELPER,
} from "../../../utils/predefinedSlots";
import { getTodayDateKey, isTodayCalendarDate } from "../../../utils/formatDate";

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-red-300 focus:ring-2 focus:ring-red-100";

const CreateAvailabilityCard = ({
  date,
  selectedSlotIds,
  slots,
  dateError,
  slotsError,
  submitError,
  isSubmitting,
  onDateChange,
  onToggleSlot,
  onSubmit,
}) => {
  const [, setTimeTick] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeTick((tick) => tick + 1);
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const minDate = getTodayDateInputValue();
  const isToday = date === getTodayDateKey();

  const visibleOptions = useMemo(
    () => getVisibleSlotOptions(slots, date, selectedSlotIds),
    [slots, date, selectedSlotIds]
  );

  const creatablePresets = useMemo(
    () => getCreatablePresetsForDate(slots, date, selectedSlotIds),
    [slots, date, selectedSlotIds]
  );

  const allTodayExpired = useMemo(
    () => areAllSlotsExpiredForToday(date),
    [date]
  );

  const canSubmit =
    Boolean(date) &&
    selectedSlotIds.length > 0 &&
    creatablePresets.length > 0 &&
    selectedSlotIds.every((id) =>
      creatablePresets.some((preset) => preset.id === id)
    );

  const emptySlotMessage = useMemo(() => {
    if (!date) return null;
    if (allTodayExpired) {
      return "No remaining slots available for today.";
    }
    if (creatablePresets.length === 0) {
      return "All slot options are already added or blocked for this date.";
    }
    return null;
  }, [date, allTodayExpired, creatablePresets.length]);

  return (
    <section
      id="create-availability"
      className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <h2 className="text-base font-semibold text-gray-900">Add slots</h2>
      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
        Choose a date, pick predefined slots, then save.
      </p>

      <details className="mt-3 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2">
        <summary className="cursor-pointer text-xs font-medium text-amber-900">
          Slot rules (Full Day vs partial slots)
        </summary>
        <p className="mt-2 text-xs leading-relaxed text-amber-900/90">
          {SLOT_RULES_HELPER}
        </p>
      </details>

      {submitError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="availability-date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="availability-date"
            type="date"
            name="date"
            min={minDate}
            value={date}
            onChange={onDateChange}
            className={fieldClass}
            aria-invalid={Boolean(dateError)}
            aria-describedby={dateError ? "availability-date-error" : undefined}
          />
          {isTodayCalendarDate(date) && (
            <p className="mt-1.5 text-xs text-gray-500">
              For today, slots whose end time has already passed are hidden.
            </p>
          )}
          {dateError && (
            <p id="availability-date-error" role="alert" className="mt-1 text-xs text-red-600">
              {dateError}
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Select slots</p>

          {!date && (
            <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-sm text-gray-500">
              Choose a date to see available slot options.
            </p>
          )}

          {date && emptySlotMessage && (
            <p
              role="status"
              className={[
                "rounded-lg border px-3 py-4 text-sm",
                allTodayExpired
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-dashed border-gray-200 bg-gray-50 text-gray-500",
              ].join(" ")}
            >
              {emptySlotMessage}
            </p>
          )}

          {date && !emptySlotMessage && visibleOptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleOptions.map((preset) => {
                const state = getSlotOptionStateWithSelection(
                  slots,
                  date,
                  preset,
                  selectedSlotIds
                );
                const isSelected = selectedSlotIds.includes(preset.id);
                const isDisabled = state.disabled || isSubmitting;

                return (
                  <label
                    key={preset.id}
                    className={[
                      "inline-flex min-h-10 max-w-full cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors sm:min-w-[10.5rem]",
                      isSelected
                        ? "border-red-500 bg-red-50 ring-1 ring-red-200"
                        : "border-gray-200 bg-white hover:border-gray-300",
                      isDisabled ? "cursor-not-allowed opacity-70" : "",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => onToggleSlot(preset.id)}
                      className="h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="min-w-0 leading-tight">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">
                          {preset.label}
                        </span>
                        {state.existing && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-600">
                            Added
                          </span>
                        )}
                      </span>
                      <span className="block text-[11px] text-gray-500">
                        {preset.startTime} – {preset.endTime}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {slotsError && (
            <p id="availability-slots-error" role="alert" className="mt-2 text-xs text-red-600">
              {slotsError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Adding..." : "Add Availability"}
        </button>
      </form>
    </section>
  );
};

export default CreateAvailabilityCard;
