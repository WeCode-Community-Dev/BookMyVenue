import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

export default function BookingCard({ venue, availability }) {
  const [bookingType, setBookingType] = useState("daily");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const navigate = useNavigate();

  // ======================================
  // MAXIMUM GUEST CAPACITY
  // ======================================
  const maxGuestCount = Math.max(
    venue.seatingCapacity || 0,
    venue.standingCapacity || 0
  );

  // ======================================
  // SELECTED DATE (normalize to YYYY-MM-DD)
  // ======================================
  let bookingDate = "";
  if (availability?.eventDate) {
    const parsed = new Date(availability.eventDate);
    bookingDate = parsed.toISOString().split("T")[0]; // ✅ normalized
  }

  // ======================================
  // BOOKING TYPE CHANGE
  // ======================================
  const handleBookingTypeChange = (event) => {
    const type = event.target.value;
    setBookingType(type);

    if (type === "daily") {
      setStartTime("");
      setEndTime("");
    }
  };

  // ======================================
  // CONTINUE TO BOOKING SUMMARY
  // ======================================
  const venueOpenTime = venue.availabilityRules?.openTime || "00:00";
  const venueCloseTime = venue.availabilityRules?.closeTime || "23:59";

  const handleContinue = () => {
    navigate(ROUTES.USER.BOOKING_SUMMARY, {
      state: {
        venue,
        bookingType,
        bookingDate, // ✅ normalized date passed forward
        startTime: bookingType === "hourly" ? startTime : venueOpenTime,
        endTime: bookingType === "hourly" ? endTime : venueCloseTime,
        guestCount: Number(guestCount),
      },
    });
  };

  // ======================================
  // VALIDATION
  // ======================================
  const isHourlyValid =
    bookingType === "hourly" && startTime && endTime && startTime < endTime;

  const isFormValid =
    bookingDate &&
    Number(guestCount) > 0 &&
    Number(guestCount) <= maxGuestCount &&
    (bookingType === "daily" || isHourlyValid);

  return (
    <aside className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Book this venue</h2>

      {/* EVENT DATE */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">Event date</label>
        <div className="w-full rounded-xl border bg-gray-50 px-4 py-3">
          {bookingDate
            ? new Date(bookingDate).toLocaleDateString("en-GB")
            : "Select a date from the calendar"}
        </div>
      </div>

      {/* BOOKING TYPE */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium">Booking type</label>
        <select
          value={bookingType}
          onChange={handleBookingTypeChange}
          className="w-full rounded-xl border bg-white px-4 py-3"
        >
          <option value="daily">Full Day</option>
          <option value="hourly">Hour Wise</option>
        </select>
      </div>

      {/* HOURLY TIME */}
      {bookingType === "hourly" && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Start time</label>
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="w-full rounded-xl border px-3 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">End time</label>
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="w-full rounded-xl border px-3 py-3"
            />
          </div>
        </div>
      )}

      {/* GUEST COUNT */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium">Number of guests</label>
        <p className="mb-2 text-sm text-gray-500">
          Allowed guests: up to {maxGuestCount}
        </p>
        <input
          type="number"
          min="1"
          max={maxGuestCount}
          value={guestCount}
          onChange={(event) => setGuestCount(event.target.value)}
          placeholder={`Maximum ${maxGuestCount} guests`}
          className="w-full rounded-xl border px-4 py-3"
        />
        {Number(guestCount) > maxGuestCount && (
          <p className="mt-2 text-sm text-red-500">
            Guest count cannot exceed {maxGuestCount}.
          </p>
        )}
      </div>

      {/* CONTINUE */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!isFormValid}
        className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </aside>
  );
}
