import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export default function BookingCard({ venue,selectedPackage}) {
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const navigate = useNavigate();

  const handleContinue = () => {
    console.log("Continue clicked");

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

  return (
    <aside className="bg-white rounded-2xl p-6 shadow-sm border sticky top-6">
      <h2 className="text-2xl font-bold">
        Book this venue
      </h2>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Event date
        </label>

        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Start time
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border rounded-xl px-3 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            End time
          </label>

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border rounded-xl px-3 py-3"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium mb-2">
          Number of guests
        </label>

        <input
          type="number"
          min="1"
          max={venue.seatingCapacity + venue.standingCapacity}
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          placeholder="Enter guest count"
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!eventDate || !startTime || !endTime || !guestCount}
        className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </aside>
  );
}