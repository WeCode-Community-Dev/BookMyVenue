export const VENUE_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "conference", label: "Conference" },
  { value: "party", label: "Party" },
  { value: "celebration", label: "Celebration" },
  { value: "other", label: "Other" },
] as const;

export type VenueType = (typeof VENUE_TYPES)[number]["value"];

export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatAddress(addr: unknown) {
  const a = addr as { city?: string; state?: string; country?: string } | null;
  if (!a) return "";
  return [a.city, a.state, a.country].filter(Boolean).join(", ");
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();
  const dateFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `${dateFmt.format(s)} · ${timeFmt.format(s)} – ${timeFmt.format(e)}`;
  return `${dateFmt.format(s)} ${timeFmt.format(s)} → ${dateFmt.format(e)} ${timeFmt.format(e)}`;
}
