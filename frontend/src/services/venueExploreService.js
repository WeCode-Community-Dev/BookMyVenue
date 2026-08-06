import api from "../lib/axios"
import { fetchVenueFormCities } from "../apis/venues"
import { getCachedCities, setCachedCities } from "./cityCache"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
export const EXPLORE_VENUE_PAGE_SIZE = 12

function toExplorePageVenue(venue) {
  const category =
    typeof venue.category === "object" && venue.category
      ? venue.category
      : { id: venue.category_id, name: venue.category }

  const city =
    typeof venue.city === "object" && venue.city
      ? venue.city
      : typeof venue.location === "object" && venue.location
        ? venue.location
        : { name: venue.city, district: { name: venue.district } }

  const price = venue.min_price ?? venue.price
  const averageRating = venue.average_rating ?? venue.rating

  return {
    slug: venue.slug ?? venue.id?.toString(),
    name: venue.name,
    category,
    city,
    capacity: venue.capacity,
    price: price != null ? Number(price) : 0,
    rating: averageRating != null ? Number(averageRating) : 0,
    reviewCount: venue.review_count ?? 0,
    image: venue.cover_image ?? venue.image ?? "/placeholder.svg",
  }
}

export function priceRangeToParams(price) {
  switch (price) {
    case "Below INR 10,000":
      return { max_price: 9999 }
    case "INR 10,000 - INR 25,000":
      return { min_price: 10000, max_price: 25000 }
    case "INR 25,000 - INR 50,000":
      return { min_price: 25001, max_price: 50000 }
    case "Above INR 50,000":
      return { min_price: 50001 }
    default:
      return {}
  }
}

export function sortToOrdering(sort) {
  switch (sort) {
    case "price-low":
      return "min_price"
    case "price-high":
      return "-min_price"
    case "recommended":
    default:
      return "-created_at"
  }
}

export const fetchVenues = async ({
  min_price,
  max_price,
  ordering,
  category_id,
  city_id,
  search,
  page = 1,
  limit = EXPLORE_VENUE_PAGE_SIZE,
} = {}) => {
  const params = { limit, page }

  if (category_id != null) params.category_id = category_id
  if (city_id != null) params.city_id = city_id
  if (min_price != null) params.min_price = min_price
  if (max_price != null) params.max_price = max_price
  if (ordering) params.ordering = ordering
  if (search) params.search = search

  const { data } = await api.get("/venues/", {
    baseURL: API_BASE_URL,
    params,
  })

  const venues = data.results ?? data
  const count = data.count ?? venues.length

  return {
    venues: venues.map(toExplorePageVenue),
    count,
    totalPages: count != null ? Math.max(1, Math.ceil(count / limit)) : 1,
  }
}

export async function fetchExploreCities() {
  const cached = getCachedCities()
  if (cached) return cached

  const cities = await fetchVenueFormCities()
  setCachedCities(cities)
  return cities
}
