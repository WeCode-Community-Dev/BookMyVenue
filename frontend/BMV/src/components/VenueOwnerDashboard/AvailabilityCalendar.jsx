import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAvailabilityCalendarAsync } from "../../modules/venueOwner/venueOwnerSlice";

const STATUS_STYLES = {
  booked: "bg-rose-900 text-white",
  pending: "bg-amber-500 text-white",
  available: "text-gray-700",
  blocked: "text-gray-400",
};

const STATUS_DOT = {
  booked: "bg-rose-900",
  pending: "bg-amber-500",
  available: "bg-emerald-500",
  blocked: "bg-gray-400",
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function toKey(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function AvailabilityCalendar({ days, loading }) {
  const dispatch = useDispatch();
  const [cursor, setCursor] = useState(() => new Date(2024, 4, 1)); // seeded to May 2024 to match mock data

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const grid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, muted: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, muted: false, key: toKey(year, month, d) });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: cells.length, muted: true });
    }
    return cells;
  }, [cursor]);

  const changeMonth = (delta) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
    setCursor(next);
    dispatch(
      fetchAvailabilityCalendarAsync(
        `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`,
      ),
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-rose-900">Availability Calendar</h3>
        <button className="text-xs font-medium text-rose-700 hover:underline">Full view</button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => changeMonth(-1)}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-700">{monthLabel}</span>
        <button
          onClick={() => changeMonth(1)}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[10px] font-semibold text-gray-400">
            {w}
          </span>
        ))}

        {loading
          ? Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-7 rounded-lg bg-gray-50 animate-pulse mx-auto w-7" />
            ))
          : grid.map((cell, i) => {
              const status = !cell.muted && days?.[cell.key];
              return (
                <div key={i} className="flex items-center justify-center">
                  <span
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium ${
                      cell.muted
                        ? "text-gray-300"
                        : status
                          ? STATUS_STYLES[status] || "text-gray-700"
                          : "text-gray-700"
                    }`}
                  >
                    {cell.day}
                  </span>
                </div>
              );
            })}
      </div>

      <div className="flex items-center gap-4 mt-5 flex-wrap">
        {Object.entries({
          booked: "Booked",
          pending: "Pending",
          available: "Available",
          blocked: "Blocked",
        }).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[key]}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default AvailabilityCalendar;
