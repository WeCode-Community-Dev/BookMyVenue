import { CalendarCheck, CalendarClock, CalendarX, LayoutList } from "lucide-react";

const statConfig = [
  {
    key: "total",
    label: "Total slots",
    icon: LayoutList,
    iconClass: "bg-red-50 text-red-600",
  },
  {
    key: "available",
    label: "Available",
    icon: CalendarClock,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "booked",
    label: "Booked",
    icon: CalendarCheck,
    iconClass: "bg-amber-50 text-amber-600",
  },
  {
    key: "inactive",
    label: "Inactive",
    icon: CalendarX,
    iconClass: "bg-gray-100 text-gray-600",
  },
];

const AvailabilitySummary = ({ stats }) => (
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
    {statConfig.map(({ key, label, icon: Icon, iconClass }) => (
      <div
        key={key}
        className="rounded-lg border border-gray-200/80 bg-white px-3 py-2.5 ring-1 ring-gray-100/80"
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${iconClass}`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold tabular-nums leading-none text-gray-900">
              {stats[key] ?? 0}
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium text-gray-500 sm:text-xs">
              {label}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AvailabilitySummary;
