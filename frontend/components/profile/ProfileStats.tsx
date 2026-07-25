import React from "react";
import { CalendarDays, CheckSquare, XOctagon, Heart } from "lucide-react";

interface Stats {
  upcoming: number;
  completed: number;
  cancelled: number;
  favorites: number;
}

interface ProfileStatsProps {
  stats: Stats;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      label: "Upcoming Bookings",
      value: stats.upcoming,
      icon: <CalendarDays className="size-5 text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-100/30",
    },
    {
      label: "Completed Bookings",
      value: stats.completed,
      icon: <CheckSquare className="size-5 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100/30",
    },
    {
      label: "Cancelled Bookings",
      value: stats.cancelled,
      icon: <XOctagon className="size-5 text-rose-600" />,
      bg: "bg-rose-50 border-rose-100/30",
    },
    {
      label: "Favorite Venues",
      value: stats.favorites,
      icon: <Heart className="size-5 text-amber-600 fill-amber-50" />,
      bg: "bg-amber-50 border-amber-100/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/60 rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 hover:shadow-md transition duration-200 text-left"
        >
          <div className={`p-2.5 rounded-2xl border ${item.bg} shrink-0`}>
            {item.icon}
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {item.value}
            </p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5 leading-tight">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
