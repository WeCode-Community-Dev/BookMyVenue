import { CalendarCheck, CalendarClock, CalendarX, LayoutList } from "lucide-react";

const statConfig = [
  {
    key: "total",
    label: "Total Bookings",
    icon: LayoutList,
    iconClass: "bg-red-50 text-red-600",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    icon: CalendarClock,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CalendarCheck,
    iconClass: "bg-sky-50 text-sky-600",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: CalendarX,
    iconClass: "bg-gray-100 text-gray-600",
  },
];

const BookingSummary = ({ stats }) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    {statConfig.map(({ key, label, icon: Icon, iconClass }) => (
      <div
        key={key}
        className="rounded-xl border border-gray-200/80 bg-white p-3.5 ring-1 ring-gray-100/80 sm:p-4"
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xl font-bold tabular-nums text-gray-900 sm:text-2xl">
              {stats[key] ?? 0}
            </p>
            <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
              {label}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default BookingSummary;
