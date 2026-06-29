export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  type: "Hall" | "Rooftop" | "Lawn" | "Auditorium" | "Studio" | "Resort";
  occasions: ("Wedding" | "Corporate" | "Birthday" | "Social" | "Other")[];
  capacity: number;
  pricePerDay: number;
  pricePerSlot: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  image: string;
  images: string[];
  amenities: string[];
  description: string;
}

export const MOCK_CITIES = [
  "Kochi",
  "Bangalore",
  "Mumbai",
  "Chennai",
  "Delhi NCR",
  "Hyderabad",
  "Goa",
  "Pune"
];

export const MOCK_VENUES: Venue[] = [
  {
    id: "1",
    name: "The Grand Pearl Ballroom",
    location: "Vyttila, Kochi",
    city: "Kochi",
    type: "Hall",
    occasions: ["Wedding", "Corporate", "Social"],
    capacity: 800,
    pricePerDay: 150000,
    pricePerSlot: 65000,
    rating: 4.8,
    reviewsCount: 142,
    verified: true,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1505232458627-a7272658a1c1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600"
    ],
    amenities: ["Parking", "AC", "Catering", "AV Equipment", "Valet", "WiFi", "Decoration"],
    description: "An exquisite ballroom offering unparalleled luxury in the heart of Kochi. Features elegant high ceilings, crystal chandeliers, a grand stage, and state-of-the-art acoustics. Ideal for weddings, large corporate events, and social galas. Our in-house culinary team serves global cuisines, and our professional planners handle every detail seamlessly."
  },
  {
    id: "2",
    name: "Apex Conference & Event Center",
    location: "Indiranagar, Bangalore",
    city: "Bangalore",
    type: "Hall",
    occasions: ["Corporate", "Social"],
    capacity: 150,
    pricePerDay: 45000,
    pricePerSlot: 20000,
    rating: 4.5,
    reviewsCount: 88,
    verified: true,
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1542744094-2ab25be78b90?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
    ],
    amenities: ["Parking", "AC", "AV Equipment", "WiFi"],
    description: "Designed specifically for modern business meetings, seminars, and networking events. Equipped with ultra-fast WiFi, high-definition projectors, and video conferencing suites. Modular layouts allow settings from theater seating to round tables. Centrally located with abundant corporate dining options nearby."
  },
  {
    id: "3",
    name: "Skyline Rooftop Lounge",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    type: "Rooftop",
    occasions: ["Social", "Birthday", "Other"],
    capacity: 100,
    pricePerDay: 85000,
    pricePerSlot: 40000,
    rating: 4.7,
    reviewsCount: 65,
    verified: false,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=600"
    ],
    amenities: ["Parking", "Catering", "AV Equipment", "Valet", "WiFi", "Decoration"],
    description: "Capture the dazzling Bandra skyline and sunset views. Our rooftop lounge features sleek glass railings, comfortable lounge seating, a premium bar counter, and accent lighting. Perfect for intimate cocktail parties, birthdays, and startup launches."
  },
  {
    id: "4",
    name: "Whispering Meadows Lawn",
    location: "Kakkanad, Kochi",
    city: "Kochi",
    type: "Lawn",
    occasions: ["Wedding", "Social"],
    capacity: 1500,
    pricePerDay: 210000,
    pricePerSlot: 95000,
    rating: 4.9,
    reviewsCount: 204,
    verified: true,
    image: "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1502633017216-1676437a18a0?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"
    ],
    amenities: ["Parking", "Catering", "Valet", "Decoration"],
    description: "A sweeping 2-acre manicured green lawn framed by tropical palms and ambient garden lighting. Designed for massive outdoor celebrations and dream destination weddings. Features a dedicated catering prep zone, luxury dressing rooms, and a permanent elevated mandap stage."
  },
  {
    id: "5",
    name: "Pixel & Sound Creative Studio",
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    type: "Studio",
    occasions: ["Social", "Other"],
    capacity: 35,
    pricePerDay: 15000,
    pricePerSlot: 7000,
    rating: 4.2,
    reviewsCount: 37,
    verified: false,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=600"
    ],
    amenities: ["AC", "AV Equipment", "WiFi"],
    description: "A highly versatile, soundproofed black-box studio perfect for photography shoots, video productions, art exhibitions, podcasting, and acoustic jamming. Features adjustable overhead grid lighting, green screen backdrop options, and studio monitors."
  },
  {
    id: "6",
    name: "The Palm Banquet Hall",
    location: "Edappally, Kochi",
    city: "Kochi",
    type: "Hall",
    occasions: ["Birthday", "Social", "Corporate"],
    capacity: 300,
    pricePerDay: 60000,
    pricePerSlot: 28000,
    rating: 4.4,
    reviewsCount: 52,
    verified: true,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800&id2",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800&id2",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600&id2",
      "https://images.unsplash.com/photo-1505232458627-a7272658a1c1?auto=format&fit=crop&q=80&w=600&id2"
    ],
    amenities: ["Parking", "AC", "Catering", "AV Equipment", "WiFi", "Decoration"],
    description: "A gorgeous modern banquet hall suitable for birthdays, engagements, corporate workshops, and intimate family functions. Located near Edappally Metro station, making it highly accessible."
  },
  {
    id: "7",
    name: "The Royal Serenity Resort & Lawn",
    location: "Cherai Beach, Kochi",
    city: "Kochi",
    type: "Resort",
    occasions: ["Wedding", "Social", "Corporate"],
    capacity: 2000,
    pricePerDay: 450000,
    pricePerSlot: 200000,
    rating: 5.0,
    reviewsCount: 112,
    verified: true,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=600"
    ],
    amenities: ["Parking", "AC", "Catering", "AV Equipment", "Valet", "WiFi", "Decoration"],
    description: "A luxury beach resort boasting a massive beachfront lawn and high-end air-conditioned banquet facilities. Located near Cherai beach, it is Kochi's premier destination for ultra-luxury weddings and elite corporate retreats."
  }
];
