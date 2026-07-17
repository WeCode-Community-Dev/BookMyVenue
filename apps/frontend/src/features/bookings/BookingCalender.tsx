/* eslint-disable */

"use client";

import "react-day-picker/dist/style.css";

import { CalendarDays, X } from "lucide-react";

import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useState } from "react";

export default function BookingCalendar() {
    const [selectedDates, setSelectedDates] = useState<Date[]>([
        new Date(2026, 6, 15),
        new Date(2026, 6, 16),
        new Date(2026, 6, 17),
    ]);

    const removeDate = (date: Date) => {
        setSelectedDates((prev) =>
            prev.filter(
                (d) => d.toDateString() !== date.toDateString()
            )
        );
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* Heading */}

            <div className="flex items-start gap-3">

                <div className="rounded-lg bg-teal-50 p-2">
                    <CalendarDays className="h-5 w-5 text-teal-700" />
                </div>

                <div>

                    <h2 className="text-xl font-bold text-slate-900">
                        1. When is your event?
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Select one or more dates
                    </p>

                </div>

            </div>

            {/* Content */}

            <div className="mt-6 flex items-start gap-8">

                {/* Calendar */}

                <div className="w-[340px]
        shrink-0
        rounded-xl
        border
        border-slate-200
        p-4 ">

                    <DayPicker
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={(dates) =>
                            setSelectedDates(dates ?? [])
                        }
                        defaultMonth={new Date(2026, 6)}
                        month={new Date(2026, 6)}
                        showOutsideDays
                    />

                </div>

                {/* Selected Dates */}

                <div className="w-[320px] shrink-0">

                    <div className="mb-4 flex items-center justify-between">

                        <h3 className="font-semibold text-slate-900">
                            Selected Dates ({selectedDates.length})
                        </h3>

                        <button
                            className="text-sm font-medium text-red-500"
                            onClick={() => setSelectedDates([])}
                        >
                            Clear All
                        </button>

                    </div>

                    <div className="space-y-3">

                        {selectedDates.map((date) => (
                            <div
                                key={date.toISOString()}
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <CalendarDays className="h-4 w-4 text-teal-700" />

                                    <span className="font-medium text-slate-700">
                                        {format(date, "EEE, dd MMM yyyy")}
                                    </span>

                                </div>

                                <button
                                    onClick={() => removeDate(date)}
                                >
                                    <X className="h-4 w-4 text-slate-500" />
                                </button>

                            </div>
                        ))}

                    </div>

                    <button
                        className="
                            mt-5
                            flex
                            h-12
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-dashed
                            border-teal-400
                            text-sm
                            font-semibold
                            text-teal-700
                        "
                    >
                        + Add Another Date
                    </button>

                </div>

            </div>

        </div>
    );
}