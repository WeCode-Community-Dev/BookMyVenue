import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import type { UpcomingBookingProps } from '@/features/dashboard/types/ownerDashbord.types';

export default function UpcomingBookings({ data }: UpcomingBookingProps) {
  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
            Schedule
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-black dark:text-white leading-none mb-6">
          Upcoming <span className="text-[#e21a47]">Bookings</span>
        </h2>

        <div className="space-y-4">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              </div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                No upcoming bookings
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-[200px] mx-auto">
                New bookings will show up in your schedule.
              </p>
            </div>
          ) : (
            data.map((booking) => (
              <div
                key={booking.id}
                className="group p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 hover:border-[#e21a47]/20 dark:hover:border-[#e21a47]/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-black dark:text-white group-hover:text-[#e21a47] transition-colors duration-200">
                      {booking.venueName}
                    </h4>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      {booking.customer} • {booking.guests} Guests
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#e21a47]/70" />
                    {booking.date}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {booking.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button className="w-full mt-6 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[#e21a47]/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer">
        View All Bookings
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
}
