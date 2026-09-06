
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailability } from "@/redux/slices/UserBookingSlice";

export default function VenueAvailability({
  venue,
  onAvailabilityChange,
}) {
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [currentMonth, setCurrentMonth] = useState(
    new Date()
  );

  const { availabilityData } = useSelector(
    (state) => state.userBooking
  );

  // ---------------------------------------
  // Format date as YYYY-MM-DD
  // ---------------------------------------
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

  // ---------------------------------------
  // Fetch availability when month changes
  // ---------------------------------------
  useEffect(() => {
    const venueId = venue?._id || venue?.id;

    if (!venueId) return;

    dispatch(
      fetchAvailability({
        venueId,
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      })
    );
  }, [dispatch, venue, currentMonth]);

  // ---------------------------------------
  // Get availability for selected date
  // ---------------------------------------
  const selectedDateKey = selectedDate
    ? formatDateKey(selectedDate)
    : null;

  const selectedDateAvailability =
    selectedDateKey
      ? availabilityData?.[selectedDateKey]
      : null;

  const availableSlots =
    selectedDateAvailability?.slots || [];

  const selectedDateStatus =
    selectedDateAvailability?.status || null;

  // ---------------------------------------
  // Date selection
  // ---------------------------------------
  const handleDateSelect = (date) => {
    if (!date) return;

    const dateKey = formatDateKey(date);

    setSelectedDate(date);

    // Clear previously selected time slot
    setSelectedSlot("");

    // Only send the date initially
    onAvailabilityChange?.({
      eventDate: dateKey,
      startTime: "",
      endTime: "",
    });
  };

  // ---------------------------------------
  // Slot selection
  // ---------------------------------------
  const handleSlotSelect = (event) => {
    const value = event.target.value;

    setSelectedSlot(value);

    if (!value || !selectedDateKey) {
      onAvailabilityChange?.({
        eventDate: selectedDateKey || "",
        startTime: "",
        endTime: "",
      });

      return;
    }

    const selectedSlotData = availableSlots.find(
      (slot) =>
        `${slot.startTime}-${slot.endTime}` === value
    );

    if (!selectedSlotData) return;

    onAvailabilityChange?.({
      eventDate: selectedDateKey,
      startTime: selectedSlotData.startTime,
      endTime: selectedSlotData.endTime,
    });
  };

  // ---------------------------------------
  // Check date status
  // ---------------------------------------
  const getDateStatus = (date) => {
    const key = formatDateKey(date);

    return availabilityData?.[key]?.status;
  };

  // ---------------------------------------
  // Disable past + fully booked dates
  // ---------------------------------------
  const disabledDays = [
    {
      before: new Date(),
    },

    (date) =>
      getDateStatus(date) === "booked",
  ];

  // ---------------------------------------
  // Calendar modifiers
  // ---------------------------------------
  const modifiers = {
    partial: (date) =>
      getDateStatus(date) === "partial",

    booked: (date) =>
      getDateStatus(date) === "booked",
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="border-b border-gray-100 px-6 py-5">

        <div className="flex items-start gap-3">

          {/* Calendar Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <rect
                width="18"
                height="18"
                x="3"
                y="4"
                rx="2"
              />

              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>

          </div>

          <div>

            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Check availability
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Select an available date and booking time.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================
          CALENDAR AREA
      ====================================== */}
      <div className="px-6 py-6">

        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">

          <div className="flex justify-center">

            <Calendar
              mode="single"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              disabled={disabledDays}
              className="w-full max-w-[420px]"
              classNames={{
                months:
                  "flex w-full flex-col",

                month:
                  "space-y-5 w-full",

                caption:
                  "flex justify-center pt-1 relative items-center",

                caption_label:
                  "text-base font-semibold text-gray-900",

                nav:
                  "flex items-center gap-1",

                button_previous:
                  "h-9 w-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition",

                button_next:
                  "h-9 w-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition",

                month_grid:
                  "w-full border-collapse",

                weekdays:
                  "flex w-full",

                weekday:
                  "w-full text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400",

                week:
                  "mt-1 flex w-full",

                day:
                  "relative flex-1 p-0 text-center",

                day_button:
                  "mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition hover:bg-white hover:shadow-sm",

                selected:
                  "bg-yellow-500 text-white hover:bg-yellow-500 hover:text-white",

                today:
                  "font-bold text-yellow-600",

                outside:
                  "text-gray-300 opacity-50",

                disabled:
                  "cursor-not-allowed text-gray-300 opacity-40",
              }}
            />

          </div>

        </div>

        {/* =====================================
            AVAILABILITY LEGEND
        ====================================== */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-600">

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full border-2 border-yellow-500 bg-yellow-500" />

            Fully booked

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full border-2 border-yellow-300 bg-yellow-100" />

            Partially booked

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full border border-gray-300 bg-gray-200" />

            Available

          </div>

        </div>

        {/* =====================================
            SELECTED DATE
        ====================================== */}
        {selectedDate && (
          <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50/60 p-4">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-yellow-600 shadow-sm">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="m9 12 2 2 4-4" />

                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                  </svg>

                </div>

                <div>

                  <p className="text-xs font-medium text-gray-500">
                    Selected event date
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-gray-900">
                    {selectedDate.toLocaleDateString(
                      "en-GB",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                </div>

              </div>

              {selectedDateStatus && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    selectedDateStatus === "available"
                      ? "bg-green-100 text-green-700"
                      : selectedDateStatus === "partial"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {selectedDateStatus}
                </span>
              )}

            </div>

            {/* =====================================
                TIME SLOT SELECT
            ====================================== */}
            {availableSlots.length > 0 && (
              <div className="mt-5">

                <label
                  htmlFor="booking-slot"
                  className="mb-2 block text-sm font-semibold text-gray-900"
                >
                  Select booking time
                </label>

                <select
                  id="booking-slot"
                  value={selectedSlot}
                  onChange={handleSlotSelect}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                >
                  <option value="">
                    Select a time slot
                  </option>

                  {availableSlots.map((slot) => (
                    <option
                      key={`${slot.startTime}-${slot.endTime}`}
                      value={`${slot.startTime}-${slot.endTime}`}
                    >
                      {formatTime(slot.startTime)}{" "}
                      -{" "}
                      {formatTime(slot.endTime)}
                    </option>
                  ))}

                </select>

                <p className="mt-2 text-xs text-gray-500">
                  Booking slots are automatically generated based
                  on the venue's minimum booking duration and
                  cleaning time.
                </p>

              </div>
            )}

            {/* =====================================
                NO SLOT MESSAGE
            ====================================== */}
            {selectedDateStatus !== "booked" &&
              availableSlots.length === 0 && (
                <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">

                  <p className="text-sm font-medium text-gray-700">
                    No booking slots are available for this date.
                  </p>

                </div>
              )}

          </div>
        )}

      </div>

    </section>
  );
}

// ---------------------------------------
// Format HH:mm → readable time
// ---------------------------------------
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

