import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateTimePickerProps {
  label: string;
  value: string | null; // ISO string
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabledDays?: number[]; // Days of week (0-6) that are available
  openingTime?: string; // "HH:MM" e.g. "08:00"
  closingTime?: string; // "HH:MM" e.g. "22:00"
  minDate?: Date;
  existingBookings?: any[] | null;
}

const weekdaysShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function DateTimePicker({
  label,
  value,
  onChange,
  placeholder = 'Select date & time',
  disabledDays,
  openingTime = '00:00',
  closingTime = '23:30',
  minDate = new Date(),
  existingBookings,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedValue = value ? new Date(value) : null;
  const isDateValid = parsedValue && !isNaN(parsedValue.getTime());

  const [viewDate, setViewDate] = useState(() => {
    return isDateValid ? new Date(parsedValue.getTime()) : new Date();
  });

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  useEffect(() => {
    if (isDateValid) {
      setViewDate(new Date(parsedValue.getTime()));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const [startHour, startMin] = openingTime.split(':').map(Number);
    const [endHour, endMin] = closingTime.split(':').map(Number);

    let current = new Date();
    current.setHours(startHour, startMin, 0, 0);

    const endLimit = new Date();
    endLimit.setHours(endHour, endMin, 0, 0);

    while (current <= endLimit) {
      const hh = String(current.getHours()).padStart(2, '0');
      const mm = String(current.getMinutes()).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const generateTimeSlotsForDate = (date: Date): Date[] => {
    const slots: Date[] = [];
    const [startHour, startMin] = openingTime.split(':').map(Number);
    const [endHour, endMin] = closingTime.split(':').map(Number);

    let current = new Date(date.getTime());
    current.setHours(startHour, startMin, 0, 0);

    const endLimit = new Date(date.getTime());
    endLimit.setHours(endHour, endMin, 0, 0);

    while (current <= endLimit) {
      slots.push(new Date(current.getTime()));
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  const isSlotBooked = (slotDate: Date): boolean => {
    if (!existingBookings) return false;
    return existingBookings.some((booking) => {
      if (booking.bookingStatus === 'CANCELLED' || booking.bookingStatus === 'REFUNDED') {
        return false;
      }
      const bookingStart = new Date(booking.startDateTime);
      const bookingEnd = new Date(booking.endDateTime);
      return slotDate >= bookingStart && slotDate < bookingEnd;
    });
  };

  const isDateFullyBooked = (date: Date): boolean => {
    if (!existingBookings || existingBookings.length === 0) return false;
    const slots = generateTimeSlotsForDate(date);
    if (slots.length === 0) return false;
    return slots.every((slotDate) => isSlotBooked(slotDate));
  };

  const getBookedIntervalsForDate = (date: Date): string[] => {
    if (!existingBookings) return [];
    const targetDateStr = date.toDateString();

    return existingBookings
      .filter((booking) => {
        if (booking.bookingStatus === 'CANCELLED' || booking.bookingStatus === 'REFUNDED') {
          return false;
        }
        const start = new Date(booking.startDateTime);
        const end = new Date(booking.endDateTime);
        return start.toDateString() === targetDateStr || end.toDateString() === targetDateStr;
      })
      .map((booking) => {
        const start = new Date(booking.startDateTime);
        const end = new Date(booking.endDateTime);
        const formatTime = (d: Date) => {
          return d.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
        };
        return `${formatTime(start)} - ${formatTime(end)}`;
      });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isDateDisabled = (day: number): boolean => {
    const dateToCheck = new Date(currentYear, currentMonth, day);

    if (minDate) {
      const minComparison = new Date(minDate.getTime());
      minComparison.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentYear, currentMonth, day, 23, 59, 59, 999);
      if (dayEnd < minComparison) return true;
    }

    if (disabledDays && disabledDays.length > 0) {
      const dayOfWeek = dateToCheck.getDay();
      if (!disabledDays.includes(dayOfWeek)) {
        return true;
      }
    }

    if (isDateFullyBooked(dateToCheck)) {
      return true;
    }

    return false;
  };

  const handleDateSelect = (day: number) => {
    let baseDate: Date;
    if (isDateValid) {
      baseDate = new Date(parsedValue.getTime());
      baseDate.setFullYear(currentYear);
      baseDate.setMonth(currentMonth);
      baseDate.setDate(day);
    } else {
      baseDate = new Date(currentYear, currentMonth, day);
      const [h, m] = openingTime.split(':').map(Number);
      baseDate.setHours(h || 9, m || 0, 0, 0);
    }

    if (openingTime || closingTime) {
      const [sh, sm] = openingTime.split(':').map(Number);
      const [eh, em] = closingTime.split(':').map(Number);
      const currentHours = baseDate.getHours();
      const currentMins = baseDate.getMinutes();
      const currentVal = currentHours * 60 + currentMins;
      const minVal = sh * 60 + sm;
      const maxVal = eh * 60 + em;

      if (currentVal < minVal || currentVal > maxVal) {
        baseDate.setHours(sh, sm, 0, 0);
      }
    }

    if (minDate && baseDate < minDate) {
      const baseDateOnly = new Date(baseDate.getTime());
      baseDateOnly.setHours(0, 0, 0, 0);
      const minDateOnly = new Date(minDate.getTime());
      minDateOnly.setHours(0, 0, 0, 0);
      if (baseDateOnly.getTime() === minDateOnly.getTime()) {
        baseDate.setHours(minDate.getHours(), minDate.getMinutes(), 0, 0);
      } else {
        baseDate = new Date(minDate.getTime());
      }
    }

    onChange(baseDate.toISOString());
  };

  const handleTimeSelect = (timeStr: string) => {
    if (!isDateValid) return;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const updatedDate = new Date(parsedValue.getTime());
    updatedDate.setHours(hours, minutes, 0, 0);
    onChange(updatedDate.toISOString());
    setIsOpen(false);
  };

  const formatInputText = (): string => {
    if (!isDateValid) return '';
    return parsedValue.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderCalendarDays = () => {
    const dayCells: React.ReactNode[] = [];

    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const isSelected =
        isDateValid &&
        parsedValue.getFullYear() === currentYear &&
        parsedValue.getMonth() === currentMonth &&
        parsedValue.getDate() === day;

      const dateToCheck = new Date(currentYear, currentMonth, day);
      const bookedIntervals = getBookedIntervalsForDate(dateToCheck);
      const hasSomeBookings = bookedIntervals.length > 0;

      dayCells.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={disabled}
          onClick={() => handleDateSelect(day)}
          title={hasSomeBookings ? `Booked: ${bookedIntervals.join(', ')}` : undefined}
          className={`
            h-9 w-9 text-xs font-semibold rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none relative
            ${isSelected ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' : ''}
            ${!isSelected && !disabled ? 'text-foreground hover:bg-primary/10 hover:text-primary' : ''}
            ${disabled ? 'text-muted/30 line-through cursor-not-allowed bg-zinc-50/50 dark:bg-zinc-800/10' : ''}
          `}
        >
          <span>{day}</span>
          {!isSelected && !disabled && hasSomeBookings && (
            <span className="absolute bottom-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          )}
        </button>
      );
    }

    return dayCells;
  };

  const selectedDateBookings = isDateValid ? getBookedIntervalsForDate(parsedValue) : [];

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full flex items-center justify-between bg-background border border-border rounded-xl px-4 py-3
            text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer
          "
        >
          <span className={isDateValid ? 'font-semibold text-foreground' : 'text-muted'}>
            {formatInputText() || placeholder}
          </span>
          <CalendarIcon size={16} className="text-muted" />
        </button>

        {isOpen && (
          <div className="absolute right-0 left-0 sm:left-auto sm:right-0 sm:w-[500px] mt-2 bg-card border border-border shadow-xl rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="sm:col-span-7 space-y-3.5 border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 sm:pr-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {months[currentMonth]} {currentYear}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg border border-border hover:bg-surface text-muted hover:text-foreground transition-all cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg border border-border hover:bg-surface text-muted hover:text-foreground transition-all cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-muted uppercase">
                {weekdaysShort.map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
            </div>

            <div className="sm:col-span-5 space-y-2 flex flex-col h-[240px]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border pb-2 shrink-0">
                <Clock size={13} className="text-primary" />
                <span>Available Times</span>
              </div>

              {!isDateValid ? (
                <div className="flex-1 flex items-center justify-center text-[10px] text-muted text-center px-4 font-semibold">
                  Please select a date on the calendar first
                </div>
              ) : (
                <>
                  {selectedDateBookings.length > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-700 p-2 rounded-lg space-y-0.5 shrink-0">
                      <span className="font-extrabold block uppercase tracking-wide">
                        Reserved Times Today:
                      </span>
                      <div className="space-y-0.5 font-medium max-h-[42px] overflow-y-auto">
                        {selectedDateBookings.map((interval, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span>•</span>
                            <span>{interval}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {timeSlots.map((time) => {
                      const [h, m] = time.split(':').map(Number);
                      const isSelected =
                        isDateValid &&
                        parsedValue.getHours() === h &&
                        parsedValue.getMinutes() === m;

                      const slotDate = new Date(parsedValue.getTime());
                      slotDate.setHours(h, m, 0, 0);

                      const isTimeDisabled = (() => {
                        if (minDate) {
                          const slotMinutes = h * 60 + m;
                          const selectedDateOnly = new Date(parsedValue.getTime());
                          selectedDateOnly.setHours(0, 0, 0, 0);
                          const minDateOnly = new Date(minDate.getTime());
                          minDateOnly.setHours(0, 0, 0, 0);
                          if (selectedDateOnly.getTime() === minDateOnly.getTime()) {
                            const minMinutes = minDate.getHours() * 60 + minDate.getMinutes();
                            if (slotMinutes < minMinutes) return true;
                          }
                        }
                        return isSlotBooked(slotDate);
                      })();

                      const displayTime = (() => {
                        const suffix = h >= 12 ? 'PM' : 'AM';
                        const displayH = h % 12 || 12;
                        const displayM = String(m).padStart(2, '0');
                        return `${displayH}:${displayM} ${suffix}`;
                      })();

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isTimeDisabled}
                          onClick={() => handleTimeSelect(time)}
                          className={`
                            w-full py-1.5 px-3 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer disabled:cursor-not-allowed
                            ${
                              isSelected
                                ? 'bg-primary border-primary text-white shadow-sm'
                                : isTimeDisabled
                                  ? 'bg-zinc-50 dark:bg-zinc-800/10 border-border text-muted/30 line-through'
                                  : 'bg-background border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                            }
                          `}
                        >
                          {displayTime}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
