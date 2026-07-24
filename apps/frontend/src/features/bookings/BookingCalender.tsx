/* eslint-disable */

"use client";

import "react-day-picker/dist/style.css";

import { CalendarDays, X } from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";
import { DayPicker } from "react-day-picker";
import { bookingCalendarStyle } from "@/features/booking/styles/BookingCalendarStyle";
import { format } from "date-fns";
import { useState } from "react";

export default function BookingCalendar({
    selectedDates: propsSelectedDates,
    setSelectedDates: propsSetSelectedDates,
}: {
    selectedDates?: Date[];
    setSelectedDates?: React.Dispatch<React.SetStateAction<Date[]>>;
}) {
    const [localSelectedDates, setLocalSelectedDates] = useState<Date[]>([]);

    const selectedDates = propsSelectedDates || localSelectedDates;
    const setSelectedDates = propsSetSelectedDates || setLocalSelectedDates;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const removeDate = (date: Date) => {
        setSelectedDates((prev) =>
            prev.filter(
                (d) => d.toDateString() !== date.toDateString()
            )
        );
    };

    return (
        <div className={bookingCalendarStyle.card}>

            {/* Heading */}

            <div className={bookingCalendarStyle.header}>

                <div className={bookingCalendarStyle.iconWrapper}>
                    <CalendarDays className={bookingCalendarStyle.icon} />
                </div>

                <div>

                    <h2 className={bookingCalendarStyle.title}>
                        <AppText textName="WHEN_IS_YOUR_EVENT" textModule="LABEL" />
                    </h2>

                    <p className={bookingCalendarStyle.subtitle}>
                        <AppText textName="SELECT_ONE_OR_MORE_DATES" textModule="LABEL" />
                    </p>

                </div>

            </div>

            {/* Content */}

            <div className={bookingCalendarStyle.content}>

                {/* Calendar */}

                <div className={bookingCalendarStyle.calendarWrapper}>

                    <DayPicker
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={(dates) =>
                            setSelectedDates(dates ?? [])
                        }
                        defaultMonth={new Date()}
                        disabled={{ before: today }}
                        showOutsideDays
                    />

                </div>

                {/* Selected Dates */}

                <div className={bookingCalendarStyle.sidebar}>

                    <div className={bookingCalendarStyle.sidebarHeader}>

                        <h3 className={bookingCalendarStyle.sidebarTitle}>
                            <AppText textName="SELECTED_DATES" textModule="LABEL" append={{ count: selectedDates.length }} />
                        </h3>

                        <button
                            className={bookingCalendarStyle.clearBtn}
                            onClick={() => setSelectedDates([])}
                        >
                            <AppText textName="CLEAR_ALL" textModule="BUTTON" />
                        </button>

                    </div>

                    <div className={bookingCalendarStyle.datesList}>

                        {selectedDates.map((date) => (
                            <div
                                key={date.toISOString()}
                                className={bookingCalendarStyle.dateItem}
                            >

                                <div className={bookingCalendarStyle.dateInfo}>

                                    <CalendarDays className={bookingCalendarStyle.dateIcon} />

                                    <span className={bookingCalendarStyle.dateText}>
                                        {format(date, "EEE, dd MMM yyyy")}
                                    </span>

                                </div>

                                <button
                                    onClick={() => removeDate(date)}
                                    className={bookingCalendarStyle.removeBtn}
                                >
                                    <X className={bookingCalendarStyle.removeIcon} />
                                </button>

                            </div>
                        ))}

                    </div>

                    <button className={bookingCalendarStyle.addBtn}>
                        <AppText textName="ADD_ANOTHER_DATE" textModule="BUTTON" />
                    </button>

                </div>

            </div>

        </div>
    );
}