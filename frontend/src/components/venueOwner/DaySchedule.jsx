import { Clock3, Users, Wallet, X } from "lucide-react";
import { HOUR_WIDTH, SCHEDULE_END, SCHEDULE_START, statusStyle, timeToFraction } from "../../utils/ownerPageUtils";

export function DaySchedule({ dayKey, bookings, onClose }) {
  const hours = [];
  for (let h = SCHEDULE_START; h <= SCHEDULE_END; h++) hours.push(h);

  const dateLabel = dayKey
    ? new Date(dayKey + "T00:00:00").toLocaleDateString("default", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm min-w-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {dayKey ? dateLabel : "Select a date"}
        </h3>
        {dayKey && (
          <button onClick={onClose} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100">
            <X size={16} />
          </button>
        )}
      </div>

      {!dayKey && (
        <p className="py-10 text-center text-sm text-gray-400">
          Click a date on the calendar to see its booking timeline.
        </p>
      )}

      {dayKey && bookings.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">
          No bookings for this date.
        </p>
      )}

      {dayKey && bookings.length > 0 && (

        <div className="max-w-full overflow-x-auto">
          <div style={{ minWidth: 160 + hours.length * HOUR_WIDTH }}>
            {/* Hour ruler */}
            <div className="flex border-b border-gray-200 pb-2" style={{ marginLeft: 160 }}>
              {hours.map((h) => (
                <div
                  key={h}
                  style={{ width: HOUR_WIDTH }}
                  className="shrink-0 text-xs text-gray-400"
                >
                  {h % 24}:00
                </div>
              ))}
            </div>


            <div className="mt-3 space-y-3">
              {bookings.map((b) => {
                const startFrac = Math.max(timeToFraction(b.start), SCHEDULE_START);
                const endFrac = Math.min(timeToFraction(b.end), SCHEDULE_END + 1);
                const left = (startFrac - SCHEDULE_START) * HOUR_WIDTH;
                const width = Math.max((endFrac - startFrac) * HOUR_WIDTH, 24);

                return (
                  <div key={b.id} className="relative h-14 flex">
                    <div className="flex h-14 w-40 shrink-0 flex-col justify-center pr-3 text-xs">
                      <span className="font-medium text-gray-800 truncate">{b.venue}</span>
                      <span className="text-gray-400 truncate">{b.customer}</span>
                    </div>
                    <div className="relative h-14" style={{ width: hours.length * HOUR_WIDTH }}>
                      <div
                        style={{ left, width }}
                        className={`absolute top-2 flex h-10 items-center gap-2 rounded-lg px-3 text-xs font-medium shadow-sm
                          ${statusStyle(b.status)}
                        `}
                      >
                        <Clock3 size={12} />
                        <span className="whitespace-nowrap">
                          {b.start}–{b.end} · ₹{b.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {dayKey && bookings.length > 0 && (
        <div className="mt-6 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{b.venue}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle(b.status)}`}>
                  {b.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users size={12} /> {b.guests}</span>
                <span className="flex items-center gap-1"><Clock3 size={12} /> {b.start}–{b.end}</span>
                <span className="flex items-center gap-1"><Wallet size={12} /> ₹{b.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}