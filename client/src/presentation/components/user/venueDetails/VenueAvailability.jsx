import { useState } from "react";

export default function VenueAvailability({
  venue,
  onAvailabilityChange,
}) {
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const handleCheckAvailability = () => {
    const availabilityData = {
      eventDate,
      startTime,
      endTime,
      guestCount,
    };

    onAvailabilityChange?.(availabilityData);
  };

  const maxGuests =
    (venue?.seatingCapacity || 0) +
    (venue?.standingCapacity || 0);

  return (
    <section className="bg-white rounded-2xl p-6 mt-6 border">
      <h2 className="text-2xl font-bold">
        Check Availability
      </h2>

      <p className="text-gray-500 mt-2">
        Select your event date and requirements to check availability.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Event Date
          </label>

          <input
            type="date"
            value={eventDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Guests
          </label>

          <input
            type="number"
            min="1"
            max={maxGuests}
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            placeholder={`Maximum ${maxGuests} guests`}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Start Time
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            End Time
          </label>

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckAvailability}
        className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold"
      >
        Check Availability
      </button>
    </section>
  );
}