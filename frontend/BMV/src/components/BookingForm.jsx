import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBookingAsync } from "../modules/bookings/bookingSlice";

function BookingForm({ venueId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.bookings);

  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createBookingAsync({
        venue_id: venueId,
        booking_date: bookingDate,
        time_slot: timeSlot,
        notes: notes || null,
      }),
    );

    if (createBookingAsync.fulfilled.match(result)) {
      navigate(`/checkout/${result.payload.id}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-lg border border-gray-200 p-4"
    >
      <h3 className="text-lg font-semibold">Book this venue</h3>

      <div>
        <label className="mb-1 block text-sm font-medium">Date</label>
        <input
          type="date"
          required
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Time slot</label>
        <input
          type="time"
          required
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="Any special requirements?"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Booking..." : "Proceed to payment"}
      </button>
    </form>
  );
}

export default BookingForm;
