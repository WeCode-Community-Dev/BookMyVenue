import { Clock, Info, CalendarRange } from 'lucide-react';
import type { AvailabilityConfig } from '@/features/venues/types/venues.types';

interface VenueAvailabilityProps {
  isAvailabilityConfigured: boolean;
  availability?: AvailabilityConfig;
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function VenueAvailability({
  isAvailabilityConfigured,
  availability,
}: VenueAvailabilityProps) {
  const isDayAvailable = (dayIdx: number) => {
    return availability?.availableDays.includes(dayIdx) || false;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <CalendarRange size={18} className="text-primary animate-pulse" />
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Operating Hours & Availability
        </h2>
      </div>

      {isAvailabilityConfigured && availability ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Operating Hours
              </span>
              <span className="text-base font-extrabold text-foreground mt-1 flex items-center gap-1.5">
                <Clock size={16} className="text-primary" />
                {availability.openingTime} - {availability.closingTime}
              </span>
            </div>

            <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Hourly Cost
              </span>
              <span className="text-base font-extrabold text-primary mt-1">
                ₹{availability.pricePerHour.toLocaleString()} / Hour
              </span>
            </div>

            <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Booking Duration Limit
              </span>
              <span className="text-xs font-semibold text-foreground mt-1 space-y-0.5 block">
                <span>• Min: {availability.minBookingDuration} Hour(s)</span>
                {availability.maxBookingDuration && (
                  <span className="block">• Max: {availability.maxBookingDuration} Hours</span>
                )}
              </span>
            </div>

            <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Rest/Buffer Interval
              </span>
              <span className="text-base font-extrabold text-foreground mt-1">
                {availability.bufferTime ? `${availability.bufferTime} Minutes` : 'None'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
              Weekly Operating Days
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {weekdays.map((day, idx) => {
                const active = isDayAvailable(idx);
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      active
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:bg-emerald-500/5'
                        : 'bg-zinc-100 dark:bg-zinc-800/40 border-border text-muted/50 line-through'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
          <Info className="text-yellow-605 shrink-0" size={20} />
          <div className="text-xs text-yellow-805 dark:text-yellow-600 font-medium">
            This venue has not configured custom operating hours. Standard availability and bookings
            defaults will apply.
          </div>
        </div>
      )}
    </div>
  );
}
