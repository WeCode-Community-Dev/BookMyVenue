export type VenueStatus = "active" | "inactive";

export type Venue = {
  id: string;
  name: string;
  location: string;
  spaces: number;
  bookings: number;
  status: VenueStatus;
  image: string;
};

export const venuesSummary = {
  totalVenues: 12,
  activeBookings: 48,
  totalSpaces: 34,
};

export const venues: Venue[] = [
  {
    id: "1",
    name: "Grand Hotel Ballroom",
    location: "Chicago, IL",
    spaces: 4,
    bookings: 128,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  },
  {
    id: "2",
    name: "Pinecrest Lodge",
    location: "Asheville, NC",
    spaces: 2,
    bookings: 64,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    id: "3",
    name: "Nexus Hub Conference Center",
    location: "Seattle, WA",
    spaces: 8,
    bookings: 312,
    status: "inactive",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: "4",
    name: "The Athenaeum",
    location: "Boston, MA",
    spaces: 3,
    bookings: 89,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
];
