import api from "../lib/axios"

const REVIEWS_API_BASE_URL =
  import.meta.env.VITE_REVIEWS_API_BASE_URL || "https://bmv.ayananth.xyz"

const reviewsConfig = { baseURL: REVIEWS_API_BASE_URL }

export function parseReviewError(error) {
  const data = error.response?.data
  if (!data) return "Something went wrong. Please try again."
  if (typeof data.detail === "string") return data.detail
  if (Array.isArray(data.detail)) {
    const first = data.detail[0]
    if (typeof first === "string") return first
    if (first?.msg) return first.msg
  }
  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0]
    const value = data[firstKey]
    if (Array.isArray(value)) return value[0]
    if (typeof value === "string") return value
  }
  return "Something went wrong. Please try again."
}

function formatReviewDate(value) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function reviewItemFromApi(item, { currentUserId, currentUserName } = {}) {
  const isOwn = currentUserId != null && item.user_id === currentUserId
  return {
    ratingId: item.rating_id,
    userId: item.user_id,
    rating: item.rating,
    reviewId: item.review_id ?? null,
    title: item.title ?? null,
    text: item.review ?? null,
    isEdited: Boolean(item.is_edited),
    createdAt: item.created_at,
    date: formatReviewDate(item.created_at),
    name: isOwn ? currentUserName || "You" : `Guest`,
    isOwn,
  }
}

export async function fetchVenueReviews(venueId, { skip = 0, limit = 20 } = {}) {
  const { data } = await api.get(`/api/venues/${venueId}/reviews`, {
    ...reviewsConfig,
    params: { skip, limit },
  })
  return data
}

export async function createVenueReview(venueId, payload) {
  const body = {
    rating: payload.rating,
  }
  if (payload.title?.trim()) body.title = payload.title.trim()
  if (payload.review?.trim()) body.review = payload.review.trim()

  const { data } = await api.post(
    `/api/venues/${venueId}/reviews`,
    body,
    reviewsConfig,
  )
  return data
}

export async function updateVenueReview(venueId, ratingId, payload) {
  const body = {}
  if (payload.rating != null) body.rating = payload.rating
  if (payload.title !== undefined) {
    body.title = payload.title?.trim() ? payload.title.trim() : null
  }
  if (payload.review !== undefined) {
    body.review = payload.review?.trim() ? payload.review.trim() : null
  }

  const { data } = await api.patch(
    `/api/venues/${venueId}/reviews/${ratingId}`,
    body,
    reviewsConfig,
  )
  return data
}

export async function deleteVenueReview(venueId, ratingId) {
  await api.delete(`/api/venues/${venueId}/reviews/${ratingId}`, reviewsConfig)
}
