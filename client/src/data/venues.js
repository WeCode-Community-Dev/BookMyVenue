const venues = [
  {
    id: 1,
    name: "The Roastery Loft",
    category: "Cafe",
    location: "Koramangala, Bangalore",
    price: 450,
    rating: 4.9,
    reviews: 184,
    capacity: 40,
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1500&q=80",
    description:
      "A cozy café ideal for meetings, birthday parties and small events.",
    phone: "+91 9876543210",
    email: "roastery@gmail.com",
    amenities: [
      "Free Wi-Fi",
      "Coffee Bar",
      "Air Conditioning",
      "Parking",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 2,
    name: "Spotlight Auditorium",
    category: "Auditorium",
    location: "Andheri West, Mumbai",
    price: 2400,
    rating: 4.8,
    reviews: 215,
    capacity: 320,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1500&q=80",
    description:
      "Large auditorium suitable for conferences, seminars and cultural events.",
    phone: "+91 9876543211",
    email: "spotlight@gmail.com",
    amenities: [
      "Projector",
      "Parking",
      "Stage",
      "Sound System",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 3,
    name: "Skyline Boardroom",
    category: "Conference",
    location: "Cyber Hub, Gurgaon",
    price: 800,
    rating: 4.7,
    reviews: 98,
    capacity: 18,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1500&q=80",
    description:
      "Modern boardroom for meetings, interviews and presentations.",
    phone: "+91 9876543212",
    email: "skyline@gmail.com",
    amenities: [
      "Wi-Fi",
      "Projector",
      "Whiteboard",
      "Air Conditioning",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 4,
    name: "Garden Bliss",
    category: "Outdoor",
    location: "Kochi",
    price: 1500,
    rating: 4.9,
    reviews: 140,
    capacity: 120,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1500&q=80",
    description:
      "Beautiful outdoor venue perfect for weddings and receptions.",
    phone: "+91 9876543213",
    email: "garden@gmail.com",
    amenities: [
      "Garden",
      "Parking",
      "Photography",
      "Dining",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 5,
    name: "Urban Workspace",
    category: "Coworking",
    location: "Bangalore",
    price: 650,
    rating: 4.6,
    reviews: 88,
    capacity: 25,
    image:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1500&q=80",
    description:
      "Professional coworking space with modern facilities.",
    phone: "+91 9876543214",
    email: "urban@gmail.com",
    amenities: [
      "Wi-Fi",
      "Coffee",
      "Meeting Room",
      "Parking",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: 6,
    name: "Royal Banquet",
    category: "Hall",
    location: "Thrissur",
    price: 3500,
    rating: 4.8,
    reviews: 215,
    capacity: 300,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80",
    description:
      "Premium banquet hall for weddings, receptions and celebrations.",
    phone: "+91 9876543215",
    email: "royal@gmail.com",
    amenities: [
      "DJ",
      "Parking",
      "Dining Hall",
      "Bridal Room",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

export default venues;