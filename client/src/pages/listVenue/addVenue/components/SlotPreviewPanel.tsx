import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { ISlotConfig, IPreviewSlot } from '@/utils/slotGenerator.types';
import {
  generateSlots,
  isWorkingDay,
  getNextWorkingDay,
  formatDateToString,
  parseDateString,
} from '@/utils/slotGenerator.utils';

type SlotPreviewPanelProps = ISlotConfig;

const SlotPreviewPanel: React.FC<SlotPreviewPanelProps> = ({
  bookingType,
  workingDays,
  workingHours,
  fixedPackages,
  slotDuration,
  bufferTime,
  pricingType,
  pricingRules,
  blockedTimes,
  samePrice,
  basePrice,
}) => {
  const [selectedPreviewDate, setSelectedPreviewDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWorkingDay = getNextWorkingDay(tomorrow, workingDays);
    return formatDateToString(nextWorkingDay);
  });

  const slots = useMemo(() => {
    if (!selectedPreviewDate) return [];

    const config: ISlotConfig = {
      bookingType,
      workingDays,
      workingHours,
      fixedPackages,
      slotDuration,
      bufferTime,
      pricingType,
      pricingRules,
      blockedTimes,
      samePrice,
      basePrice,
    };

    return generateSlots(selectedPreviewDate, config);
  }, [
    selectedPreviewDate,
    bookingType,
    workingDays,
    workingHours,
    fixedPackages,
    slotDuration,
    bufferTime,
    pricingType,
    pricingRules,
    blockedTimes,
    samePrice,
    basePrice,
  ]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedPreviewDate(formatDateToString(date));
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    return !isWorkingDay(date, workingDays);
  };

  const displayDate = selectedPreviewDate
    ? parseDateString(selectedPreviewDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const bookingTypeLabel = bookingType === 'fixedBooking' ? 'Fixed Package' : 'Flexible Booking';

  return (
    <div className="mt-26 h-fit max-h-[80vh] lg:max-h-full flex flex-col bg-gradient-to-b from-[var(--bg-tertiary)] via-[var(--bg-tertiary)] to-[var(--bg-grey)]/30 backdrop-blur-md rounded-3xl p-6 space-y-6">
      {/* Booking Type Badge */}
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Preview</h3>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--bg-green)] text-white">
          {bookingTypeLabel}
        </span>
      </div>

      {/* Calendar Section */}
      <div className="space-y-3 flex flex-col items-center shrink-0">
        <label className="block font-semibold text-[var(--text-primary)]">Select Date</label>
        <div className="overflow-x-auto w-full flex justify-center">
          <Calendar
            mode="single"
            selected={selectedPreviewDate ? parseDateString(selectedPreviewDate) : undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-2xl"
          />
        </div>
      </div>

      {/* Selected Date Pill */}
      {displayDate && (
        <div className="flex items-center justify-center gap-2 shrink-0">
          <div className="px-4 py-2 rounded-2xl border border-[var(--bg-green)] text-[var(--bg-green)] text-sm font-medium">
            {displayDate}
          </div>
        </div>
      )}

      {/* Available Slots Section */}
      <div className="space-y-3 flex flex-col flex-1 min-h-0">
        <h4 className="font-semibold text-[var(--text-primary)] shrink-0">Available Slots</h4>

        {!selectedPreviewDate ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            Select a date to see slots
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            No availability configured yet
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pb-4">
            {slots.map((slot: IPreviewSlot) => (
              <button
                key={slot.id}
                disabled={!slot.isAvailable}
                className={`w-full p-3 rounded-2xl text-sm font-medium transition-all duration-200 text-left shrink-0 ${
                  slot.isAvailable
                    ? 'border-2 border-[var(--bg-green)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] cursor-pointer hover:shadow-md'
                    : 'border-2 border-[var(--bg-grey)] bg-[var(--bg-grey)] text-[var(--text-secondary)] opacity-40 cursor-not-allowed'
                }`}
                title={slot.reason || ''}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span>
                      {slot.startTime} - {slot.endTime}
                      {slot.name && ` (${slot.name})`}
                    </span>
                  </div>
                  <span className="font-semibold">₹{slot.price}</span>
                </div>
                {!slot.isAvailable && slot.reason && (
                  <div className="text-xs mt-1 opacity-75">{slot.reason}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer Note */}
      <div className="pt-2 border-t border-[var(--bg-grey)] shrink-0">
        <p className="text-[11px] text-[var(--text-secondary)] text-center leading-relaxed">
          * Note: This preview is for visualization purposes only. Actual slot generation is handled
          server-side and may evaluate additional constraints and edge cases.
        </p>
      </div>
    </div>
  );
};

export default SlotPreviewPanel;
