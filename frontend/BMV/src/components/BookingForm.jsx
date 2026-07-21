import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBookingAsync } from "../modules/bookings/bookingSlice";
import { checkAvailability } from "../modules/venues/services/venueService";

function BookingForm({ venueId, pricePerDay }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.bookings);

  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [localError, setLocalError] = useState("");
  const idempotencyKeyRef = useRef(null);
  const formFingerprintRef = useRef("");

  useEffect(() => {
    const fingerprint = `${venueId}|${bookingDate}|${timeSlot}`;
    if (formFingerprintRef.current !== fingerprint) {
      formFingerprintRef.current = fingerprint;
      idempotencyKeyRef.current = null;
    }
  }, [venueId, bookingDate, timeSlot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const time_slot = timeSlot.length === 5 ? `${timeSlot}:00` : timeSlot;

    try {
      const availability = await checkAvailability(venueId, bookingDate, time_slot);
      if (!availability.available) {
        setLocalError("This slot is already booked. Please choose another time.");
        return;
      }
    } catch (err) {
      setLocalError(err.message || "Could not check availability");
      return;
    }

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }

    const result = await dispatch(
      createBookingAsync({
        venue_id: Number(venueId),
        booking_date: bookingDate,
        time_slot,
        notes: notes || null,
        idempotencyKey: idempotencyKeyRef.current,
      }),
    );

    if (createBookingAsync.fulfilled.match(result)) {
      navigate(`/checkout/${result.payload.id}`);
    }
  };

  const displayError = localError || error;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Book this venue</h3>
        <p className="text-sm text-slate-400 mt-1">
          ₹{Number(pricePerDay).toLocaleString("en-IN")} per day
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
        <input
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Time slot</label>
        <input
          type="time"
          required
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Any special requirements?"
        />
      </div>

      {displayError && (
        <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{displayError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Booking..." : "Proceed to payment"}
      </button>
    </form>
  );
}

export default BookingForm;
