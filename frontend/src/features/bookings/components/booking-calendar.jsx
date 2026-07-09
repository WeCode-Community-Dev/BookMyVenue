import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { getTodayDateStringInIst } from '@/utils/datetime';
import { buildCalendarDaysForMonth, getCurrentMonthYearInIst, isDateFullyBooked, isDatePartiallyBooked, isDateBeforeToday } from '@/utils/slots';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BookingCalendar({ year, month, onMonthChange, selectedDate, onSelectDate, busySlots = [] }) {
  const cells = buildCalendarDaysForMonth(year, month);
  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  function goToPreviousMonth() {
    if (month === 1) {
      onMonthChange({ year: year - 1, month: 12 });
    } else {
      onMonthChange({ year, month: month - 1 });
    }
  }

  function goToNextMonth() {
    if (month === 12) {
      onMonthChange({ year: year + 1, month: 1 });
    } else {
      onMonthChange({ year, month: month + 1 });
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-sm font-semibold text-brand-text">{monthLabel}</p>
        <Button type="button" variant="ghost" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-brand-muted">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((dateStr, index) => {
          if (!dateStr) {
            return <div key={`empty-${index}`} />;
          }

          const disabled = isDateBeforeToday(dateStr) || isDateFullyBooked(dateStr, busySlots);
          const partial = isDatePartiallyBooked(dateStr, busySlots);
          const selected = selectedDate === dateStr;
          const isToday = dateStr === getTodayDateStringInIst();

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'relative flex h-10 items-center justify-center rounded-md text-sm transition',
                disabled && 'cursor-not-allowed text-brand-muted opacity-40',
                !disabled && 'hover:bg-brand-surface',
                selected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                isToday && !selected && 'ring-1 ring-brand-border',
              )}
            >
              {Number(dateStr.split('-')[2])}
              {partial && !selected ? <span className="absolute bottom-1 size-1 rounded-full bg-primary" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function useBookingCalendarState() {
  const defaults = getCurrentMonthYearInIst();
  return defaults;
}
