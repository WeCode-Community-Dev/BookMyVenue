import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmtKey } from "../../utils/ownerPageUtils";

const TODAY = new Date();

export function MiniCalendar({ year, month, onMonthChange, bookingsByDay, selectedDay, onSelectDay }) {
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === TODAY.getDate() && month === TODAY.getMonth() && year === TODAY.getFullYear();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMonthChange(-1)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => onMonthChange(1)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const key = fmtKey(year, month, d);
          const dayBookings = bookingsByDay[key] || [];
          const isSelected = selectedDay === key;

          return (
            <button
              key={i}
              onClick={() => onSelectDay(key)}
              className={`relative flex h-12 flex-col items-center justify-center rounded-lg text-sm transition
                ${isSelected ? "bg-red-600 text-white" : "hover:bg-gray-100 text-gray-700"}
                ${isToday(d) && !isSelected ? "ring-2 ring-red-400" : ""}
              `}
            >
              <span>{d}</span>
              {dayBookings.length > 0 && (
                <span
                  className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-red-500"
                    }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <span>Has bookings</span>
      </div>
    </div>
  );
}