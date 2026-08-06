export const SCHEDULE_START = 6;
export const SCHEDULE_END = 23;
export const HOUR_WIDTH = 64;

export function fmtKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function statusStyle(status) {
  const map = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-600",
    completed: "bg-blue-100 text-blue-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export function timeToFraction(time) {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

export function getTotalRevenue(venueRevenue) {
  return venueRevenue.reduce((s, v) => s + v.revenue, 0);
}

export function getTotalBookings(venueRevenue) {
  return venueRevenue.reduce((s, v) => s + v.bookings, 0);
}

export function getMostProfitable(venueRevenue) {
  return [...venueRevenue].sort((a, b) => b.revenue - a.revenue)[0];
}

export function getAvgBookingValue(venueRevenue) {
  const total = getTotalRevenue(venueRevenue);
  const bookings = getTotalBookings(venueRevenue);
  return Math.round(total / bookings);
}

export function getRevenueByCategory(venueRevenue) {
  const byCategory = venueRevenue.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + v.revenue;
    return acc;
  }, {});
  return Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
}

export const CATEGORY_COLORS = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500"];