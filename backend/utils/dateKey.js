// Formats a Date as a sortable "YYYY-MM-DD" string (local time).
// new Date(2026, 6, 28) -> "2026-07-28"
function toDateKey(date) {
   const y = date.getFullYear();
   const m = String(date.getMonth() + 1).padStart(2, "0");
   const d = String(date.getDate()).padStart(2, "0");
   return `${y}-${m}-${d}`;
}

module.exports = toDateKey;
