export const listVenueSteps = [
  { step: 1, title: "Basics" },
  { step: 2, title: "Amenities" },
  { step: 3, title: "Photos" },
  { step: 4, title: "Review" },
] as const;

export type VenueAmenityIcon =
  | "wifi"
  | "car"
  | "shield"
  | "concierge-bell"
  | "arrow-up-down"
  | "utensils-crossed"
  | "accessibility";

export type VenueAmenity = {
  id: string;
  label: string;
  icon: VenueAmenityIcon;
};

export const listVenueProTip = {
  title: "Pro Tip",
  body: "Choose a clear, memorable venue name that highlights your space's best feature. Names with location or style keywords tend to get more bookings.",
};

export const listVenueStepContent: Record<
  number,
  {
    title: string;
    subtitle: string;
    proTip: { title: string; body: string };
  }
> = {
  1: {
    title: "List Your Venue",
    subtitle: "Let's start with the basics to get your venue discovered.",
    proTip: listVenueProTip,
  },
  2: {
    title: "Venue Amenities",
    subtitle: "Tell us what your venue offers to potential bookers.",
    proTip: {
      title: "Pro Tip",
      body: "Venues with confirmed WiFi and Accessibility information receive up to 40% more booking inquiries from corporate clients.",
    },
  },
  3: {
    title: "Venue Images",
    subtitle: "High-quality photos increase your booking rate by up to 40%.",
    proTip: listVenueProTip,
  },
  4: {
    title: "Review & Submit",
    subtitle: "Verify your details before publishing your listing.",
    proTip: listVenueProTip,
  },
};

export const reviewPublishCopy = {
  title: "Ready to Go?",
  body: "Once you click publish, your venue will be live and visible to potential bookers. You can still edit details later from your dashboard.",
  termsLabel: "I agree to the Terms of Service and Privacy Policy.",
  amenitiesLabel:
    "Confirm that all provided amenities are operational and accurately described.",
};

export const reviewVerificationCopy = {
  title: "Verification Process",
  body: "Our team reviews all new listings within 24 hours to ensure quality. You'll receive a notification once your venue is approved.",
};

export type VenueImage = {
  id: string;
  url: string;
  alt: string;
};

export const defaultVenueImages: VenueImage[] = [
  {
    id: "venue-image-1",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    alt: "Modern office exterior",
  },
  {
    id: "venue-image-2",
    url: "https://images.unsplash.com/photo-1480714378408-67e0d69b5a4c?w=800&q=80",
    alt: "City skyline view",
  },
  {
    id: "venue-image-3",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    alt: "Brick interior lounge",
  },
  {
    id: "venue-image-4",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    alt: "Conference room setup",
  },
];

export const defaultCoverImageId = defaultVenueImages[0].id;

export const venueAmenities: VenueAmenity[] = [
  { id: "wifi", label: "WiFi", icon: "wifi" },
  { id: "parking", label: "Parking", icon: "car" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "reception", label: "Reception", icon: "concierge-bell" },
  { id: "elevator", label: "Elevator", icon: "arrow-up-down" },
  { id: "cafeteria", label: "Cafeteria", icon: "utensils-crossed" },
  {
    id: "wheelchair-access",
    label: "Wheelchair Access",
    icon: "accessibility",
  },
];

export const defaultSelectedAmenityIds = ["wifi"];

export const listVenuePreviewImage =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80";

export const timezoneOptions = [
  { value: "Europe/London", label: "(GMT+00:00) London" },
  { value: "America/New_York", label: "(GMT-05:00) New York" },
  { value: "America/Chicago", label: "(GMT-06:00) Chicago" },
  { value: "America/Los_Angeles", label: "(GMT-08:00) Los Angeles" },
  { value: "Asia/Kolkata", label: "(GMT+05:30) India" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo" },
];

export const listVenueDefaultForm = {
  name: "",
  description: "",
  address: "",
  coordinates: "",
  country: "United Kingdom",
  state: "Greater London",
  city: "London",
  timezone: "Europe/London",
};

export type ListVenueBasicsForm = typeof listVenueDefaultForm;

export function formatVenueAddress(form: ListVenueBasicsForm): string {
  const parts = [form.address, form.city, form.state, form.country].filter(
    (part) => part.trim().length > 0
  );

  return parts.join(", ");
}

export function formatVenueLocation(form: ListVenueBasicsForm): string {
  const parts = [form.city, form.country].filter(
    (part) => part.trim().length > 0
  );

  return parts.length > 0 ? parts.join(", ") : "—";
}

export const TOTAL_LIST_VENUE_STEPS = listVenueSteps.length;


