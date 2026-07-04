export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  status: 'active' | 'blocked';
  bookingsCount: number;
  totalSpent: number;
  complaintsCount: number;
}

export interface VenueOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  businessProofUrl: string; // Document filename / preview
  kycStatus: 'pending' | 'verified' | 'rejected';
  status: 'active' | 'blocked';
  joinedDate: string;
  venuesCount: number;
  totalBookings: number;
  revenueGenerated: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Slot {
  id: string;
  slot_name: string;
  start_time: string;
  end_time: string;
  price: number;
}

export interface Service {
  id: string;
  service_name: string;
  price: number;
}

export interface Venue {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  location: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  photos: string[];
  status: 'pending' | 'approved' | 'blocked';
  featured: boolean;
  availability: {
    days: string[]; // e.g. ["Monday", "Tuesday", ...]
    bookedDates: string[]; // e.g. ["2026-05-28", "2026-06-01"]
  };
  reviews: Review[];
  bookingCount: number;
  revenue: number;
  
  // New backend details fields
  category?: string;
  description?: string;
  venue_size?: number;
  instant_booking?: boolean;
  slots?: Slot[];
  services?: Service[];
  virtual_tour_url?: string | null;
  verification_status?: string;
  created_at?: string;
  updated_at?: string;
}


export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  venueId: string;
  venueName: string;
  ownerId: string;
  ownerName: string;
  bookingDate: string;
  eventDate: string;
  guestCount: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'failed';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  amount: number;
  commissionAmount: number;
  notes?: string;
}

export interface ComplaintReport {
  id: string;
  reporterName: string;
  reporterType: 'user' | 'owner';
  targetType: 'venue' | 'user' | 'owner';
  targetName: string;
  targetId: string;
  reason: string;
  details: string;
  date: string;
  status: 'pending' | 'resolved' | 'rejected';
}

export interface PlatformSettings {
  commissionPercentage: number;
  cancellationPolicyDays: number;
  taxSettingsPercentage: number;
  supportEmail: string;
  supportPhone: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'broadcast' | 'booking' | 'approval' | 'report';
  timestamp: string;
  sentTo: 'all' | 'owners' | 'customers';
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  active: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  discountPercentage: number;
  expiryDate: string;
  active: boolean;
}

// ==================== INITIAL SEED DATA ====================

export const initialCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '+91 98765 43210', joinedDate: '2026-01-15', status: 'active', bookingsCount: 4, totalSpent: 125000, complaintsCount: 0 },
  { id: 'CUST-002', name: 'Priya Patel', email: 'priya.patel@yahoo.com', phone: '+91 87654 32109', joinedDate: '2026-02-10', status: 'active', bookingsCount: 2, totalSpent: 90000, complaintsCount: 1 },
  { id: 'CUST-003', name: 'Rahul Verma', email: 'rahul.verma@outlook.com', phone: '+91 76543 21098', joinedDate: '2026-03-05', status: 'active', bookingsCount: 5, totalSpent: 280000, complaintsCount: 0 },
  { id: 'CUST-004', name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '+91 65432 10987', joinedDate: '2026-03-22', status: 'blocked', bookingsCount: 1, totalSpent: 45000, complaintsCount: 3 },
  { id: 'CUST-005', name: 'Vikram Singh', email: 'vikram.singh@hotmail.com', phone: '+91 95432 87654', joinedDate: '2026-04-01', status: 'active', bookingsCount: 3, totalSpent: 155000, complaintsCount: 0 },
  { id: 'CUST-006', name: 'Kavita Reddy', email: 'kavita.reddy@gmail.com', phone: '+91 88888 77777', joinedDate: '2026-05-10', status: 'active', bookingsCount: 0, totalSpent: 0, complaintsCount: 0 },
];

export const initialOwners: VenueOwner[] = [
  { id: 'OWN-001', name: 'Rajesh Gupta', email: 'rajesh@guptahotels.com', phone: '+91 99112 23344', companyName: 'Gupta Hospitality Group', businessProofUrl: 'GSTIN_GUPTA_HOSPITALITY.pdf', kycStatus: 'verified', status: 'active', joinedDate: '2025-11-20', venuesCount: 3, totalBookings: 12, revenueGenerated: 640000 },
  { id: 'OWN-002', name: 'Meera Deshmukh', email: 'meera@skydeckvenues.in', phone: '+91 98223 34455', companyName: 'Deshmukh & Sons Properties', businessProofUrl: 'PAN_DESHMUKH_PROPERTIES.pdf', kycStatus: 'verified', status: 'active', joinedDate: '2026-01-08', venuesCount: 2, totalBookings: 8, revenueGenerated: 480000 },
  { id: 'OWN-003', name: 'Sanjay Kapoor', email: 'sanjay@kapoorevents.com', phone: '+91 97334 45566', companyName: 'Kapoor Banquet & Event Spaces', businessProofUrl: 'TRADE_LICENSE_KAPOOR.pdf', kycStatus: 'pending', status: 'active', joinedDate: '2026-05-18', venuesCount: 1, totalBookings: 0, revenueGenerated: 0 },
  { id: 'OWN-004', name: 'Amit Trivedi', email: 'amit@trivedigardens.com', phone: '+91 96445 56677', companyName: 'Trivedi Heritage Lawns', businessProofUrl: 'INC_TRIVEDI_LAWNS.pdf', kycStatus: 'rejected', status: 'blocked', joinedDate: '2026-02-14', venuesCount: 1, totalBookings: 2, revenueGenerated: 110000 },
  { id: 'OWN-005', name: 'Sunita Nair', email: 'sunita.nair@grandroyal.com', phone: '+91 95556 67788', companyName: 'Grand Royal Banquets LLC', businessProofUrl: 'GSTIN_GRAND_ROYAL.pdf', kycStatus: 'pending', status: 'active', joinedDate: '2026-05-22', venuesCount: 1, totalBookings: 0, revenueGenerated: 0 },
];

export const initialVenues: Venue[] = [
  {
    id: 'VEN-001',
    name: 'The Grand Ballroom',
    ownerId: 'OWN-001',
    ownerName: 'Rajesh Gupta',
    location: 'Andheri West, Mumbai',
    capacity: 500,
    pricePerDay: 75000,
    amenities: ['Air Conditioning', 'Valet Parking', 'Stage & Sound System', 'Bridal Suite', 'Catering Kitchen'],
    photos: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'approved',
    featured: true,
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      bookedDates: ['2026-05-28', '2026-05-30', '2026-06-15']
    },
    reviews: [
      { id: 'REV-001', userName: 'Rahul Verma', rating: 5, comment: 'Absolutely magnificent! The hospitality was elite.', date: '2026-05-15' },
      { id: 'REV-002', userName: 'Aarav Sharma', rating: 4.5, comment: 'Great location and stellar acoustics. Valet parking was slightly slow.', date: '2026-04-20' }
    ],
    bookingCount: 8,
    revenue: 410000
  },
  {
    id: 'VEN-002',
    name: 'Skydeck Rooftop Garden',
    ownerId: 'OWN-002',
    ownerName: 'Meera Deshmukh',
    location: 'Connaught Place, New Delhi',
    capacity: 150,
    pricePerDay: 45000,
    amenities: ['Skyline View', 'Open-Air Bar', 'In-house DJ Space', 'Ambient Lighting', 'Generator Backup'],
    photos: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'approved',
    featured: true,
    availability: {
      days: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
      bookedDates: ['2026-05-24', '2026-05-31', '2026-06-06']
    },
    reviews: [
      { id: 'REV-003', userName: 'Priya Patel', rating: 5, comment: 'The view of the city at night is breathtaking. Highly recommend for birthdays!', date: '2026-05-02' }
    ],
    bookingCount: 6,
    revenue: 270000
  },
  {
    id: 'VEN-003',
    name: 'Kapoor Luxury Banquet Hall',
    ownerId: 'OWN-003',
    ownerName: 'Sanjay Kapoor',
    location: 'Salt Lake, Kolkata',
    capacity: 350,
    pricePerDay: 55000,
    amenities: ['Central AC', 'High-speed Wi-Fi', 'Audio-Visual Rigging', 'Decor Packages'],
    photos: [
      'https://images.unsplash.com/photo-1505232458627-a72317fac1b0?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'pending',
    featured: false,
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      bookedDates: []
    },
    reviews: [],
    bookingCount: 0,
    revenue: 0
  },
  {
    id: 'VEN-004',
    name: 'Trivedi Heritage Lawn & Villa',
    ownerId: 'OWN-004',
    ownerName: 'Amit Trivedi',
    location: 'Koregaon Park, Pune',
    capacity: 800,
    pricePerDay: 110000,
    amenities: ['1-Acre Lawn', 'Heritage Bungalow Rooms', 'Swimming Pool Access', 'Outside Catering Allowed'],
    photos: [
      'https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'blocked',
    featured: false,
    availability: {
      days: ['Friday', 'Saturday', 'Sunday'],
      bookedDates: []
    },
    reviews: [
      { id: 'REV-004', userName: 'Ananya Iyer', rating: 2, comment: 'The lawn was poorly maintained and several light fixtures did not work.', date: '2026-04-12' }
    ],
    bookingCount: 2,
    revenue: 110000
  },
  {
    id: 'VEN-005',
    name: 'Royal Heritage Glasshouse',
    ownerId: 'OWN-005',
    ownerName: 'Sunita Nair',
    location: 'Jayanagar, Bengaluru',
    capacity: 250,
    pricePerDay: 90000,
    amenities: ['Glass Roof Architecture', 'Exotic Flora Indoor', 'Custom LED Setup', 'Premium Restrooms'],
    photos: [
      'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'pending',
    featured: false,
    availability: {
      days: ['Monday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      bookedDates: []
    },
    reviews: [],
    bookingCount: 0,
    revenue: 0
  },
  {
    id: 'VEN-006',
    name: 'Premium Business Hub & Conference Center',
    ownerId: 'OWN-001',
    ownerName: 'Rajesh Gupta',
    location: 'BKC, Mumbai',
    capacity: 100,
    pricePerDay: 35000,
    amenities: ['Video Conferencing System', 'Whiteboards', 'Unlimited Espresso Bar', 'Soundproof Partitioning'],
    photos: [
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'approved',
    featured: false,
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      bookedDates: ['2026-06-02', '2026-06-03']
    },
    reviews: [],
    bookingCount: 4,
    revenue: 230000
  },
  {
    id: 'VEN-007',
    name: 'Whispering Palms Beachfront Lawn',
    ownerId: 'OWN-002',
    ownerName: 'Meera Deshmukh',
    location: 'Candolim, Goa',
    capacity: 400,
    pricePerDay: 70000,
    amenities: ['Private Beach Access', 'Sunset Vantage Deck', 'Tiki Bar Setup', 'Seafood Catering Stall'],
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'approved',
    featured: true,
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      bookedDates: []
    },
    reviews: [],
    bookingCount: 2,
    revenue: 210000
  }
];

export const initialBookings: Booking[] = [
  { id: 'BK-1001', customerId: 'CUST-001', customerName: 'Aarav Sharma', customerEmail: 'aarav.sharma@gmail.com', venueId: 'VEN-001', venueName: 'The Grand Ballroom', ownerId: 'OWN-001', ownerName: 'Rajesh Gupta', bookingDate: '2026-05-01', eventDate: '2026-05-28', guestCount: 450, status: 'upcoming', paymentStatus: 'paid', amount: 75000, commissionAmount: 9375, notes: 'Needs early setup for floral decoration at 6:00 AM.' },
  { id: 'BK-1002', customerId: 'CUST-002', customerName: 'Priya Patel', customerEmail: 'priya.patel@yahoo.com', venueId: 'VEN-002', venueName: 'Skydeck Rooftop Garden', ownerId: 'OWN-002', ownerName: 'Meera Deshmukh', bookingDate: '2026-05-10', eventDate: '2026-05-31', guestCount: 120, status: 'upcoming', paymentStatus: 'paid', amount: 45000, commissionAmount: 5625, notes: 'Requesting extra ambient lanterns.' },
  { id: 'BK-1003', customerId: 'CUST-003', customerName: 'Rahul Verma', customerEmail: 'rahul.verma@outlook.com', venueId: 'VEN-001', venueName: 'The Grand Ballroom', ownerId: 'OWN-001', ownerName: 'Rajesh Gupta', bookingDate: '2026-04-10', eventDate: '2026-05-15', guestCount: 480, status: 'completed', paymentStatus: 'paid', amount: 75000, commissionAmount: 9375 },
  { id: 'BK-1004', customerId: 'CUST-001', customerName: 'Aarav Sharma', customerEmail: 'aarav.sharma@gmail.com', venueId: 'VEN-006', venueName: 'Premium Business Hub & Conference Center', ownerId: 'OWN-001', ownerName: 'Rajesh Gupta', bookingDate: '2026-05-02', eventDate: '2026-05-20', guestCount: 80, status: 'completed', paymentStatus: 'paid', amount: 35000, commissionAmount: 4375 },
  { id: 'BK-1005', customerId: 'CUST-004', customerName: 'Ananya Iyer', customerEmail: 'ananya.iyer@gmail.com', venueId: 'VEN-004', venueName: 'Trivedi Heritage Lawn & Villa', ownerId: 'OWN-004', ownerName: 'Amit Trivedi', bookingDate: '2026-04-01', eventDate: '2026-04-12', guestCount: 650, status: 'completed', paymentStatus: 'paid', amount: 110000, commissionAmount: 13750, notes: 'Complaint filed after event.' },
  { id: 'BK-1006', customerId: 'CUST-005', customerName: 'Vikram Singh', customerEmail: 'vikram.singh@hotmail.com', venueId: 'VEN-007', venueName: 'Whispering Palms Beachfront Lawn', ownerId: 'OWN-002', ownerName: 'Meera Deshmukh', bookingDate: '2026-05-08', eventDate: '2026-05-24', guestCount: 300, status: 'completed', paymentStatus: 'paid', amount: 70000, commissionAmount: 8750 },
  { id: 'BK-1007', customerId: 'CUST-003', customerName: 'Rahul Verma', customerEmail: 'rahul.verma@outlook.com', venueId: 'VEN-001', venueName: 'The Grand Ballroom', ownerId: 'OWN-001', ownerName: 'Rajesh Gupta', bookingDate: '2026-04-15', eventDate: '2026-06-15', guestCount: 420, status: 'upcoming', paymentStatus: 'paid', amount: 75000, commissionAmount: 9375 },
  { id: 'BK-1008', customerId: 'CUST-002', customerName: 'Priya Patel', customerEmail: 'priya.patel@yahoo.com', venueId: 'VEN-002', venueName: 'Skydeck Rooftop Garden', ownerId: 'OWN-002', ownerName: 'Meera Deshmukh', bookingDate: '2026-05-05', eventDate: '2026-05-18', guestCount: 130, status: 'completed', paymentStatus: 'paid', amount: 45000, commissionAmount: 5625 },
  { id: 'BK-1009', customerId: 'CUST-005', customerName: 'Vikram Singh', customerEmail: 'vikram.singh@hotmail.com', venueId: 'VEN-006', venueName: 'Premium Business Hub & Conference Center', ownerId: 'OWN-001', ownerName: 'Rajesh Gupta', bookingDate: '2026-05-12', eventDate: '2026-06-02', guestCount: 50, status: 'upcoming', paymentStatus: 'paid', amount: 35000, commissionAmount: 4375 },
  { id: 'BK-1010', customerId: 'CUST-001', customerName: 'Aarav Sharma', customerEmail: 'aarav.sharma@gmail.com', venueId: 'VEN-002', venueName: 'Skydeck Rooftop Garden', ownerId: 'OWN-002', ownerName: 'Meera Deshmukh', bookingDate: '2026-05-01', eventDate: '2026-05-22', guestCount: 100, status: 'cancelled', paymentStatus: 'refunded', amount: 45000, commissionAmount: 5625, notes: 'Cancelled due to extreme weather forecast. Full refund requested.' },
  { id: 'BK-1011', customerId: 'CUST-006', customerName: 'Kavita Reddy', customerEmail: 'kavita.reddy@gmail.com', venueId: 'VEN-001', venueName: 'The Grand Ballroom', ownerId: 'OWN-001', ownerName: 'Rajesh Gupta', bookingDate: '2026-05-18', eventDate: '2026-05-20', guestCount: 300, status: 'failed', paymentStatus: 'failed', amount: 75000, commissionAmount: 9375, notes: 'Payment gateway timed out during processing.' }
];

export const initialReports: ComplaintReport[] = [
  {
    id: 'REP-001',
    reporterName: 'Ananya Iyer',
    reporterType: 'user',
    targetType: 'venue',
    targetName: 'Trivedi Heritage Lawn & Villa',
    targetId: 'VEN-004',
    reason: 'Spam/Fake Listings',
    details: 'The listings photos are extremely outdated. Half of the amenities like the swimming pool were locked and filled with sludge. High safety hazard!',
    date: '2026-04-13',
    status: 'pending'
  },
  {
    id: 'REP-002',
    reporterName: 'Amit Trivedi',
    reporterType: 'owner',
    targetType: 'user',
    targetName: 'Ananya Iyer',
    targetId: 'CUST-004',
    reason: 'User misconduct / property damage',
    details: 'The guests broke two glass windows in the heritage house and refused to pay security deposits.',
    date: '2026-04-14',
    status: 'resolved'
  },
  {
    id: 'REP-003',
    reporterName: 'Rahul Verma',
    reporterType: 'user',
    targetType: 'venue',
    targetName: 'The Grand Ballroom',
    targetId: 'VEN-001',
    reason: 'Cleanliness Issue',
    details: 'A couple of catering tables had dirty tablecloths at the start of the event. Resolved directly with management later, but good to record.',
    date: '2026-05-16',
    status: 'rejected'
  }
];

export const initialBanners: Banner[] = [
  { id: 'BAN-001', title: 'Monsoon Wedding Discount - 15% Off All Banquets', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200', link: '/offers/monsoon', active: true },
  { id: 'BAN-002', title: 'Top Rooftop Venues of 2026 Highlight', imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200', link: '/curated/rooftops', active: true },
  { id: 'BAN-003', title: 'Corporate Seminar Special Deals', imageUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1200', link: '/offers/corporate', active: false }
];

export const initialPromotions: Promotion[] = [
  { id: 'PROM-001', code: 'WELCOME10', discountPercentage: 10, expiryDate: '2026-12-31', active: true },
  { id: 'PROM-002', code: 'ROYALWED', discountPercentage: 15, expiryDate: '2026-08-30', active: true },
  { id: 'PROM-003', code: 'MONSOON5', discountPercentage: 5, expiryDate: '2026-06-30', active: false }
];

export const initialNotifications: SystemNotification[] = [
  { id: 'NT-001', title: 'System Maintenance Scheduled', message: 'The database will undergo brief maintenance on Sunday, May 31 at 2:00 AM IST. Please expect 10-15 minutes of downtime.', type: 'broadcast', timestamp: '2026-05-22 14:00', sentTo: 'all' },
  { id: 'NT-002', title: 'New Venue Request: Royal Heritage Glasshouse', message: 'Sunita Nair has submitted a request to approve a new venue: Royal Heritage Glasshouse.', type: 'approval', timestamp: '2026-05-22 10:15', sentTo: 'owners' },
  { id: 'NT-003', title: 'Urgent: Booking Cancellation Alert', message: 'Booking BK-1010 for Skydeck Rooftop Garden has been cancelled by customer Aarav Sharma.', type: 'booking', timestamp: '2026-05-22 09:30', sentTo: 'all' }
];

export const defaultSettings: PlatformSettings = {
  commissionPercentage: 12.5,
  cancellationPolicyDays: 2,
  taxSettingsPercentage: 18.0,
  supportEmail: 'operations@bookmyvenue.com',
  supportPhone: '+91 1800 200 400'
};

export interface Amenity {
  id: string;
  name: string;
}

export const initialAmenities: Amenity[] = [];
