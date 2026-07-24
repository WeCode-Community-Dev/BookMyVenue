import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBookingAsync } from "../modules/bookings/bookingSlice";
import { checkAvailabilityRange } from "../modules/venues/services/venueService";
import { countBookingDays } from "../utils/bookingFormat";

function normalizeTime(value) {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
}

function BookingForm({ venueId, pricePerDay }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.bookings);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [notes, setNotes] = useState("");
  const [localError, setLocalError] = useState("");
  const idempotencyKeyRef = useRef(null);
  const formFingerprintRef = useRef("");

  const today = new Date().toISOString().split("T")[0];

  const numDays = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    return countBookingDays(checkInDate, checkOutDate);
  }, [checkInDate, checkOutDate]);

  const totalPrice = useMemo(() => {
    if (!numDays || !pricePerDay) return 0;
    return Number(pricePerDay) * numDays;
  }, [numDays, pricePerDay]);

  useEffect(() => {
    const fingerprint = `${venueId}|${checkInDate}|${checkInTime}|${checkOutDate}|${checkOutTime}`;
    if (formFingerprintRef.current !== fingerprint) {
      formFingerprintRef.current = fingerprint;
      idempotencyKeyRef.current = null;
    }
  }, [venueId, checkInDate, checkInTime, checkOutDate, checkOutTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const check_in_time = normalizeTime(checkInTime);
    const check_out_time = normalizeTime(checkOutTime);

    if (checkOutDate < checkInDate) {
      setLocalError("Check-out date must be on or after check-in date.");
      return;
    }

    try {
      const availability = await checkAvailabilityRange(venueId, {
        check_in_date: checkInDate,
        check_in_time,
        check_out_date: checkOutDate,
        check_out_time,
      });
      if (!availability.available) {
        setLocalError(
          availability.reason ||
            "This time range is not available. Please choose different dates.",
        );
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
        check_in_date: checkInDate,
        check_in_time,
        check_out_date: checkOutDate,
        check_out_time,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Check-in date
          </label>
          <input
            type="date"
            required
            min={today}
            value={checkInDate}
            onChange={(e) => {
              setCheckInDate(e.target.value);
              if (!checkOutDate || e.target.value > checkOutDate) {
                setCheckOutDate(e.target.value);
              }
            }}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Check-in time
          </label>
          <input
            type="time"
            required
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Check-out date
          </label>
          <input
            type="date"
            required
            min={checkInDate || today}
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Check-out time
          </label>
          <input
            type="time"
            required
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {numDays > 0 && (
        <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-700">
          <span className="font-medium">
            {numDays} day{numDays !== 1 ? "s" : ""} × ₹
            {Number(pricePerDay).toLocaleString("en-IN")}
          </span>
          <span className="mx-2 text-slate-400">=</span>
          <span className="font-bold text-slate-900">
            ₹{totalPrice.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Any special requirements?"
        />
      </div>

      {displayError && (
        <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">
          {displayError}
        </p>
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
