export function formatPrice(paise: number | null): string {
  if (paise == null) return 'Price on request'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100)
}

export function formatTime(isoTime: string): string {
  // isoTime can be "HH:MM:SS" or full ISO datetime
  const t = isoTime.length <= 8 ? `1970-01-01T${isoTime}` : isoTime
  return new Date(t).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Returns YYYY-MM-DD for a given Date */
export function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Adds `n` months to a date, returns new Date */
export function addMonths(d: Date, n: number): Date {
  const result = new Date(d)
  result.setMonth(result.getMonth() + n)
  return result
}

/** Build ISO datetime string for a given date + HH:MM time string, in venue timezone.
 *  We produce a plain local datetime and let the backend handle tz via the venue. */
export function buildISODateTime(date: string, time: string): string {
  return `${date}T${time}:00`
}

export const VENUE_TYPE_LABELS: Record<string, string> = {
  banquet_hall: 'Banquet Hall',
  wedding_hall: 'Wedding Hall',
  auditorium: 'Auditorium',
  conference_room: 'Conference Room',
  club: 'Club',
  rooftop: 'Rooftop',
  resort: 'Resort',
  lawn: 'Lawn',
  event_space: 'Event Space',
  meeting_room: 'Meeting Room',
}

export function toUtcIso(value?: string | null) {
  if (!value) return undefined

  return new Date(value).toISOString()
}

// === NEW TIMEZONE-AWARE HELPERS (Safe to add) ===
export function formatDateTz(iso: string, timezone: string = 'Asia/Kolkata'): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: timezone,
  })
}

export function formatTimeTz(iso: string, timezone: string = 'Asia/Kolkata'): string {
  const date = new Date(iso)
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  })
}

export function formatDateRangeTz(
  startIso: string,
  endIso: string,
  timezone: string = 'Asia/Kolkata'
): string {
  const startFormatted = formatDateTz(startIso, timezone)
  const endFormatted = formatDateTz(endIso, timezone)

  return startFormatted === endFormatted 
    ? startFormatted 
    : `${startFormatted} — ${endFormatted}`
}

/**
 * Formats a date as a short relative-time string, e.g. "3 hours ago",
 * "2 days ago", "just now". Mirrors date-fns' formatDistanceToNow(date,
 * { addSuffix: true }) closely enough for review timestamps, with no
 * external dependency.
 */
export function formatRelativeTime(date: string | Date): string {
  const target = typeof date === 'string' ? new Date(date) : date
  const now = new Date()

  let diffMs = now.getTime() - target.getTime()
  const suffix = diffMs >= 0 ? 'ago' : 'from now'
  diffMs = Math.abs(diffMs)

  const seconds = Math.round(diffMs / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)
  const months = Math.round(days / 30)
  const years = Math.round(days / 365)

  if (seconds < 45) return 'just now'
  if (minutes < 45) return `${minutes} minute${minutes === 1 ? '' : 's'} ${suffix}`
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ${suffix}`
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ${suffix}`
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ${suffix}`
  return `${years} year${years === 1 ? '' : 's'} ${suffix}`
}