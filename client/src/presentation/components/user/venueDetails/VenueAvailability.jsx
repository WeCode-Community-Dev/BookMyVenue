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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { availabilityData } = useSelector(
    (state) => state.userBooking
  );
  

const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Fetch availability whenever month changes
useEffect(() => {
  const venueId = venue?._id || venue?.id;

  if (!venueId) {
    console.log("No venue id");
    return;
  }


  dispatch(
    fetchAvailability({
      venueId,
      month: currentMonth.getMonth() + 1,
      year: currentMonth.getFullYear(),
    })
  );

}, [dispatch, venue, currentMonth]);

  const handleDateSelect = (date) => {
    if (!date) return;

    const dateKey = formatDateKey(date);

    setSelectedDate(date);

    onAvailabilityChange?.({
      eventDate: dateKey,
    });
  };

  // Disable fully booked dates
  const disabledDays = [
    {
      before: new Date(),
    },
    (date) => {
      const key = formatDateKey(date);

      return (
        availabilityData?.[key]?.status === "booked"
      );
    },
  ];
  const modifiers = {
  partial: (date) =>
    availabilityData?.[formatDateKey(date)]?.status === "partial",

  booked: (date) =>
    availabilityData?.[formatDateKey(date)]?.status === "booked",
};


  return (
    <section className="mt-6 rounded-2xl border bg-white p-6">
      <h2 className="text-2xl font-bold">
        Select Event Date
      </h2>

      <p className="mt-2 text-gray-500">
        Choose the date for your event. The exact
        availability will be validated when you continue
        with the booking.
      </p>

      <div className="mt-6">
        <div className="rounded-xl border p-4">
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiers={modifiers}
            disabled={[{ before: new Date() },modifiers.booked,]}
          />
        </div>

        {selectedDate && (
          <div className="mt-5 rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Selected Event Date
            </p>

            <p className="mt-1 font-semibold">
              {selectedDate.toLocaleDateString("en-GB")}
            </p>

            {availabilityData?.[
              formatDateKey(selectedDate)
            ] && (
              <p className="mt-2 text-sm">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {
                    availabilityData[
                      formatDateKey(selectedDate)
                    ].status
                  }
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}