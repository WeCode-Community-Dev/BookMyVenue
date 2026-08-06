import api from "../lib/axios"

export function parseContactError(error) {
  const data = error.response?.data
  if (!data) return "Something went wrong. Please try again."
  if (typeof data.message === "string") return data.message
  if (typeof data.detail === "string") return data.detail

  const fieldMessages = [
    "full_name",
    "email",
    "phone",
    "city",
    "venue_name",
    "message",
    "role",
  ]
  for (const field of fieldMessages) {
    if (data[field]) {
      return Array.isArray(data[field]) ? data[field][0] : data[field]
    }
  }

  return "Something went wrong. Please try again."
}

export async function submitContact(payload) {
  const { data } = await api.post("/contact/", payload)
  return data
}
