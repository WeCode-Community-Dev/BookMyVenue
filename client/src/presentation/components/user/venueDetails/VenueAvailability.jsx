import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function VenueAvailability({
  venue,
  onAvailabilityChange,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [guestCount, setGuestCount] = useState("");

  const maxGuests =
    (venue?.seatingCapacity || 0) +
    (venue?.standingCapacity || 0);

  // Temporary mock availability data
  const availabilityData = {
    "2026-08-01": {
      type: "fullDay",
      label: "Full day available",
    },

    "2026-08-02": {
      type: "hourly",
      label: "Available from 10:00 to 16:00",
      startTime: "10:00",
      endTime: "16:00",
    },

    "2026-08-03": {
      type: "booked",
      label: "Fully booked",
    },
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date) => {
    if (!date) return;

    const dateKey = formatDateKey(date);
    const selectedAvailability = availabilityData[dateKey];

    if (selectedAvailability?.type === "booked") {
      return;
    }

    setSelectedDate(date);

    onAvailabilityChange?.({
      eventDate: dateKey,
      guestCount,
      availability: selectedAvailability,
    });
  };

  const handleCheckAvailability = () => {
    if (!selectedDate || !guestCount) return;

    const dateKey = formatDateKey(selectedDate);

    onAvailabilityChange?.({
      eventDate: dateKey,
      guestCount,
      availability: availabilityData[dateKey],
    });
  };

  const isDateBooked = (date) => {
    const dateKey = formatDateKey(date);

    return availabilityData[dateKey]?.type === "booked";
  };

  const isFullDayAvailable = (date) => {
    const dateKey = formatDateKey(date);

    return availabilityData[dateKey]?.type === "fullDay";
  };

  const isHourlyAvailable = (date) => {
    const dateKey = formatDateKey(date);

    return availabilityData[dateKey]?.type === "hourly";
  };

  const selectedDateKey = selectedDate
    ? formatDateKey(selectedDate)
    : null;

  const selectedAvailability =
    selectedDateKey
      ? availabilityData[selectedDateKey]
      : null;

  return (
    <section className="mt-6 rounded-2xl border bg-white p-6">
      <h2 className="text-2xl font-bold">
        Check Availability
      </h2>

      <p className="mt-2 text-gray-500">
        Select an available date to check venue availability.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Calendar */}
        <div className="rounded-xl border p-4">

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={[
              { before: new Date() },
              isDateBooked,
            ]}
            modifiers={{
              fullDayAvailable: isFullDayAvailable,
              hourlyAvailable: isHourlyAvailable,
            }}
            modifiersClassNames={{
              fullDayAvailable:
                "border-2 border-green-500",

              hourlyAvailable:
                "border-2 border-yellow-500",
            }}
          />

          {/* Legend */}
          <div className="mt-4 space-y-2 text-sm">

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span>Full day available</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>Hourly availability</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gray-400" />
              <span>Fully booked</span>
            </div>

          </div>
        </div>

        {/* Availability Details */}
        <div className="space-y-5">

          {/* Selected Date Information */}
          {selectedDate && (
            <div className="rounded-xl border bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Selected Date
              </p>

              <p className="mt-1 font-semibold">
                {selectedDate.toLocaleDateString("en-GB")}
              </p>

              {selectedAvailability?.type === "fullDay" && (
                <p className="mt-2 font-medium text-green-600">
                  Full day available
                </p>
              )}

              {selectedAvailability?.type === "hourly" && (
                <p className="mt-2 font-medium text-yellow-600">
                  Available from{" "}
                  {selectedAvailability.startTime}
                  {" "}to{" "}
                  {selectedAvailability.endTime}
                </p>
              )}
            </div>
          )}

          {/* Guest Count */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Number of Guests
            </label>

            <input
              type="number"
              min="1"
              max={maxGuests}
              value={guestCount}
              onChange={(event) =>
                setGuestCount(event.target.value)
              }
              placeholder={`Maximum ${maxGuests} guests`}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Check Availability */}
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={!selectedDate || !guestCount}
            className="w-full rounded-xl bg-black py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check Availability
          </button>

        </div>
      </div>
    </section>
  );
}