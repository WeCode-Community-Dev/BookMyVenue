export interface OccupiedDuration {
  occupiedFrom: Date;
  occupiedTo: Date;
}

export function calculateOccupiedDuration(
  eventDate: Date,
  startDayOffset: number,
  startTime: string,
  endDayOffset: number,
  endTime: string,
): OccupiedDuration {
  const occupiedFrom = new Date(eventDate);
  occupiedFrom.setDate(occupiedFrom.getDate() + startDayOffset);

  const [startHour, startMinute] = startTime.split(':').map(Number);

  occupiedFrom.setHours(startHour, startMinute, 0, 0);

  const occupiedTo = new Date(eventDate);
  occupiedTo.setDate(occupiedTo.getDate() + endDayOffset);

  const [endHour, endMinute] = endTime.split(':').map(Number);

  occupiedTo.setHours(endHour, endMinute, 0, 0);

  return {
    occupiedFrom,
    occupiedTo,
  };
}
