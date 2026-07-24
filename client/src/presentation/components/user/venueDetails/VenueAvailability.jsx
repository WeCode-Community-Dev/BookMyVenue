import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function VenueAvailability({
  venue,
  onAvailabilityChange,
}) {
  const [selectedDate, setSelectedDate] =
    useState(null);

  const formatDateKey = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date) => {
    if (!date) return;

    const dateKey =
      formatDateKey(date);

    setSelectedDate(date);

    onAvailabilityChange?.({
      eventDate: dateKey,
    });
  };

  return (
    <section className="mt-6 rounded-2xl border bg-white p-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <h2 className="text-2xl font-bold">
        Select Event Date
      </h2>

      <p className="mt-2 text-gray-500">
        Choose the date for your event. The exact
        availability will be validated when you continue
        with the booking.
      </p>

      <div className="mt-6">

        {/* ======================================
            CALENDAR
        ====================================== */}

        <div className="rounded-xl border p-4">

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={{
              before: new Date(),
            }}
          />

        </div>

        {/* ======================================
            SELECTED DATE
        ====================================== */}

        {selectedDate && (

          <div className="mt-5 rounded-xl border bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
              Selected Event Date
            </p>

            <p className="mt-1 font-semibold">
              {selectedDate.toLocaleDateString(
                "en-GB"
              )}
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

