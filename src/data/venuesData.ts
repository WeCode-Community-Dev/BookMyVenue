export interface Venue {
  id: string;
  images: string[];
  tags: string[];
  location: string;
  capacity: number;
  rating: number;
  title: string;
  dateRange: string;
  hostType: string;
  isTopRated?: boolean;
  description: string;
  pricePerNight: number;
  fullAddress: string;
  parking: string;
  amenities: string[];
  squareFeet: number;
  catering: string;
  rules: string[];
  eventTypes: string[];
  bookingType?: 'days' | 'hours';
  cleaningGap?: number;
  openingTime?: string;
  closingTime?: string;
  status?: 'pending' | 'approved' | 'declined';
  rejectionReason?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export const sampleVenues: Venue[] = [
  {
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    ],
    tags: ['Los Angeles', '100 Guests', 'Luxury'],
    location: 'Los Angeles',
    capacity: 100,
    rating: 4.9,
    title: 'The Glass Pavilion',
    dateRange: 'Jun 12 - 18',
    hostType: 'Superhost',
    isTopRated: true,
    description: 'An architectural masterpiece featuring 360-degree glass walls, high ceilings, and stunning garden views.',
    pricePerNight: 450,
    fullAddress: '10450 Wilshire Blvd, Los Angeles, CA 90024',
    parking: 'Valet parking available for up to 80 cars, underground secure parking garage with 120 dedicated slots, and multiple active EV charging stations.',
    amenities: ['High-speed Wi-Fi', 'Professional Sound System', 'Bridal Suite', 'Full AC & Heating', 'Ambient LED Lighting', 'Outdoor Garden Area', 'Stage & Podium'],
    squareFeet: 8500,
    catering: 'In-house gourmet catering available (fully custom menu arrangements), outside licensed & insured caterers allowed upon approval.',
    rules: ['Music must transition to indoor after 11 PM', 'No confetti, glitter, or open flames permitted', 'Licensed and certified bartenders required for any alcohol service'],
    eventTypes: ['Weddings', 'Corporate Galas', 'Cocktail Receptions', 'Art Exhibitions'],
  },
  {
    id: '2',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    ],
    tags: ['Miami', '10 Guests', 'Ocean View'],
    location: 'Miami',
    capacity: 10,
    rating: 4.8,
    title: 'Sunset Bay Villa',
    dateRange: 'Jul 20 - 25',
    hostType: 'Exclusive Agency',
    isTopRated: false,
    description: 'A luxurious beachfront villa perfect for intimate weddings, corporate retreats, or elite gatherings.',
    pricePerNight: 720,
    fullAddress: '45 Ocean Drive, Key Biscayne, Miami, FL 33149',
    parking: 'Private gated driveway fitting up to 15 vehicles, surrounding street parking available, and optional customized guest shuttle arrangements.',
    amenities: ['Private Beach Access', 'Infinity Pool', 'State-of-the-Art Kitchen', 'Outdoor Barbecue & Bar', 'Smart Home Integration', 'High-speed Wi-Fi', 'Ocean View Terrace'],
    squareFeet: 5200,
    catering: 'Private gourmet chef experiences can be curated, outside catering permitted upon prior coordination and approval.',
    rules: ['Quiet hours from 10 PM to 8 AM', 'Strictly no smoking inside the premises', 'Maximum occupancy for daytime social events is 30 guests'],
    eventTypes: ['Intimate Weddings', 'Executive Retreats', 'VVIP Dinners', 'Private Celebrations'],
  },
];

export const getVenues = (): Venue[] => {
  const stored = localStorage.getItem('bookmyvenue_data');
  if (!stored) {
    localStorage.setItem('bookmyvenue_data', JSON.stringify(sampleVenues));
    return sampleVenues;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return sampleVenues;
  }
};

export const addVenue = (venue: Venue) => {
  const current = getVenues();
  const updated = [...current, venue];
  localStorage.setItem('bookmyvenue_data', JSON.stringify(updated));
};

export const updateVenueInLocalStorage = (id: string, updatedVenue: Partial<Venue>) => {
  const current = getVenues();
  const updated = current.map(v => v.id === id ? { ...v, ...updatedVenue } : v);
  localStorage.setItem('bookmyvenue_data', JSON.stringify(updated));
};

export const deleteVenueFromLocalStorage = (id: string) => {
  const current = getVenues();
  const updated = current.filter(v => v.id !== id);
  localStorage.setItem('bookmyvenue_data', JSON.stringify(updated));
};

