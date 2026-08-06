export const WEEKDAYS = [
  { value: 0, label: "Monday", short: "Mon" },
  { value: 1, label: "Tuesday", short: "Tue" },
  { value: 2, label: "Wednesday", short: "Wed" },
  { value: 3, label: "Thursday", short: "Thu" },
  { value: 4, label: "Friday", short: "Fri" },
  { value: 5, label: "Saturday", short: "Sat" },
  { value: 6, label: "Sunday", short: "Sun" },
]

let nextId = 1

export function createClientId(prefix = "id") {
  nextId += 1
  return `${prefix}-${nextId}-${Date.now()}`
}

function parseTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

function minutesToTimeString(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export function formatCompactSlotRange(startTime, endTime) {
  return `${startTime.slice(0, 2)}-${endTime.slice(0, 2)}`
}

export function formatSlotName(startTime, endTime) {
  return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`
}

export function formatIndianPrice(amount) {
  const numeric = Number(amount)
  if (Number.isNaN(numeric)) return "—"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numeric)
}

export function getAssignedDays(groups, excludeGroupId = null) {
  const assigned = new Set()
  for (const group of groups) {
    if (group.id === excludeGroupId) continue
    for (const day of group.days) assigned.add(day)
  }
  return assigned
}

export function getAvailableWeekdays(groups, excludeGroupId = null) {
  const assigned = getAssignedDays(groups, excludeGroupId)
  return WEEKDAYS.filter((day) => !assigned.has(day.value))
}

export function formatDaySelection(days) {
  if (!days.length) return "No days selected"
  const sorted = [...days].sort((a, b) => a - b)
  const labels = sorted.map((day) => WEEKDAYS.find((item) => item.value === day)?.short ?? day)

  if (sorted.length === 7) return "Every day"
  if (
    sorted.length === 5 &&
    sorted.every((day, index) => day === index)
  ) {
    return "Mon – Fri"
  }
  if (sorted.length === 2 && sorted[0] === 5 && sorted[1] === 6) {
    return "Sat – Sun"
  }

  return labels.join(", ")
}

export function generateHourlySlots({
  openTime,
  closeTime,
  durationMinutes,
  defaultPrice,
}) {
  const openMinutes = parseTimeToMinutes(openTime)
  const closeMinutes = parseTimeToMinutes(closeTime)
  const duration = Number(durationMinutes)
  const price = Number(defaultPrice)

  if (closeMinutes <= openMinutes) {
    throw new Error("Close time must be after open time.")
  }
  if (!duration || duration <= 0) {
    throw new Error("Duration must be greater than zero.")
  }
  if (Number.isNaN(price) || price < 0) {
    throw new Error("Default price must be zero or greater.")
  }

  const slots = []
  let cursor = openMinutes

  while (cursor + duration <= closeMinutes) {
    const startTime = minutesToTimeString(cursor)
    const endTime = minutesToTimeString(cursor + duration)

    slots.push({
      id: createClientId("slot"),
      name: formatSlotName(startTime, endTime),
      start_time: startTime,
      end_time: endTime,
      price,
      is_available: true,
    })

    cursor += duration
  }

  if (slots.length === 0) {
    throw new Error("No slots fit within the selected time range.")
  }

  return slots
}

export function buildScheduleGroupPayload(group) {
  return {
    name: group.name.trim(),
    days: [...group.days].sort((a, b) => a - b),
    schedules: group.slots.map((slot) => ({
      name: slot.name,
      start_time: `${slot.start_time}:00`,
      end_time: `${slot.end_time}:00`,
      price: Number(slot.price),
      is_available: slot.is_available,
    })),
  }
}

export function formatTime12Hour(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  if (minutes === 0) return `${hour12} ${period}`
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`
}

export function sessionsOverlap(a, b) {
  const aStart = parseTimeToMinutes(a.start_time)
  const aEnd = parseTimeToMinutes(a.end_time)
  const bStart = parseTimeToMinutes(b.start_time)
  const bEnd = parseTimeToMinutes(b.end_time)
  return aStart < bEnd && bStart < aEnd
}

export function createSession({ name, startTime, endTime, price, id }) {
  const trimmedName = name.trim()
  if (!trimmedName) {
    throw new Error("Session name is required.")
  }

  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)
  if (endMinutes <= startMinutes) {
    throw new Error("End time must be after start time.")
  }

  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    throw new Error("Price must be zero or greater.")
  }

  return {
    id: id ?? createClientId("session"),
    name: trimmedName,
    start_time: startTime.slice(0, 5),
    end_time: endTime.slice(0, 5),
    price: numericPrice,
    is_available: true,
  }
}

export function validateSessionAgainstExisting(session, existingSessions, excludeId = null) {
  for (const existing of existingSessions) {
    if (excludeId && existing.id === excludeId) continue
    if (sessionsOverlap(session, existing)) {
      throw new Error(
        `"${session.name}" overlaps with "${existing.name}" (${formatSlotName(existing.start_time, existing.end_time)}).`,
      )
    }
  }
}

export function buildSessionScheduleGroupPayload(group) {
  return buildScheduleEntriesPayload(group.name, group.days, group.sessions)
}

export function createSchedule({ name, startTime, endTime, price, id }) {
  const trimmedName = name.trim()
  if (!trimmedName) {
    throw new Error("Schedule name is required.")
  }

  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)
  if (endMinutes <= startMinutes) {
    throw new Error("End time must be after start time.")
  }

  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    throw new Error("Price must be zero or greater.")
  }

  return {
    id: id ?? createClientId("schedule"),
    name: trimmedName,
    start_time: startTime.slice(0, 5),
    end_time: endTime.slice(0, 5),
    price: numericPrice,
    is_available: true,
  }
}

export function validateScheduleAgainstExisting(
  schedule,
  existingSchedules,
  excludeId = null,
) {
  for (const existing of existingSchedules) {
    if (excludeId && existing.id === excludeId) continue
    if (sessionsOverlap(schedule, existing)) {
      throw new Error(
        `"${schedule.name}" overlaps with "${existing.name}" (${formatSlotName(existing.start_time, existing.end_time)}).`,
      )
    }
  }
}

function isPersistedScheduleId(id) {
  if (id == null || id === "") return false
  return /^\d+$/.test(String(id))
}

function buildScheduleEntriesPayload(name, days, schedules) {
  return {
    name: name.trim(),
    days: [...days].sort((a, b) => a - b),
    schedules: schedules.map((schedule) => ({
      ...(isPersistedScheduleId(schedule.id) ? { id: Number(schedule.id) } : {}),
      name: schedule.name,
      start_time: `${schedule.start_time}:00`,
      end_time: `${schedule.end_time}:00`,
      price: Number(schedule.price),
      is_available: schedule.is_available,
    })),
  }
}

export function buildFullDayScheduleGroupPayload(group) {
  return buildScheduleEntriesPayload(group.name, group.days, group.schedules)
}
