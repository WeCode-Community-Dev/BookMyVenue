import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

export default function BookingCard({ venue, selectedPackage }) {
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(ROUTES.USER.BOOKING_SUMMARY, {
      state: {
        venue,
        selectedPackage,
        bookingDate: eventDate,
        startTime,
        endTime,
        guestCount,
      },
    });
  };

  const maxGuestCount =
    venue.seatingCapacity + venue.standingCapacity;

  return (
    <aside className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Book this venue</h2>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Event date
        </label>

        <input
          type="date"
          value={eventDate}
          onChange={(event) => setEventDate(event.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Start time
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="w-full rounded-xl border px-3 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            End time
          </label>

          <input
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className="w-full rounded-xl border px-3 py-3"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium">
          Number of guests
        </label>

        <input
          type="number"
          min="1"
          max={maxGuestCount}
          value={guestCount}
          onChange={(event) => setGuestCount(event.target.value)}
          placeholder="Enter guest count"
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!eventDate || !startTime || !endTime || !guestCount}
        className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </aside>
  );
}