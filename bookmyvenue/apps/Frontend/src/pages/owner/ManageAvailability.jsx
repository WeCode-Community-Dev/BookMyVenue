import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Clock, Trash2, Plus, CheckCircle, AlertCircle } from "lucide-react";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Loading from "../../components/common/Loading";

import {
  getAvailability,
  createAvailability,
  deleteAvailability,
} from "../../api/availability";

import { getVenueById } from "../../api/venues";
import { useAuth } from "../../context/AuthContext";

const DATE_PRESETS = [
  { label: "Today", delta: 0 },
  { label: "Tomorrow", delta: 1 },
  { label: "Next 3 days", delta: 3 },
  { label: "Next 7 days", delta: 7 },
  { label: "Next 14 days", delta: 14 },
];

function formatDateString(date) {
  return date.toISOString().split("T")[0];
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function ManageAvailability() {
  const { id } = useParams();
  const { token } = useAuth();

  const [venue, setVenue] = useState(null);
  const [availability, setAvailability] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form state
  const [selectedDates, setSelectedDates] = useState([""]);
  const [bookingType, setBookingType] = useState("hourly");
  const [slots, setSlots] = useState([{ start_time: "08:00", end_time: "09:00" }]);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!venue) return;
    // Default to hourly if supported, else daily
    if (venue.supports_hourly) {
      setBookingType("hourly");
    } else if (venue.supports_daily) {
      setBookingType("daily");
    }
  }, [venue]);

  async function loadData() {
    try {
      setLoading(true);
      const [venueData, availabilityData] = await Promise.all([
        getVenueById(id),
        getAvailability(id),
      ]);
      setVenue(venueData);
      setAvailability(availabilityData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getSupportedTypes() {
    if (!venue) return ["hourly"];
    const types = [];
    if (venue.supports_hourly) types.push("hourly");
    if (venue.supports_daily) types.push("daily");
    return types;
  }

  // Multiple date helpers
  function addDateField() {
    setSelectedDates([...selectedDates, ""]);
  }

  function removeDateField(index) {
    if (selectedDates.length <= 1) return;
    setSelectedDates(selectedDates.filter((_, i) => i !== index));
  }

  function updateDateField(index, value) {
    const updated = [...selectedDates];
    updated[index] = value;
    setSelectedDates(updated);
  }

  function applyPreset(delta) {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < delta; i++) {
      dates.push(formatDateString(addDays(today, i)));
    }
    if (delta === 0 || dates.length === 0) {
      dates.push(formatDateString(today));
    }
    setSelectedDates(dates);
  }

  // Hourly slot helpers
  function addSlot() {
    setSlots([...slots, { start_time: "08:00", end_time: "09:00" }]);
  }

  function updateSlot(index, field, value) {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  }

  function removeSlot(index) {
    if (slots.length <= 1) return;
    setSlots(slots.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const validDates = selectedDates.filter((d) => d.trim() !== "");
    if (validDates.length === 0) {
      setErrorMsg("Select at least one date.");
      return;
    }

    // Frontend validation: check for overlapping or invalid hourly slots
    if (bookingType === "hourly") {
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (slot.start_time && slot.end_time && slot.start_time >= slot.end_time) {
          setErrorMsg(`Slot #${i + 1}: End time must be after start time.`);
          return;
        }
      }

      if (slots.length > 1) {
        for (let i = 0; i < slots.length; i++) {
          for (let j = i + 1; j < slots.length; j++) {
            const a = slots[i];
            const b = slots[j];
            if (a.start_time && a.end_time && b.start_time && b.end_time) {
              if (a.start_time < b.end_time && a.end_time > b.start_time) {
                setErrorMsg(
                  `Slots #${i + 1} (${a.start_time.slice(0, 5)}-${a.end_time.slice(0, 5)}) and #${j + 1} (${b.start_time.slice(0, 5)}-${b.end_time.slice(0, 5)}) overlap.`
                );
                return;
              }
            }
          }
        }
      }
    }

    try {
      setSaving(true);
      let created = 0;
      let errors = [];

      for (const date of validDates) {
        const payload = {
          venue_id: Number(id),
          date,
          booking_type: bookingType,
        };

        if (bookingType === "hourly") {
          payload.slots = slots;
        }

        try {
          await createAvailability(payload, token);
          created++;
        } catch (err) {
          const detail = err?.response?.data?.detail || "Unknown error";
          errors.push(`${date}: ${detail}`);
        }
      }

      if (created > 0) {
        setSuccessMsg(`Availability saved for ${created} date(s).`);
        setSelectedDates([""]);
        setSlots([{ start_time: "08:00", end_time: "09:00" }]);
        loadData();
      }

      if (errors.length > 0) {
        setErrorMsg(errors[0]);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.detail || "Unable to save availability.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSlot(slotId) {
    const confirmed = window.confirm("Delete this availability slot?");
    if (!confirmed) return;
    try {
      await deleteAvailability(slotId, token);
      setSuccessMsg("Slot deleted.");
      loadData();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Unable to delete slot.");
    }
  }

  if (loading) {
    return <Loading message="Loading availability..." />;
  }

  const supportedTypes = getSupportedTypes();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Manage Availability
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {venue?.name} &mdash; Set which dates and time slots are available for booking.
            </p>
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
              <CheckCircle size={18} className="shrink-0" />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Availability Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

            {/* Booking Type Toggle */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-gray-700">
                Booking type
              </label>
              <div className="flex flex-wrap gap-3">
                {supportedTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBookingType(type)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition ${
                      bookingType === type
                        ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50"
                    }`}
                  >
                    {type === "hourly" ? <Clock size={18} /> : <CalendarDays size={18} />}
                    {type === "hourly" ? "Hourly" : "Daily"}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-gray-700">
                {bookingType === "hourly" ? "Select date(s)" : "Select date(s) for full-day availability"}
              </label>

              {/* Preset buttons */}
              <div className="mb-4 flex flex-wrap gap-2">
                {DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.delta)}
                    className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Date input rows */}
              <div className="space-y-3">
                {selectedDates.map((dateVal, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="date"
                      value={dateVal}
                      onChange={(e) => updateDateField(index, e.target.value)}
                      className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                    {selectedDates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDateField(index)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addDateField}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                <Plus size={16} />
                Add another date
              </button>
            </div>

            {/* Hourly Slots */}
            {bookingType === "hourly" && (
              <div className="mb-8">
                <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Time slots
                </label>
                <div className="space-y-3">
                  {slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm">
                        <Clock size={18} className="shrink-0 text-gray-400" />
                        <input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => updateSlot(index, "start_time", e.target.value)}
                          required
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                        />
                        <span className="text-xs font-bold text-gray-400">TO</span>
                        <input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => updateSlot(index, "end_time", e.target.value)}
                          required
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                        />
                      </div>
                      {slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSlot(index)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addSlot}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <Plus size={16} />
                  Add time slot
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-red-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : `Save Availability for ${selectedDates.filter(d => d).length || 1} date(s)`}
            </button>

          </form>

          {/* Existing Availability */}
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Existing Availability
              </h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                {availability.length} date{availability.length !== 1 ? "s" : ""}
              </span>
            </div>

            {availability.length === 0 ? (
              <div className="py-10 text-center">
                <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-500">
                  No availability set yet. Use the form above to add dates.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availability.slice(0, visibleCount).map((day, index) => (
                  <div key={index} className="rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex min-w-[50px] flex-col items-center justify-center rounded-lg bg-red-50 px-3 py-1.5">
                          <span className="text-base font-extrabold leading-none text-red-600">
                            {new Date(day.date + "T00:00:00").getDate()}
                          </span>
                          <span className="mt-0.5 text-[10px] font-bold uppercase text-red-500">
                            {new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short" })}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          {new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", year: "numeric" })}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600">
                          {day.booking_type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {day.slots?.length || 1} slot{(day.slots?.length || 1) > 1 ? "s" : ""}
                      </span>
                    </div>

                    {day.booking_type === "daily" ? (
                      <div className="flex items-center justify-between px-5 py-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                          <CheckCircle size={16} />
                          Available &mdash; Full Day
                        </span>
                        {day.slots?.[0] && !day.slots[0].is_booked && (
                          <button
                            onClick={() => handleDeleteSlot(day.slots[0].id)}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {day.slots.map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between px-5 py-2.5">
                            <div className="flex items-center gap-3 text-sm">
                              <Clock size={14} className="text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {slot.start_time?.slice(0, 5)} &mdash; {slot.end_time?.slice(0, 5)}
                              </span>
                              {slot.is_booked && (
                                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                                  Booked
                                </span>
                              )}
                            </div>
                            {!slot.is_booked && (
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {visibleCount < availability.length && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 10)}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Load more ({visibleCount} of {availability.length})
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default ManageAvailability;