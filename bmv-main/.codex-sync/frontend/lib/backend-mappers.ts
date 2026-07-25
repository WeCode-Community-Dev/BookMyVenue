import { Venue } from "@/types";
import {
  BackendBooking,
  BackendProfile,
  BackendRole,
  BackendVenue,
  BackendVenueAmenity,
  BackendVenueCategory,
} from "@/types/backend";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80";

const CATEGORY_LABELS: Record<BackendVenueCategory, string> = {
  WEDDING: "Wedding",
  BIRTHDAY: "Birthday",
  CONFERENCE: "Conference",
  SPORTS: "Sports",
  PARTY: "Party",
  AUDITORIUM: "Auditorium",
  RESORT: "Resort",
  MEETING: "Meeting",
  OTHER: "Other",
};

const CATEGORY_TO_BACKEND: Record<string, BackendVenueCategory> = {
  wedding: "WEDDING",
  birthday: "BIRTHDAY",
  conference: "CONFERENCE",
  sports: "SPORTS",
  party: "PARTY",
  auditorium: "AUDITORIUM",
  resort: "RESORT",
  meeting: "MEETING",
  other: "OTHER",
};

const AMENITY_LABELS: Record<BackendVenueAmenity, string> = {
  WIFI: "WiFi",
  PARKING: "Parking",
  AIR_CONDITIONING: "Air Conditioning",
  CATERING: "Catering",
  RESTROOM: "Restroom",
  SOUND_SYSTEM: "Sound System",
  PROJECTOR: "Projector",
  STAGE: "Stage",
  GENERATOR: "Generator",
  OTHER: "Other",
};

const AMENITY_TO_BACKEND: Record<string, BackendVenueAmenity> = {
  wifi: "WIFI",
  parking: "PARKING",
  "air conditioning": "AIR_CONDITIONING",
  catering: "CATERING",
  restroom: "RESTROOM",
  restrooms: "RESTROOM",
  "sound system": "SOUND_SYSTEM",
  projector: "PROJECTOR",
  stage: "STAGE",
  generator: "GENERATOR",
  other: "OTHER",
};

export function toAbsoluteAssetUrl(path?: string | null) {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${API_ORIGIN}/${path}`;
}

export function toBackendCategory(label?: string | null) {
  if (!label) return undefined;
  return CATEGORY_TO_BACKEND[label.trim().toLowerCase()];
}

export function toBackendAmenities(labels: string[] = []) {
  return labels
    .map((label) => AMENITY_TO_BACKEND[label.trim().toLowerCase()])
    .filter((value): value is BackendVenueAmenity => Boolean(value));
}

export function mapBackendRole(role: BackendRole | string): "User" | "Venue Owner" | "Admin" {
  if (role === "VENUE_OWNER") return "Venue Owner";
  if (role === "ADMIN") return "Admin";
  return "User";
}

export function mapBackendVenue(venue: BackendVenue): Venue {
  const categoryLabels = (venue.categories || []).map((category) => CATEGORY_LABELS[category] || "Other");
  const imageUrls = (venue.images || []).map((image) => toAbsoluteAssetUrl(image.imageUrl));
  const ownerName = venue.owner?.profile?.name?.trim() || "Venue Host";

  return {
    id: venue.id,
    name: venue.name,
    city: venue.city,
    rating: 0,
    reviewCount: 0,
    startingPrice: venue.price ?? 0,
    thumbnail: imageUrls[0] || FALLBACK_IMAGE,
    capacity: venue.capacity ?? 0,
    category: categoryLabels[0] || "Other",
    categories: categoryLabels,
    description: venue.description ?? undefined,
    address: venue.address,
    images: imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE],
    amenities: (venue.amenities || []).map((amenity) => AMENITY_LABELS[amenity] || "Other"),
    documents: (venue.documents || []).map((document) => ({
      type: document.type,
      documentUrl: toAbsoluteAssetUrl(document.documentUrl),
    })),
    verified: venue.status === "APPROVED",
    favorite: false,
    latitude: venue.latitude ?? undefined,
    longitude: venue.longitude ?? undefined,
    status: venue.status,
    rejectionReason: venue.rejectionReason ?? undefined,
    bookingApprovalRequired: venue.bookingApprovalRequired ?? false,
    owner: venue.owner
      ? {
          name: ownerName,
          avatar: toAbsoluteAssetUrl(venue.owner.profile?.profilePicture || null),
          verified: true,
          hostingSince: "BookMyVenue",
          responseTime: "N/A",
          responseRate: "N/A",
          languages: ["English"],
          bio: venue.owner.profile?.biography || "",
          email: venue.owner.email,
        }
      : undefined,
  };
}

export function mapBackendProfile(profile: BackendProfile, role: BackendRole) {
  return {
    name: profile.name || profile.email.split("@")[0],
    avatar: toAbsoluteAssetUrl(profile.profilePicture || null),
    email: profile.email,
    phone: profile.phoneNumber || "",
    dob: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
    gender: profile.gender || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    country: profile.country || "",
    bio: profile.biography || "",
    memberSince: "BookMyVenue",
    role: mapBackendRole(role),
  };
}

export function mapBackendBooking(booking: BackendBooking) {
  const eventStart = new Date(booking.eventStart);
  const eventEnd = new Date(booking.eventEnd);

  let status: "Confirmed" | "Completed" | "Cancelled" = "Cancelled";
  if (booking.status === "CONFIRMED") status = "Confirmed";
  else if (booking.status === "COMPLETED") status = "Completed";

  return {
    id: booking.id,
    venueId: booking.venueId,
    venueName: booking.venue?.name || "Venue",
    venueImage: toAbsoluteAssetUrl(booking.venue?.images?.[0]?.imageUrl || null),
    city: booking.venue?.city || "",
    date: eventStart.toISOString().split("T")[0],
    timeSlot: `${eventStart.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })} - ${eventEnd.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`,
    price: booking.totalAmount,
    guests: booking.guestCount,
    status,
  };
}
