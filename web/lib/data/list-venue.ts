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

export const venueAmenityIcons: Record<string, VenueAmenityIcon> = {
  Wifi: "wifi",
  Parking: "car",
  Security: "shield",
  Reception: "concierge-bell",
  Elevator: "arrow-up-down",
  Cafeteria: "utensils-crossed",
  "Wheelchair Access": "accessibility",
};


export const timezoneOptions = [
  { value: "Asia/Kolkata", label: "(GMT+05:30) India" },
  { value: "Europe/London", label: "(GMT+00:00) London" },
  { value: "America/New_York", label: "(GMT-05:00) New York" },
  { value: "America/Chicago", label: "(GMT-06:00) Chicago" },
  { value: "America/Los_Angeles", label: "(GMT-08:00) Los Angeles" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo" },
];

export const listVenueDefaultForm = {
  name: "",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
  country: "India",
  state: "Kerala",
  city: "Kozhikode",
  postalCode: "",
  timezone: "Asia/Kolkata",
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


