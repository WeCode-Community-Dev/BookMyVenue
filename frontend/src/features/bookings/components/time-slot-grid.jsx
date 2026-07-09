import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { formatHourAsAmPm } from '@/utils/datetime';
import { getVenueBookingEndHourNumbers, getVenueOperatingHourNumbers, isHourBlockedByExistingBooking, isHourRangeBlockedByExistingBooking } from '@/utils/slots';

export function TimeSlotGrid({ dateStr, busySlots, startHour, endHour, onSelectStart, onSelectEnd }) {
  const startHours = getVenueOperatingHourNumbers();
  const endHours = getVenueBookingEndHourNumbers();


  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-brand-text">Start time</p>
        <div className="grid grid-cols-3 gap-2">
          {startHours.map((hour) => {
            const blocked = isHourBlockedByExistingBooking(dateStr, hour, busySlots);
            const disabled = blocked;
            const selected = startHour === hour;

            return (
              <Button
                key={`start-${hour}`}
                type="button"
                size="sm"
                variant={selected ? 'default' : 'outline'}
                disabled={disabled}
                onClick={() => onSelectStart(hour)}
                className={cn('text-xs', disabled && 'opacity-50')}
              >
                {formatHourAsAmPm(hour)}
              </Button>
            );
          })}
        </div>
      </div>

      {startHour != null ? (
        <div>
          <p className="mb-2 text-sm font-medium text-brand-text">End time</p>
          <div className="grid grid-cols-3 gap-2">
            {endHours
              .filter((hour) => hour > startHour)
              .map((hour) => {
                const blocked = isHourRangeBlockedByExistingBooking(dateStr, startHour, hour, busySlots);
                const selected = endHour === hour;

                return (
                  <Button
                    key={`end-${hour}`}
                    type="button"
                    size="sm"
                    variant={selected ? 'default' : 'outline'}
                    disabled={blocked}
                    onClick={() => onSelectEnd(hour)}
                    className={cn('text-xs', blocked && 'opacity-50')}
                  >
                    {formatHourAsAmPm(hour)}
                  </Button>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
