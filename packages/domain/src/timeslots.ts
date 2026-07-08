// Domain layer — Timeslots

export function generateTimeslots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hStr = String(h).padStart(2, "0");
    slots.push(`${hStr}:00`);
    slots.push(`${hStr}:30`);
  }
  return slots;
}

export function slotToMinutes(slot: string): number {
  const [hStr, mStr] = slot.split(":");
  const h = parseInt(hStr || "0", 10);
  const m = parseInt(mStr || "0", 10);
  return h * 60 + m;
}

export function minutesToSlot(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Checks if a slot (e.g., "09:30") is within a disabled range (inclusive of starting slot,
 * exclusive of ending/to slot).
 * 
 * If from <= to (e.g. from = "08:00", to = "17:00"):
 *   s >= from && s < to
 * If from > to (e.g. from = "22:00", to = "06:00", wraps around midnight):
 *   s >= from || s < to
 */
export function isSlotDisabled(
  slot: string,
  disabledFrom?: string,
  disabledTo?: string
): boolean {
  if (!disabledFrom || !disabledTo) {
    return false;
  }
  const s = slot.trim();
  const from = disabledFrom.trim();
  const to = disabledTo.trim();

  if (!s || !from || !to) {
    return false;
  }

  if (from <= to) {
    return s >= from && s < to;
  } else {
    return s >= from || s < to;
  }
}

/**
 * Checks if selected slots are contiguous.
 * Converts slots to indices [0..47], sorts them, and checks if they form a consecutive range.
 */
export function isContiguous(slots: string[]): boolean {
  if (slots.length <= 1) {
    return slots.length === 1;
  }
  const indices = slots
    .map((s) => slotToMinutes(s) / 30)
    .sort((a, b) => a - b);

  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) {
      return false;
    }
  }
  return true;
}

/**
 * Converts selected slots and a date string (YYYY-MM-DD) to ISO start and end times in local timezone.
 * Assumes slots are contiguous.
 */
export function slotsToTimeRange(
  dateStr: string,
  selectedSlots: string[]
): { startIso: string; endIso: string } | null {
  if (selectedSlots.length === 0) return null;

  // Sort slots by start time
  const sorted = [...selectedSlots].sort((a, b) => slotToMinutes(a) - slotToMinutes(b));

  const firstSlot = sorted[0]!;
  const lastSlot = sorted[sorted.length - 1]!;

  const startMinutes = slotToMinutes(firstSlot);
  const endMinutes = slotToMinutes(lastSlot) + 30; // each slot is 30 mins

  const startTimeStr = minutesToSlot(startMinutes);
  // Note: if endMinutes is 1440 (24:00), we handle it by rolling over to next day
  let endDateStr = dateStr;
  let endTimeStr = minutesToSlot(endMinutes);

  if (endMinutes >= 1440) {
    // 24:00 is next day 00:00
    const d = new Date(`${dateStr}T00:00:00`);
    d.setDate(d.getDate() + 1);
    // Format YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    endDateStr = `${year}-${month}-${day}`;
    endTimeStr = "00:00";
  }

  const startLocal = `${dateStr}T${startTimeStr}:00`;
  const endLocal = `${endDateStr}T${endTimeStr}:00`;

  return {
    startIso: new Date(startLocal).toISOString(),
    endIso: new Date(endLocal).toISOString(),
  };
}
