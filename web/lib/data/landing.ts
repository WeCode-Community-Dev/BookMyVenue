export type LandingNavLink = {
  label: string;
  href: string;
};

export type LandingStat = {
  value: string;
  label: string;
};

export type LandingCategory = {
  name: string;
  imageUrl: string;
};

export const landingNavLinks: LandingNavLink[] = [
  { label: "Venues", href: "/venues" },
  { label: "Categories", href: "#categories" },
  { label: "How It Works", href: "#how-it-works" },
];

export const landingStats: LandingStat[] = [
  { value: "1000+", label: "Verified Venues" },
  { value: "50+", label: "Global Cities" },
  { value: "5000+", label: "Monthly Bookings" },
  { value: "100%", label: "Open Source" },
];

export const landingCategories: LandingCategory[] = [
  {
    name: "Auditoriums",
    imageUrl:
      "https://images.unsplash.com/photo-1505373877841-8d25f39c963f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Meeting Rooms",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Wedding Halls",
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sports Venues",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-a12f38278361?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Studios",
    imageUrl:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231bb00?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cafes",
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Community Halls",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Outdoor Spaces",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
  },
];

export const landingHowItWorksSteps = [
  {
    step: 1,
    title: "Search & Discover",
    description:
      "Browse venues by location, date, and occasion to find the perfect space.",
  },
  {
    step: 2,
    title: "Book Instantly",
    description:
      "Check availability and reserve your venue with a few simple clicks.",
  },
  {
    step: 3,
    title: "Host Your Event",
    description:
      "Show up and enjoy — your venue is ready for your special occasion.",
  },
] as const;
