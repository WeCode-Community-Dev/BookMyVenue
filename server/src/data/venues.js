const venues = [
  {
    name: "Kochi Grand Convention Hall",
    description:
      "A spacious convention venue suitable for weddings, receptions, exhibitions, and corporate events.",
    category: "convention center",
    district: "Ernakulam",
    town: "Kochi",
    address: "MG Road, Kochi, Ernakulam, Kerala",
    location: {
      type: "Point",
      coordinates: [76.2673, 9.9312], // [longitude, latitude]
    },   
    capacity: 400,
    pricing: {
      basePrice: 85000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["AC", "Parking", "Catering", "Stage", "Projector", "WiFi"],
    images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80"],
    contactInfo: {
      phone: "9000000001",
      email: "kochi.grand@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Trivandrum Royal Auditorium",
    description:
      "A well-equipped auditorium for weddings, cultural events, and public gatherings.",
    category: "auditorium",
    district: "Thiruvananthapuram",
    town: "Thiruvananthapuram",
    address: "Pattom, Thiruvananthapuram, Kerala", 
    location: {
      type: "Point",
      coordinates: [76.9366, 8.5241],
    },
    capacity: 600,
    pricing: {
      basePrice: 70000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["AC", "Parking", "Stage", "Dressing Room", "Generator"],
    images: ["https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80"],
    contactInfo: {
      phone: "9000000002",
      email: "trivandrum.royal@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Kozhikode Marina Banquet Hall",
    description:
      "A modern banquet hall suitable for engagement ceremonies, birthdays, and private functions.",
    category: "banquet hall",
    district: "Kozhikode",
    town: "Kozhikode",
    address: "Mavoor Road, Kozhikode, Kerala",
    location: {
      type: "Point",
      coordinates: [75.7804, 11.2588],
    },
    capacity: 400,
    pricing: {
      basePrice: 45000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["AC", "Parking", "Catering", "WiFi"],
    images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"],
    contactInfo: {
      phone: "9000000003",
      email: "kozhikode.marina@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Thrissur Heritage Wedding Hall",
    description:
      "A traditional wedding hall designed for marriage functions, receptions, and family events.",
    category: "wedding hall",
    district: "Thrissur",
    town: "Thrissur",
    address: "Swaraj Round, Thrissur, Kerala",
    location: {
      type: "Point",
      coordinates: [76.2144, 10.5276],
    },
    capacity: 700,
    pricing: {
      basePrice: 60000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["Parking", "Catering", "Stage", "Dressing Room", "Generator"],
    images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80"],
    contactInfo: {
      phone: "9000000004",
      email: "thrissur.heritage@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Kottayam Lakeview Resort Venue",
    description:
      "A resort-style venue suitable for destination weddings, corporate retreats, and private events.",
    category: "resort",
    district: "Kottayam",
    town: "Kumarakom",
    address: "Kumarakom, Kottayam, Kerala",
    
    location: {
      type: "Point",
      coordinates: [76.4292, 9.6175],
    },
    capacity: 100,
    pricing: {
      basePrice: 95000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["Parking", "Catering", "Lake View", "Outdoor Space", "WiFi"],
    images: ["https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80"],
    contactInfo: {
      phone: "9000000005",
      email: "kottayam.lakeview@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Alappuzha Backwater Outdoor Venue",
    description:
      "An outdoor event space near the backwaters for weddings, receptions, and small gatherings.",
    category: "outdoor",
    district: "Alappuzha",
    town: "Alappuzha",
    address: "Finishing Point Road, Alappuzha, Kerala",
    location: {
      type: "Point",
      coordinates: [76.3388, 9.4981],
    },
    capacity: 100,
    pricing: {
      basePrice: 50000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["Outdoor Space", "Parking", "Catering", "Generator"],
    images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80"],
    contactInfo: {
      phone: "9000000006",
      email: "alappuzha.backwater@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Kollam Sapphire Community Hall",
    description:
      "A budget-friendly community hall suitable for local events, meetings, and small functions.",
    category: "community hall",
    district: "Kollam",
    town: "Kollam",
    address: "Chinnakada, Kollam, Kerala",
    location: {
      type: "Point",
      coordinates: [76.6141, 8.8932],
    },
    capacity: 200,
    pricing: {
      basePrice: 25000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["Parking", "Stage", "Fans", "Generator"],
    images: ["https://images.unsplash.com/photo-1568530873454-e4103a0b3c71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    contactInfo: {
      phone: "9000000007",
      email: "kollam.sapphire@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Palakkad Greenfield Party Hall",
    description:
      "A compact party hall suitable for birthdays, engagement functions, and family celebrations.",
    category: "banquet hall",
    district: "Palakkad",
    town: "Palakkad",
    address: "Stadium Bypass Road, Palakkad, Kerala",
    location: {
      type: "Point",
      coordinates: [76.6548, 10.7867],
    },
    capacity: 150,
    pricing: {
      basePrice: 35000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["AC", "Parking", "Catering", "WiFi"],
    images: ["https://plus.unsplash.com/premium_photo-1661907977530-eb64ddbfb88a?q=80&w=1221&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    contactInfo: {
      phone: "9000000008",
      email: "palakkad.greenfield@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Kannur Coastal Rooftop Venue",
    description:
      "A rooftop venue suitable for small receptions, private parties, and evening gatherings.",
    category: "rooftop",
    district: "Kannur",
    town: "Kannur",
    address: "Payyambalam Road, Kannur, Kerala",
    location: {
      type: "Point",
      coordinates: [75.3704, 11.8745],
    },
    capacity: 180,
    pricing: {
      basePrice: 30000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["Sea View", "Parking", "Lighting", "Catering"],
    images: ["https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    contactInfo: {
      phone: "9000000009",
      email: "kannur.coastal@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Malappuram Crescent Wedding Hall",
    description:
      "A large wedding hall for marriage functions, receptions, and community gatherings.",
    category: "wedding hall",
    district: "Malappuram",
    town: "Malappuram",
    address: "Down Hill, Malappuram, Kerala",
    location: {
      type: "Point",
      coordinates: [76.074, 11.051],
    },
    capacity: "750",
    pricing: {
      basePrice: 55000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["Parking", "Catering", "Stage", "Dressing Room", "Generator"],
    images: ["https://images.unsplash.com/photo-1542665952-14513db15293?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    contactInfo: {
      phone: "9000000010",
      email: "malappuram.crescent@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Wayanad Misty Outdoor Venue",
    description:
      "An outdoor venue surrounded by greenery, suitable for small destination weddings and retreats.",
    category: "outdoor",
    district: "Wayanad",
    town: "Kalpetta",
    address: "Kalpetta, Wayanad, Kerala",
    location: {
      type: "Point",
      coordinates: [76.0827, 11.6102],
    },
    capacity: 100,
    pricing: {
      basePrice: 65000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["Outdoor Space", "Parking", "Mountain View", "Catering"],
    images: ["https://plus.unsplash.com/premium_photo-1673626579377-8dfda319246b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    contactInfo: {
      phone: "9000000011",
      email: "wayanad.misty@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },

  {
    name: "Kasaragod Pearl Conference Room",
    description:
      "A small conference venue suitable for business meetings, workshops, and training sessions.",
    category: "conference room",
    district: "Kasaragod",
    town: "Kasaragod",
    address: "MG Road, Kasaragod, Kerala",
    location: {
      type: "Point",
      coordinates: [74.99, 12.4996],
    },
    capacity: 250,
    pricing: {
      basePrice: 15000,
      currency: "INR",
      pricingModel: "per_day",
    },
    amenities: ["AC", "Projector", "WiFi", "Parking"],
    images: ["https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    contactInfo: {
      phone: "9000000012",
      email: "kasaragod.pearl@example.com",
      website: "",
    },
    status: "approved",
    isActive: true,
    isSeed: true,
    owner: null,
  },
];

export default venues;