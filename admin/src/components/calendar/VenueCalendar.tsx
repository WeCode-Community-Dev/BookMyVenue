import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export function VenueCalendar({
  isLoading,
  handleDayClick,
  isDisabledDay,
  isBooked,
  isBlocked,
  isTempBlocked,
  isInactivityBlocked,
  isPast,
  isTooFar,
  isNonWorkingDay,
}: {
  isLoading: boolean;
  handleDayClick: (date: Date) => void;
  isDisabledDay: (date: Date) => boolean;
  isBooked: (date: Date) => boolean;
  isBlocked: (date: Date) => boolean;
  isTempBlocked: (date: Date) => boolean;
  isInactivityBlocked: (date: Date) => boolean;
  isPast: (date: Date) => boolean;
  isTooFar: (date: Date) => boolean;
  isNonWorkingDay: (date: Date) => boolean;
}) {
  return (
    <>
      <div className="rounded-md border p-6 overflow-x-auto">
        {isLoading ? (
          <div className="h-80 animate-pulse rounded-xl bg-zinc-100" />
        ) : (
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              showOutsideDays={false}
              onDayClick={handleDayClick}
              disabled={isDisabledDay}
              modifiers={{
                booked: (date) => isBooked(date),
                blocked: (date) => isBlocked(date),
                tempBlocked: (date) => isTempBlocked(date),
                inactivityBlocked: (date) => isInactivityBlocked(date),
                unavailable: (date) =>
                  isPast(date) || isTooFar(date) || isNonWorkingDay(date),
                past: (date) => isPast(date),
              }}
              modifiersClassNames={{
                booked: "rdp-day--booked",
                blocked: "rdp-day--blocked",
                tempBlocked: "rdp-day--temp-blocked",
                inactivityBlocked: "rdp-day--inactivity-blocked",
                unavailable: "rdp-day--unavailable",
                past: "rdp-day--past",
              }}
              styles={{
                root: {
                  "--rdp-accent-color": "#18181b",
                } as React.CSSProperties,
              }}
            />
          </div>
        )}
      </div>
      <style>{`
        .rdp-day--booked {
          background-color: #dbeafe !important;
          color: #1d4ed8 !important;
          cursor: not-allowed !important;
        }
        .rdp-day--booked:hover {
          background-color: #bfdbfe !important;
        }
        .rdp-day--blocked {
          background-color: #fee2e2 !important;
          color: #dc2626 !important;
          cursor: default !important;
        }
        .rdp-day--blocked:hover {
          background-color: #fecaca !important;
        }
        .rdp-day--unavailable {
          background-color: #e4e4e7 !important;
          color: #a1a1aa !important;
          opacity: 0.5;
          cursor: not-allowed !important;
        }
        .rdp-day--temp-blocked {
          background-color: #fef3c7 !important;
          color: #d97706 !important;
          cursor: not-allowed !important;
        }
        .rdp-day--temp-blocked:hover {
          background-color: #fde68a !important;
        }
        .rdp-day--inactivity-blocked {
          background-color: #f3e8ff !important;
          color: #9333ea !important;
          cursor: not-allowed !important;
        }
        .rdp-day--inactivity-blocked:hover {
          background-color: #e9d5ff !important;
        }

        /* Past days keep their colour, dimmed. Must stay below the rules above:
           everything here is !important, so grey would otherwise win on source order. */
        .rdp-day--booked.rdp-day--past,
        .rdp-day--booked.rdp-day--past:hover {
          background-color: #eff6ff !important;
          color: #3b82f6 !important;
          opacity: 1;
          cursor: not-allowed !important;
        }
        .rdp-day--blocked.rdp-day--past,
        .rdp-day--blocked.rdp-day--past:hover {
          background-color: #fef2f2 !important;
          color: #ef4444 !important;
          opacity: 1;
          cursor: not-allowed !important;
        }
        .rdp-day--temp-blocked.rdp-day--past,
        .rdp-day--temp-blocked.rdp-day--past:hover {
          background-color: #fffbeb !important;
          color: #d97706 !important;
          opacity: 1;
          cursor: not-allowed !important;
        }
        .rdp-day--inactivity-blocked.rdp-day--past,
        .rdp-day--inactivity-blocked.rdp-day--past:hover {
          background-color: #faf5ff !important;
          color: #a855f7 !important;
          opacity: 1;
          cursor: not-allowed !important;
        }
      `}</style>
    </>
  );
}
