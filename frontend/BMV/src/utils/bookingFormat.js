function parseTime(value) {
  if (!value) return "";
  const str = String(value);
  return str.length >= 5 ? str.slice(0, 5) : str;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime12(t) {
  if (!t) return "";
  const timeStr = parseTime(t);
  return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function countBookingDays(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) return 1;
  const start = new Date(`${checkInDate}T00:00:00`);
  const end = new Date(`${checkOutDate}T00:00:00`);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

export function formatBookingPeriod(booking) {
  if (!booking) return "";

  const checkInDate = booking.check_in_date ?? booking.booking_date;
  const checkInTime = booking.check_in_time ?? booking.time_slot;
  const checkOutDate = booking.check_out_date ?? booking.booking_date;
  const checkOutTime = booking.check_out_time ?? "23:59:59";
  const numDays =
    booking.num_days ?? countBookingDays(checkInDate, checkOutDate);

  const sameDay = checkInDate === checkOutDate;
  if (sameDay) {
    return `${formatDate(checkInDate)} · ${formatTime12(checkInTime)} – ${formatTime12(checkOutTime)} (1 day)`;
  }

  return `${formatDate(checkInDate)} ${formatTime12(checkInTime)} → ${formatDate(checkOutDate)} ${formatTime12(checkOutTime)} (${numDays} days)`;
}

export function formatBookingShort(booking) {
  return formatBookingPeriod(booking);
}
