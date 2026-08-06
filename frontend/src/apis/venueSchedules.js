import api from "../lib/axios"
import { parseVenueError } from "./venues"

const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
}

export const parseScheduleGroupError = parseVenueError

export function isPersistedGroupId(id) {
  if (id == null || id === "") return false
  return /^\d+$/.test(String(id))
}

export function scheduleFromApi(entry) {
  return {
    id: String(entry.id),
    name: entry.name || "",
    start_time: entry.start_time?.slice(0, 5) ?? entry.start_time,
    end_time: entry.end_time?.slice(0, 5) ?? entry.end_time,
    price: Number(entry.price),
    is_available: entry.is_available,
  }
}

export async function fetchVenueScheduleGroups(slug) {
  const { data } = await api.get(`/venues/${slug}/schedule-groups/`, apiConfig)
  return data
}

export async function createVenueScheduleGroup(slug, payload) {
  const { data } = await api.post(
    `/venues/${slug}/schedule-groups/`,
    payload,
    apiConfig,
  )
  return data
}

export async function updateVenueScheduleGroup(slug, groupId, payload) {
  const { data } = await api.put(
    `/venues/${slug}/schedule-groups/${groupId}/`,
    payload,
    apiConfig,
  )
  return data
}

export async function deleteVenueScheduleGroup(slug, groupId) {
  await api.delete(`/venues/${slug}/schedule-groups/${groupId}/`, apiConfig)
}

export function hourlyGroupFromApi(group) {
  const slots = group.schedules.map(scheduleFromApi)

  return {
    id: String(group.id),
    name: group.name,
    days: group.days,
    slots,
    openTime: slots[0]?.start_time ?? "07:00",
    closeTime: slots[slots.length - 1]?.end_time ?? "22:00",
    durationMinutes: "60",
    defaultPrice: String(slots[0]?.price ?? "500"),
  }
}

export function sessionGroupFromApi(group) {
  return {
    id: String(group.id),
    name: group.name,
    days: group.days,
    sessions: group.schedules.map(scheduleFromApi),
  }
}

export function fullDayGroupFromApi(group) {
  return {
    id: String(group.id),
    name: group.name,
    days: group.days,
    schedules: group.schedules.map(scheduleFromApi),
  }
}

export function isPersistedOverrideId(id) {
  if (id == null || id === "") return false
  return /^\d+$/.test(String(id))
}

export function overrideFromApi(entry) {
  const isFullDay =
    entry.is_full_day ??
    (entry.start_time == null && entry.end_time == null)

  return {
    id: String(entry.id),
    override_date: entry.override_date,
    isFullDay,
    start_time: entry.start_time?.slice(0, 5) ?? null,
    end_time: entry.end_time?.slice(0, 5) ?? null,
    is_available: entry.is_available,
    reason: entry.reason ?? "",
  }
}

export async function fetchVenueScheduleOverrides(slug) {
  const { data } = await api.get(`/venues/${slug}/schedule-overrides/`, apiConfig)
  return data
}

export async function createVenueScheduleOverride(slug, payload) {
  const { data } = await api.post(
    `/venues/${slug}/schedule-overrides/`,
    payload,
    apiConfig,
  )
  return data
}

export async function updateVenueScheduleOverride(slug, overrideId, payload) {
  const { data } = await api.put(
    `/venues/${slug}/schedule-overrides/${overrideId}/`,
    payload,
    apiConfig,
  )
  return data
}

export async function deleteVenueScheduleOverride(slug, overrideId) {
  await api.delete(
    `/venues/${slug}/schedule-overrides/${overrideId}/`,
    apiConfig,
  )
}

export function availabilitySlotFromApi(slot) {
  const scheduleId = slot.schedule_id ?? slot.id

  return {
    id: scheduleId,
    scheduleId,
    status: slot.status ?? "AVAILABLE",
    name: slot.name || "",
    startTime: slot.start_time?.slice(0, 5) ?? slot.start_time ?? "",
    endTime: slot.end_time?.slice(0, 5) ?? slot.end_time ?? "",
    price: Number(slot.price ?? 0),
  }
}

export async function fetchVenueAvailability(slug, date) {
  const { data } = await api.get(`/venues/${slug}/availability/`, {
    ...apiConfig,
    params: { date },
  })

  const slots = (data.slots ?? []).map(availabilitySlotFromApi)

  return {
    ...data,
    slots,
  }
}

export function getSlotUnavailableMessage(status, fallbackMessage) {
  if (fallbackMessage) return fallbackMessage

  switch (status) {
    case "BOOKED":
      return "This slot has already been booked. Please choose another."
    case "BOOKING_IN_PROGRESS":
      return "Someone is currently booking this slot. Please try again shortly."
    case "UNAVAILABLE":
      return "This schedule is not available for the selected date."
    default:
      return "This slot is no longer available. Please choose another."
  }
}

export async function checkSlotAvailability(slug, date, scheduleId) {
  const { data } = await api.get(`/venues/${slug}/availability/check/`, {
    ...apiConfig,
    params: {
      date,
      schedule_id: scheduleId,
    },
  })

  return {
    available: data.status === "AVAILABLE",
    status: data.status,
    message: data.message,
    bookingSessionExpiresAt: data.booking_session_expires_at ?? null,
  }
}

export async function verifySlotAvailability(slug, date, scheduleId) {
  try {
    const result = await checkSlotAvailability(slug, date, scheduleId)

    if (result.available) {
      return { available: true }
    }

    return {
      available: false,
      message: getSlotUnavailableMessage(result.status, result.message),
    }
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      null

    if (message) {
      return { available: false, message }
    }

    throw error
  }
}
