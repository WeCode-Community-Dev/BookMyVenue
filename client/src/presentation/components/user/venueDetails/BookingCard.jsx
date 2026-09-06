import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

export default function BookingCard({ venue, availability }) {
  const [bookingType, setBookingType] = useState("daily");
  const [guestCount, setGuestCount] = useState("");

  const navigate = useNavigate();

  // ======================================
  // MAXIMUM GUEST CAPACITY
  // ======================================
  const maxGuestCount =
    (venue?.seatingCapacity || 0) +
    (venue?.standingCapacity || 0);

  // ======================================
  // SELECTED DATE
  // ======================================
  const bookingDate = availability?.eventDate || "";

  // ======================================
  // VENUE OPEN / CLOSE TIME
  // Used for full-day booking
  // ======================================
  const venueOpenTime =
    venue?.availabilityRules?.openTime || "00:00";

  const venueCloseTime =
    venue?.availabilityRules?.closeTime || "23:59";

  // ======================================
  // BOOKING TYPE CHANGE
  // ======================================
  const handleBookingTypeChange = (event) => {
    const type = event.target.value;

    setBookingType(type);
  };

  // ======================================
  // HOURLY BOOKING VALIDATION
  // ======================================
  const isHourlyValid =
    bookingType === "hourly" &&
    Boolean(availability?.startTime) &&
    Boolean(availability?.endTime) &&
    availability.startTime < availability.endTime;

  // ======================================
  // FORM VALIDATION
  // ======================================
  const isFormValid =
    Boolean(bookingDate) &&
    Number(guestCount) > 0 &&
    Number(guestCount) <= maxGuestCount &&
    (bookingType === "daily" || isHourlyValid);

  // ======================================
  // CONTINUE TO BOOKING SUMMARY
  // ======================================
  const handleContinue = () => {
    if (!isFormValid) return;

    navigate(ROUTES.USER.BOOKING_SUMMARY, {
      state: {
        venue,
        venuId:venue._id || venue?.id,
        bookingType,

        bookingDate,

        startTime:
          bookingType === "hourly"
            ? availability.startTime
            : venueOpenTime,

        endTime:
          bookingType === "hourly"
            ? availability.endTime
            : venueCloseTime,

        guestCount: Number(guestCount),
      },
    });
  };

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* ======================================
          HEADER
      ====================================== */}
      <h2 className="text-2xl font-bold text-gray-900">
        Book this venue
      </h2>

      {/* ======================================
          EVENT DATE
      ====================================== */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Event date
        </label>

        <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          {bookingDate
            ? new Date(
                `${bookingDate}T00:00:00`
              ).toLocaleDateString("en-GB")
            : "Select a date from the calendar"}
        </div>
      </div>

      {/* ======================================
          BOOKING TYPE
      ====================================== */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Booking type
        </label>

        <select
          value={bookingType}
          onChange={handleBookingTypeChange}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
        >
          <option value="daily">
            Full Day
          </option>

          <option value="hourly">
            Hour Wise
          </option>
        </select>
      </div>

      {/* ======================================
          HOURLY BOOKING
          Slot is selected from VenueAvailability
      ====================================== */}
      {bookingType === "hourly" && (
        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-gray-900">
            Selected time slot
          </label>

          {availability?.startTime &&
          availability?.endTime ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">

              <p className="text-xs font-medium text-green-700">
                Selected slot
              </p>

              <p className="mt-1 text-sm font-semibold text-green-900">
                {formatTime(availability.startTime)}{" "}
                -{" "}
                {formatTime(availability.endTime)}
              </p>

            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

              <p className="text-sm text-gray-500">
                Select a time slot from the availability calendar.
              </p>

            </div>
          )}

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Available booking slots are generated automatically
            based on the venue's opening hours, minimum booking
            duration, and 1-hour cleaning time.
          </p>

        </div>
      )}

      {/* ======================================
          FULL DAY INFORMATION
      ====================================== */}
      {bookingType === "daily" && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

          <p className="text-xs font-medium text-gray-500">
            Full day booking time
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {formatTime(venueOpenTime)}{" "}
            -{" "}
            {formatTime(venueCloseTime)}
          </p>

        </div>
      )}

      {/* ======================================
          GUEST COUNT
      ====================================== */}
      <div className="mt-5">

        <label className="mb-2 block text-sm font-medium text-gray-900">
          Number of guests
        </label>

        <p className="mb-2 text-sm text-gray-500">
          Maximum {maxGuestCount} guests allowed, combining
          seating and standing capacity.
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
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
        />

        {/* Guest validation */}
        {Number(guestCount) > maxGuestCount && (
          <p className="mt-2 text-sm text-red-500">
            Guest count cannot exceed {maxGuestCount}.
          </p>
        )}

        {Number(guestCount) <= 0 &&
          guestCount !== "" && (
            <p className="mt-2 text-sm text-red-500">
              Guest count must be at least 1.
            </p>
          )}

      </div>

      {/* ======================================
          CONTINUE BUTTON
      ====================================== */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!isFormValid}
        className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>

      {/* ======================================
          HELPER MESSAGE
      ====================================== */}
      {!bookingDate && (
        <p className="mt-3 text-center text-xs text-gray-500">
          Please select an event date from the availability
          calendar.
        </p>
      )}

      {bookingType === "hourly" &&
        bookingDate &&
        !isHourlyValid && (
          <p className="mt-3 text-center text-xs text-gray-500">
            Please select an available time slot from the
            availability calendar.
          </p>
        )}

    </aside>
  );
}

// ======================================
// FORMAT TIME
// HH:mm → readable time
// ======================================
function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}