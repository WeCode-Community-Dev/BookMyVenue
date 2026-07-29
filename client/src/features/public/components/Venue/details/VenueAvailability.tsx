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
    <div className="py-6 border-b border-border/50 space-y-6">
      <div className="flex items-center gap-2.5">
        <CalendarRange size={22} className="text-primary" />
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">
          Operating Hours & Availability
        </h2>
      </div>

      {isAvailabilityConfigured && availability ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface/60 rounded-2xl p-5 border border-border/40 space-y-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Operating Hours
              </span>
              <span className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                {availability.openingTime} - {availability.closingTime}
              </span>
            </div>

            <div className="bg-surface/60 rounded-2xl p-5 border border-border/40 space-y-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Hourly Rate
              </span>
              <span className="text-lg font-bold text-primary">
                ₹{availability.pricePerHour.toLocaleString()} / Hour
              </span>
            </div>

            <div className="bg-surface/60 rounded-2xl p-5 border border-border/40 space-y-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Booking Duration Limit
              </span>
              <span className="text-sm font-semibold text-foreground space-y-0.5 block">
                <span>Min: {availability.minBookingDuration} Hour(s)</span>
                {availability.maxBookingDuration && (
                  <span className="block">Max: {availability.maxBookingDuration} Hours</span>
                )}
              </span>
            </div>

            <div className="bg-surface/60 rounded-2xl p-5 border border-border/40 space-y-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Turnaround Interval
              </span>
              <span className="text-lg font-bold text-foreground">
                {availability.bufferTime ? `${availability.bufferTime} Minutes` : 'None'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider block">
              Weekly Operating Days
            </span>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day, idx) => {
                const active = isDayAvailable(idx);
                return (
                  <span
                    key={idx}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-muted/30 text-muted-foreground/60 border border-transparent line-through'
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
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-3.5">
          <Info className="text-amber-500 shrink-0" size={22} />
          <div className="text-sm text-foreground/80 font-medium">
            This venue has not configured custom operating hours. Standard venue booking defaults apply.
          </div>
        </div>
      )}
    </div>
  );
}
