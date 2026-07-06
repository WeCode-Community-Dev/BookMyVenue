import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, X, Users, Clock, Building2, IndianRupee } from "lucide-react";
import { fetchAvailabilityCalendarAsync, fetchMyVenuesAsync } from "../../modules/venueOwner/venueOwnerSlice";

// ─── Constants ────────────────────────────────────────────────────────────────

const WEEKDAYS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEKDAYS_FULL  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_STYLES = {
  booked:  { cell: "bg-rose-900 text-white",  dot: "bg-rose-900",  label: "Booked",    badge: "bg-rose-900 text-white" },
  pending: { cell: "bg-amber-400 text-white", dot: "bg-amber-400", label: "Pending",   badge: "bg-amber-400 text-white" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayKey() {
  const n = new Date();
  return toKey(n.getFullYear(), n.getMonth(), n.getDate());
}

function buildGrid(year, month) {
  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, muted: true });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, muted: false, key: toKey(year, month, d) });
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - daysInMonth, muted: true });
  return cells;
}

function formatDateFull(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function monthString(cursor) {
  return `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
}

function formatTimeSlot(timeStr) {
  if (!timeStr) return null;
  // "10:00:00.155000" → "10:00 AM"
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

// ─── Day Popup (shown in full-view modal when a booked date is clicked) ───────

function DayPopup({ dateKey, dayData, onClose }) {
  const s = STATUS_STYLES[dayData.status];
  return (
    <div className="absolute z-10 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 top-full mt-1 left-1/2 -translate-x-1/2">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] text-gray-400 leading-tight">{formatDateFull(dateKey)}</p>
          {s && (
            <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
              {s.label}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0">
          <X size={12} />
        </button>
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        {dayData.venue_name && (
          <div className="flex items-center gap-2">
            <Building2 size={13} className="text-gray-400 shrink-0" />
            <span className="truncate text-xs">{dayData.venue_name}</span>
          </div>
        )}
        {dayData.event_type && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 shrink-0">Event</span>
            <span className="text-xs font-medium">{dayData.event_type}</span>
          </div>
        )}
        {dayData.guest_count != null && (
          <div className="flex items-center gap-2">
            <Users size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs">{dayData.guest_count} guests</span>
          </div>
        )}
        {dayData.time_slot && (
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs">{dayData.time_slot}</span>
          </div>
        )}
        {dayData.amount != null && (
          <div className="flex items-center gap-2">
            <IndianRupee size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs font-semibold">₹{dayData.amount.toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>
      {dayData.booking_id && (
        <p className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-50">
          Booking #{dayData.booking_id}
        </p>
      )}
    </div>
  );
}

// ─── Full-View Modal ──────────────────────────────────────────────────────────

function FullCalendarModal({ onClose }) {
  const dispatch = useDispatch();
  const { calendar, venues, loading } = useSelector((s) => s.venueOwner);

  const TODAY = todayKey();
  const [cursor, setCursor]           = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); });
  const [selectedVenueId, setVenue]   = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const grid      = useMemo(() => buildGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const days      = calendar?.days || {};

  // Fetch on mount and whenever month / venue changes
  useEffect(() => {
    const params = { month: monthString(cursor) };
    if (selectedVenueId !== "all") params.venue_id = selectedVenueId;
    dispatch(fetchAvailabilityCalendarAsync(params));
    setSelectedDate(null);
  }, [cursor, selectedVenueId]);

  // Fetch venues list if not loaded
  useEffect(() => {
    if (venues.length === 0) dispatch(fetchMyVenuesAsync());
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const changeMonth = (delta) =>
    setCursor((p) => new Date(p.getFullYear(), p.getMonth() + delta, 1));

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Availability Calendar</h2>
            <p className="text-xs text-gray-400 mt-0.5">Full view of bookings across your venues</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-5">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Month nav */}
            <div className="flex items-center gap-3">
              <button onClick={() => changeMonth(-1)} className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-gray-800 min-w-[140px] text-center">{monthLabel}</span>
              <button onClick={() => changeMonth(1)} className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400">
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => { const n = new Date(); setCursor(new Date(n.getFullYear(), n.getMonth(), 1)); }}
                className="text-xs font-medium text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50"
              >
                Today
              </button>
            </div>

            {/* Venue filter */}
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-gray-400" />
              <select
                value={selectedVenueId}
                onChange={(e) => setVenue(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
              >
                <option value="all">All Venues</option>
                {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS_FULL.map((w) => (
              <div key={w} className="text-center text-xs font-semibold text-gray-400 py-2">{w}</div>
            ))}
          </div>

          {/* Grid */}
          {loading.calendar ? (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-gray-50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-y-2">
              {grid.map((cell, i) => {
                const dayData = !cell.muted && cell.key ? days[cell.key] : null;
                const status  = dayData?.status;
                const s       = status ? STATUS_STYLES[status] : null;
                const isToday = !cell.muted && cell.key === TODAY;
                const isSelected = !cell.muted && selectedDate === cell.key;

                return (
                  <div key={i} className="flex justify-center relative">
                    <button
                      disabled={cell.muted}
                      onClick={() => {
                        if (cell.muted) return;
                        setSelectedDate(isSelected ? null : cell.key);
                      }}
                      className={[
                        "w-11 h-11 flex items-center justify-center rounded-xl text-sm transition-colors",
                        cell.muted  ? "text-gray-200 cursor-default" : "cursor-pointer",
                        !cell.muted && s    ? s.cell : "",
                        !cell.muted && !s   ? "text-gray-700 hover:bg-rose-50 hover:text-rose-800" : "",
                        // Today ring — only on non-muted, non-booked cells
                        isToday && !s ? "ring-2 ring-rose-300 font-semibold" : "",
                        isSelected    ? "ring-2 ring-offset-1 ring-rose-700" : "",
                      ].join(" ")}
                    >
                      {cell.day}
                    </button>

                    {/* Popup only when date has booking data */}
                    {isSelected && dayData && (
                      <DayPopup
                        dateKey={cell.key}
                        dayData={dayData}
                        onClose={() => setSelectedDate(null)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-50 flex-wrap">
            {Object.entries(STATUS_STYLES).map(([key, s]) => (
              <span key={key} className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} /> {s.label}
              </span>
            ))}
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full ring-2 ring-rose-300 bg-white" /> Today
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-200" /> Available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mini Calendar (shown on dashboard) ───────────────────────────────────────

function AvailabilityCalendar({ days, loading }) {
  const dispatch = useDispatch();
  const TODAY = todayKey();

  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [showFullView, setShowFullView] = useState(false);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Fetch current month on mount
  useEffect(() => {
    dispatch(fetchAvailabilityCalendarAsync({ month: monthString(cursor) }));
  }, []);

  const grid = useMemo(() => buildGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);

  const changeMonth = (delta) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
    setCursor(next);
    dispatch(fetchAvailabilityCalendarAsync({ month: monthString(next) }));
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-rose-900">Availability Calendar</h3>
          <button
            onClick={() => setShowFullView(true)}
            className="text-xs font-medium text-rose-700 hover:underline"
          >
            Full view
          </button>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-gray-700">{monthLabel}</span>
          <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-y-1.5 text-center">
          {WEEKDAYS_SHORT.map((w) => (
            <span key={w} className="text-[10px] font-semibold text-gray-400">{w}</span>
          ))}

          {/* Day cells — mini version, no click popup */}
          {loading
            ? Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-7 rounded-lg bg-gray-50 animate-pulse mx-auto w-7" />
              ))
            : grid.map((cell, i) => {
                const status = !cell.muted && cell.key ? days?.[cell.key]?.status ?? days?.[cell.key] : null;
                const s      = status ? STATUS_STYLES[status] : null;
                // Only apply today ring to real, non-muted, non-booked cells
                const isToday = !cell.muted && cell.key === TODAY;

                return (
                  <div key={i} className="flex items-center justify-center">
                    <span
                      className={[
                        "w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium",
                        cell.muted ? "text-gray-300" : "",
                        !cell.muted && s    ? s.cell : "",
                        !cell.muted && !s   ? "text-gray-700" : "",
                        isToday && !s ? "ring-2 ring-rose-300 font-semibold" : "",
                      ].join(" ")}
                    >
                      {cell.day}
                    </span>
                  </div>
                );
              })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-5 flex-wrap">
          {Object.entries(STATUS_STYLES).map(([key, s]) => (
            <span key={key} className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} /> {s.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
          </span>
        </div>
      </div>

      {/* Full view modal — rendered in a portal-like fashion at root level */}
      {showFullView && <FullCalendarModal onClose={() => setShowFullView(false)} />}
    </>
  );
}

export default AvailabilityCalendar;