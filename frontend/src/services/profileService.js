import { fetchCurrentUser, updateCurrentUser } from "../apis/auth"
import {
  normalizeProfileName,
  normalizeProfilePhone,
} from "../utils/profileValidation"
import { fetchBookings as fetchBookingsFromApi } from "../apis/bookings"

const mockFavouriteVenues = [
  {
    slug: "royal-convention-center",
    name: "Royal Convention Center",
    location: "Thrissur, Kerala",
    rating: 4.8,
    price: 25000,
    image: "/venues/hero-banquet.png",
  },
  {
    slug: "willow-wedding-hall",
    name: "Willow Wedding Hall",
    location: "Kochi, Kerala",
    rating: 4.9,
    price: 42000,
    image: "/venues/garden.png",
  },
  {
    slug: "summit-conference-room",
    name: "Summit Conference Room",
    location: "Kochi, Karnataka",
    rating: 4.6,
    price: 9000,
    image: "/venues/conference.png",
  },
]

export const fetchProfile = async () => {
  const user = await fetchCurrentUser()
  return {
    id: user.id,
    name: user.full_name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
  }
}

export const fetchBookings = fetchBookingsFromApi

export const fetchFavouriteVenues = async () => {
  // Future API integration: replace with GET /favourite-venues.
  return mockFavouriteVenues
}

export const updateProfile = async (profile) => {
  const user = await updateCurrentUser({
    full_name: normalizeProfileName(profile.name),
    phone: normalizeProfilePhone(profile.phone),
  })

  return {
    id: user.id,
    name: user.full_name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
  }
}
