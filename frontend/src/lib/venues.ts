// ── Venue types & mock data ───────────────────────────────────

export type VenueCategory =
  | "Conference"
  | "Wedding"
  | "Party"
  | "Outdoor"
  | "Workshop"
  | "Exhibition"
  | "Sports";

export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  category: VenueCategory;
  capacity: number;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  images: string[];
  description: string;
  highlights: string[];
}

// ── Gradient-based hero images (Unsplash) ─────────────────────

const MOCK_VENUES: Venue[] = [
  {
    id: "v1",
    name: "The Grand Hall",
    location: "Connaught Place, New Delhi",
    city: "New Delhi",
    category: "Wedding",
    capacity: 500,
    pricePerHour: 8500,
    rating: 4.8,
    reviewCount: 142,
    amenities: ["Wi-Fi", "Parking", "AV Equipment", "Catering", "AC", "Stage"],
    images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"],
    description:
      "A magnificent banquet hall with crystal chandeliers and a sprawling dance floor. Perfect for grand weddings and gala events. Our professional team ensures every detail is flawlessly executed.",
    highlights: ["Crystal chandeliers", "400 sq m dance floor", "On-site catering"],
  },
  {
    id: "v2",
    name: "TechHub Cowork",
    location: "Koramangala, Bengaluru",
    city: "Bengaluru",
    category: "Conference",
    capacity: 80,
    pricePerHour: 2200,
    rating: 4.6,
    reviewCount: 89,
    amenities: ["High-Speed Wi-Fi", "4K Projector", "Whiteboard", "Coffee Bar", "AC"],
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"],
    description:
      "A modern co-working conference space equipped with cutting-edge technology. Ideal for corporate meetings, product demos, and team workshops in the heart of Bangalore's startup district.",
    highlights: ["100 Mbps fibre", "Modular seating", "24/7 access"],
  },
  {
    id: "v3",
    name: "Skyline Terrace",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    category: "Party",
    capacity: 150,
    pricePerHour: 5500,
    rating: 4.9,
    reviewCount: 213,
    amenities: ["Rooftop View", "Bar Setup", "DJ Booth", "Lighting Rig", "Parking"],
    images: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80"],
    description:
      "An exclusive rooftop venue with panoramic Mumbai skyline views. Features a professional DJ booth, ambient lighting system, and a fully stocked bar. The go-to spot for premium parties.",
    highlights: ["Sea-facing sunset view", "Premium sound system", "Customisable lighting"],
  },
  {
    id: "v4",
    name: "Meadow Gardens",
    location: "Whitefield, Bengaluru",
    city: "Bengaluru",
    category: "Outdoor",
    capacity: 300,
    pricePerHour: 4000,
    rating: 4.7,
    reviewCount: 67,
    amenities: ["Open Lawn", "Tent Setup", "Parking", "Generator Backup", "Restrooms"],
    images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"],
    description:
      "A lush 2-acre garden venue perfect for outdoor celebrations. With a natural canopy of trees and beautifully manicured grounds, Meadow Gardens provides a serene backdrop for any event.",
    highlights: ["2 acres of lawn", "Tent & shamiyana available", "Ample parking"],
  },
  {
    id: "v5",
    name: "Innovation Lab",
    location: "Cyber City, Gurugram",
    city: "Gurugram",
    category: "Workshop",
    capacity: 40,
    pricePerHour: 1800,
    rating: 4.5,
    reviewCount: 54,
    amenities: ["Wi-Fi", "3D Printer", "Smart Board", "Breakout Room", "Snack Station"],
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"],
    description:
      "A purpose-built innovation lab for hackathons, design sprints, and creative workshops. Equipped with maker tools, smart boards, and dedicated breakout zones to keep ideas flowing.",
    highlights: ["Maker tools included", "Flexible layout", "Dedicated facilitator"],
  },
  {
    id: "v6",
    name: "Heritage Courtyard",
    location: "Old City, Hyderabad",
    city: "Hyderabad",
    category: "Wedding",
    capacity: 250,
    pricePerHour: 6000,
    rating: 4.8,
    reviewCount: 101,
    amenities: ["Heritage Architecture", "Catering", "AC Banquet", "Valet Parking", "Stage"],
    images: ["https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80"],
    description:
      "Nestled in a 19th-century haveli, Heritage Courtyard blends old-world charm with modern amenities. The open courtyard, intricate stonework, and traditional décor create an unforgettable setting.",
    highlights: ["Nizam-era architecture", "Open-air courtyard", "Traditional & modern décor"],
  },
  {
    id: "v7",
    name: "Expo Arena",
    location: "Salt Lake, Kolkata",
    city: "Kolkata",
    category: "Exhibition",
    capacity: 1000,
    pricePerHour: 12000,
    rating: 4.4,
    reviewCount: 38,
    amenities: ["Loading Dock", "High Ceilings", "Modular Booths", "Parking", "Broadband"],
    images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"],
    description:
      "Kolkata's premier exhibition arena with 10,000 sq ft of flexible floor space. Ideal for trade shows, product launches, and art exhibitions. Multiple loading docks for easy setup.",
    highlights: ["10,000 sq ft floor", "8m ceiling height", "Modular partition system"],
  },
  {
    id: "v8",
    name: "Arena Sports Club",
    location: "Andheri East, Mumbai",
    city: "Mumbai",
    category: "Sports",
    capacity: 200,
    pricePerHour: 3500,
    rating: 4.6,
    reviewCount: 77,
    amenities: ["Floodlights", "Changing Rooms", "Scoreboard", "Canteen", "First Aid"],
    images: ["https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80"],
    description:
      "A multi-sport facility with a full-sized indoor court, professional floodlighting, and spectator seating for 200. Available for cricket nets, basketball, badminton, and corporate sports events.",
    highlights: ["Indoor + outdoor courts", "Professional floodlights", "Coach available"],
  },
  {
    id: "v9",
    name: "Studio Lumière",
    location: "Vasant Kunj, New Delhi",
    city: "New Delhi",
    category: "Workshop",
    capacity: 30,
    pricePerHour: 2500,
    rating: 4.9,
    reviewCount: 156,
    amenities: ["Photo Studio", "Cyclorama Wall", "Lighting Kit", "Greenscreen", "Makeup Room"],
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"],
    description:
      "A professional photography and video production studio with a seamless cyclorama wall, full lighting kit, and a dedicated makeup room. Perfect for product shoots, reels, and brand campaigns.",
    highlights: ["12m cyclorama wall", "Complete lighting setup", "Post-production station"],
  },
  {
    id: "v10",
    name: "Hillview Pavilion",
    location: "Lavasa, Pune",
    city: "Pune",
    category: "Conference",
    capacity: 120,
    pricePerHour: 3200,
    rating: 4.7,
    reviewCount: 49,
    amenities: ["Hill Views", "Wi-Fi", "Projector", "Outdoor Deck", "Catering", "AC"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"],
    description:
      "A scenic hilltop conference pavilion in Lavasa with breathtaking Western Ghats views. An ideal off-site retreat for corporate strategy sessions, leadership workshops, and annual kick-offs.",
    highlights: ["Western Ghats panorama", "Outdoor deck lounge", "Team-building packages"],
  },
];

// ── Query & retrieval helpers ─────────────────────────────────

export interface VenueQuery {
  search?: string;
  category?: VenueCategory | "All";
  city?: string;
}

export function getVenues(query?: VenueQuery): Venue[] {
  let results = [...MOCK_VENUES];

  if (query?.search) {
    const q = query.search.toLowerCase();
    results = results.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q)
    );
  }

  if (query?.category && query.category !== "All") {
    results = results.filter((v) => v.category === query.category);
  }

  if (query?.city) {
    results = results.filter((v) =>
      v.city.toLowerCase().includes(query.city!.toLowerCase())
    );
  }

  return results;
}

export function getVenueById(id: string): Venue | undefined {
  return MOCK_VENUES.find((v) => v.id === id);
}

export const VENUE_CATEGORIES: VenueCategory[] = [
  "Conference",
  "Wedding",
  "Party",
  "Outdoor",
  "Workshop",
  "Exhibition",
  "Sports",
];
