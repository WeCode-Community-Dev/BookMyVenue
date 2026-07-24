export const formatSlotDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatSlotDateCompact = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTimeRange = (startTime, endTime) => {
  if (!startTime && !endTime) return "";
  if (!endTime) return startTime;
  if (!startTime) return endTime;
  return `${startTime} – ${endTime}`;
};

export const formatSlotLabel = (label) => {
  if (!label) return "";

  const labels = {
    morning: "Morning",
    evening: "Evening",
    night: "Night",
    fullday: "Full Day",
  };

  return labels[label] || label;
};

export const toDateKey = (date) => {
  if (!date) return "";

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  return new Date(date).toISOString().split("T")[0];
};

export const getTodayDateKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseLocalCalendarDate = (date) => {
  if (!date) return null;

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const isTodayCalendarDate = (date) => {
  const parsed = parseLocalCalendarDate(date);
  if (!parsed) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  return parsed.getTime() === today.getTime();
};

export const isPastDate = (date) => {
  const slotDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  slotDate.setHours(0, 0, 0, 0);
  return slotDate < today;
};

const parseTimeOnDate = (date, time) => {
  if (!date || !time) return null;

  const base = parseLocalCalendarDate(date) ?? new Date(date);
  if (Number.isNaN(base.getTime())) return null;

  base.setHours(0, 0, 0, 0);

  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);

  if (match) {
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3]?.toLowerCase();

    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;

    base.setHours(hours, minutes, 0, 0);
    return base;
  }

  return null;
};

/** True when end time on the given calendar day has already passed (today only). */
export const isEndTimePassedForDate = (date, endTime) => {
  if (!isTodayCalendarDate(date)) return false;

  const endAt = parseTimeOnDate(date, endTime);
  if (!endAt) return false;

  return endAt < new Date();
};

/** True when slot end time on its calendar day has passed. */
export const isSlotExpired = (slot) => {
  if (!slot?.date) return false;

  const endAt = parseTimeOnDate(slot.date, slot.endTime);
  if (!endAt) {
    return isPastDate(slot.date);
  }

  return endAt < new Date();
};
