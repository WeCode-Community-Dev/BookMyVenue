import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

export default function BookingCard({
  venue,
  selectedPackage,
  availability,
}) {
  const [bookingType, setBookingType] = useState("fullDay");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const navigate = useNavigate();

  const maxGuestCount =
    (venue.seatingCapacity || 0) +
    (venue.standingCapacity || 0);

  const eventDate = availability?.eventDate || "";

  const handleBookingTypeChange = (event) => {
    const type = event.target.value;

    setBookingType(type);

    if (type === "fullDay") {
      setStartTime("");
      setEndTime("");
    }
  };

  const handleContinue = () => {
    navigate(ROUTES.USER.BOOKING_SUMMARY, {
      state: {
        venue,
        selectedPackage,
        bookingType,
        bookingDate: eventDate,
        startTime,
        endTime,
        guestCount,
      },
    });
  };

  const isHourWiseValid =
    bookingType === "hourWise" &&
    startTime &&
    endTime &&
    startTime < endTime;

  const isFormValid =
    eventDate &&
    guestCount &&
    Number(guestCount) <= maxGuestCount &&
    (bookingType === "fullDay" || isHourWiseValid);

  return (
    <aside className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">
        Book this venue
      </h2>

      {/* Selected Date */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Event date
        </label>

        <div className="w-full rounded-xl border bg-gray-50 px-4 py-3">
          {eventDate
            ? new Date(`${eventDate}T00:00:00`).toLocaleDateString(
                "en-GB"
              )
            : "Select a date from the calendar"}
        </div>
      </div>

      {/* Booking Type */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium">
          Booking type
        </label>

        <select
          value={bookingType}
          onChange={handleBookingTypeChange}
          className="w-full rounded-xl border bg-white px-4 py-3"
        >
          <option value="fullDay">
            Full Day
          </option>

          <option value="hourWise">
            Hour Wise
          </option>
        </select>
      </div>

      {/* Hour Wise Time Selection */}
      {bookingType === "hourWise" && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Start time
            </label>

            <input
              type="time"
              value={startTime}
              onChange={(event) =>
                setStartTime(event.target.value)
              }
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
              onChange={(event) =>
                setEndTime(event.target.value)
              }
              className="w-full rounded-xl border px-3 py-3"
            />
          </div>
        </div>
      )}

      {/* Guest Count */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium">
          Number of guests
        </label>

        <p className="mb-2 text-sm text-gray-500">
          Allowed guests: up to {maxGuestCount}
        </p>

        <input
          type="number"
          min="1"
          max={maxGuestCount}
          value={guestCount}
          onChange={(event) =>
            setGuestCount(event.target.value)
          }
          placeholder={`Maximum ${maxGuestCount} guests`}
          className="w-full rounded-xl border px-4 py-3"
        />

        {Number(guestCount) > maxGuestCount && (
          <p className="mt-2 text-sm text-red-500">
            Guest count cannot exceed {maxGuestCount}.
          </p>
        )}
      </div>

      {/* Continue */}
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