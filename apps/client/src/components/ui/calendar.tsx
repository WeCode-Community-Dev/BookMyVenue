"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

/** Format a Date as a local YYYY-MM-DD string (no timezone shift). */
export function toDateKey(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

interface CalendarProps {
    /** Selected date as a YYYY-MM-DD string. */
    value: string | null;
    onChange: (date: string) => void;
    className?: string;
}

export function Calendar({ value, onChange, className }: CalendarProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = value ? new Date(`${value}T00:00:00`) : null;

    const [viewMonth, setViewMonth] = useState(
        () => new Date((selected ?? today).getFullYear(), (selected ?? today).getMonth(), 1),
    );

    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

    const goToMonth = (offset: number) =>
        setViewMonth(new Date(year, month + offset, 1));

    const isPastMonth = year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth());

    return (
        <div className={cn("select-none", className)}>
            <div className="flex items-center justify-between mb-3">
                <button
                    type="button"
                    onClick={() => goToMonth(-1)}
                    disabled={isPastMonth}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-foreground">
                    {MONTHS[month]} {year}
                </span>
                <button
                    type="button"
                    onClick={() => goToMonth(1)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer transition-colors"
                    aria-label="Next month"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((w) => (
                    <span key={w} className="text-center text-xs font-medium text-muted-foreground py-1">
                        {w}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((date, i) => {
                    if (!date) return <span key={`empty-${i}`} />;

                    const key = toDateKey(date);
                    const isPast = date < today;
                    const isSelected = selected != null && toDateKey(selected) === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            disabled={isPast}
                            onClick={() => onChange(key)}
                            className={cn(
                                "aspect-square flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer",
                                isSelected
                                    ? "bg-primary text-primary-foreground font-semibold"
                                    : "text-foreground hover:bg-secondary",
                                isPast && "text-muted-foreground/40 hover:bg-transparent cursor-not-allowed",
                            )}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
