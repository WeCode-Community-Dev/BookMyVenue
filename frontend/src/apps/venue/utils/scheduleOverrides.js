let nextId = 1

export function createOverrideClientId() {
  nextId += 1
  return `override-${nextId}-${Date.now()}`
}

function parseTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

export function formatOverrideDate(dateStr) {
  if (!dateStr) return "—"
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateStr}T00:00:00`))
}

export function formatOverrideTimeRange(override) {
  if (override.isFullDay) return "Full day"
  return `${override.start_time.slice(0, 5)} – ${override.end_time.slice(0, 5)}`
}

export function overridesOverlap(a, b) {
  if (a.override_date !== b.override_date) return false
  if (a.isFullDay || b.isFullDay) return true

  const aStart = parseTimeToMinutes(a.start_time)
  const aEnd = parseTimeToMinutes(a.end_time)
  const bStart = parseTimeToMinutes(b.start_time)
  const bEnd = parseTimeToMinutes(b.end_time)
  return aStart < bEnd && bStart < aEnd
}

export function createScheduleOverride({
  overrideDate,
  isFullDay,
  startTime,
  endTime,
  reason,
  id,
}) {
  if (!overrideDate) {
    throw new Error("Please select a date.")
  }

  let normalizedStart = null
  let normalizedEnd = null

  if (!isFullDay) {
    if (!startTime || !endTime) {
      throw new Error("Start and end time are required for a partial block.")
    }
    if (parseTimeToMinutes(endTime) <= parseTimeToMinutes(startTime)) {
      throw new Error("End time must be after start time.")
    }
    normalizedStart = startTime.slice(0, 5)
    normalizedEnd = endTime.slice(0, 5)
  }

  return {
    id: id ?? createOverrideClientId(),
    override_date: overrideDate,
    isFullDay,
    start_time: normalizedStart,
    end_time: normalizedEnd,
    is_available: false,
    reason: (reason ?? "").trim(),
  }
}

export function validateOverrideAgainstExisting(
  override,
  existingOverrides,
  excludeId = null,
) {
  for (const existing of existingOverrides) {
    if (excludeId && existing.id === excludeId) continue
    if (overridesOverlap(override, existing)) {
      const label = formatOverrideTimeRange(existing)
      throw new Error(
        `This block overlaps with an existing entry on ${formatOverrideDate(existing.override_date)} (${label}).`,
      )
    }
  }
}

export function buildScheduleOverridePayload(override) {
  return {
    override_date: override.override_date,
    start_time: override.isFullDay ? null : `${override.start_time}:00`,
    end_time: override.isFullDay ? null : `${override.end_time}:00`,
    is_available: false,
    reason: override.reason || null,
  }
}

export const OVERRIDE_BOOKING_TYPE_HINTS = {
  hourly:
    "Block a full day or specific hours. Customers won't be able to book those slots on the selected date.",
  session:
    "Block entire days or time ranges. Any session overlapping the blocked period becomes unavailable.",
  full_day:
    "Block dates when the venue cannot be booked. Use full day to close the venue completely.",
}
