"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Venue {
  id: string;
  name: string;
  description: string;
  capacity: number;
  location: string;
  address: string;
  pricePerHour: number;
  pricePerDay: number;
  rating: number;
  reviewsCount: number;
  type: "conference" | "wedding" | "coworking" | "studio" | "rooftop" | "garden";
  images: string[];
  amenities: string[];
  ownerId: string;
}

export interface VenueResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  imageFiles: string[]; // ⚠️ confirm actual key name from your real JSON response
  venueType: string;
  parking: boolean;
  seatingCapacity: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  totalHours: number;
  totalCost: number;
  guestName: string;
  guestEmail: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface UserSession {
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
}

interface AppContextProps {
  venues: Venue[];
  bookings: Booking[];
  role: "guest" | "host";
  setRole: (role: "guest" | "host") => void;
  user: UserSession | null;
  login: (email: string, role: "customer" | "owner" | "admin", name?: string) => boolean;
  logout: () => void;
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt">) => void;
  cancelBooking: (id: string) => void;
  addVenue: (venue: Omit<Venue, "id" | "rating" | "reviewsCount" | "ownerId">) => void;
  deleteVenue: (id: string) => void;
  updateBookingStatus: (id: string, status: "confirmed" | "cancelled") => void;
  isLoading: boolean;
}

const DEFAULT_VENUES: Venue[] = [
  {
    id: "v-1",
    name: "Summit Boardroom & Conference Center",
    description: "A premium modern boardroom equipped with state-of-the-art video conferencing systems, ergonomic chairs, and high-speed fiber internet. Ideal for corporate board meetings, executive retreats, and client presentations.",
    capacity: 20,
    location: "San Francisco",
    address: "500 Howard St, San Francisco, CA 94105",
    pricePerHour: 75,
    pricePerDay: 550,
    rating: 4.9,
    reviewsCount: 38,
    type: "conference",
    images: [
      "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["Wi-Fi", "Projector", "TV Screen", "Whiteboard", "Catering Available", "Coffee & Tea", "AC", "Sound System"],
    ownerId: "host-1"
  },
  {
    id: "v-2",
    name: "The Grand Pavilion & Ballroom",
    description: "An elegant, high-ceiling ballroom perfect for weddings, galas, and major celebrations. Includes access to a private bridal suite, a beautiful outdoor pre-function courtyard, and custom atmospheric lighting control.",
    capacity: 250,
    location: "New York",
    address: "120 Park Ave, New York, NY 10017",
    pricePerHour: 350,
    pricePerDay: 2800,
    rating: 4.8,
    reviewsCount: 64,
    type: "wedding",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["AC", "Sound System", "Parking", "Catering Available", "Wheelchair Accessible", "Stage", "Dressing Room"],
    ownerId: "host-2"
  },
  {
    id: "v-3",
    name: "Nexus Collaborative Loft",
    description: "A flexible and creative co-working event space designed with industrial-chic styling, exposed bricks, and plenty of natural sunlight. Features modular desks, lounge setups, and private phone booths.",
    capacity: 60,
    location: "Chicago",
    address: "833 W Randolph St, Chicago, IL 60607",
    pricePerHour: 90,
    pricePerDay: 700,
    rating: 4.7,
    reviewsCount: 52,
    type: "coworking",
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["Wi-Fi", "TV Screen", "Whiteboard", "Coffee & Tea", "AC", "Print/Scan facilities", "Lounge Area"],
    ownerId: "host-1"
  },
  {
    id: "v-4",
    name: "Lumina Production & Photography Studio",
    description: "A professional black-out or daylight photo studio equipped with backdrops, professional strobe lighting kit, and high-capacity electrical supply. Excellent for fashion shoots, commercial production, and video recordings.",
    capacity: 15,
    location: "Los Angeles",
    address: "1024 Grand Ave, Los Angeles, CA 90015",
    pricePerHour: 60,
    pricePerDay: 450,
    rating: 4.6,
    reviewsCount: 29,
    type: "studio",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603178455924-ef33372953bb?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["Wi-Fi", "AC", "Dressing Room", "Sound System", "Whiteboard", "Studio Lighting Kit", "Backdrops"],
    ownerId: "host-3"
  },
  {
    id: "v-5",
    name: "Aether Horizon Rooftop Lounge",
    description: "Exquisite open-air rooftop with panoramic views of the city skyline. Features premium outdoor lounge furniture, a modern fire pit, an integrated surround sound system, and a fully functional cocktail bar setup.",
    capacity: 100,
    location: "Miami",
    address: "1100 West Ave, Miami Beach, FL 33139",
    pricePerHour: 250,
    pricePerDay: 1950,
    rating: 4.95,
    reviewsCount: 81,
    type: "rooftop",
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["Sound System", "Parking", "Catering Available", "Lounge Area", "Outdoor Grill", "Bar Area", "Wi-Fi"],
    ownerId: "host-2"
  },
  {
    id: "v-6",
    name: "The Secret Garden Oasis",
    description: "A private, lush botanical garden filled with blooming flowers, winding brick paths, and a rustic wooden pergola. A romantic backdrop for boutique outdoor events, bridal showers, or high tea gatherings.",
    capacity: 80,
    location: "Austin",
    address: "2201 Barton Springs Rd, Austin, TX 78746",
    pricePerHour: 120,
    pricePerDay: 950,
    rating: 4.75,
    reviewsCount: 43,
    type: "garden",
    images: [
      "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1530731141654-5993c3016c77?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["Wi-Fi", "Parking", "Catering Available", "Wheelchair Accessible", "Lounge Area", "Outdoor Seating"],
    ownerId: "host-1"
  }
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "b-1",
    venueId: "v-1",
    venueName: "Summit Boardroom & Conference Center",
    venueImage: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800",
    date: "2026-06-20",
    startTime: "09:00",
    endTime: "13:00",
    totalHours: 4,
    totalCost: 300,
    guestName: "Alice Miller",
    guestEmail: "alice@acme.com",
    status: "confirmed",
    createdAt: "2026-06-15T09:00:00Z"
  },
  {
    id: "b-2",
    venueId: "v-3",
    venueName: "Nexus Collaborative Loft",
    venueImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
    date: "2026-06-25",
    startTime: "14:00",
    endTime: "18:00",
    totalHours: 4,
    totalCost: 360,
    guestName: "Bob Smith",
    guestEmail: "bob@gmail.com",
    status: "pending",
    createdAt: "2026-06-15T10:15:00Z"
  }
];

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [role, setRole] = useState<"guest" | "host">("guest");
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load state on mount
  useEffect(() => {
    const storedVenues = localStorage.getItem("venue_booking_venues");
    const storedBookings = localStorage.getItem("venue_booking_bookings");
    const storedRole = localStorage.getItem("venue_booking_role");
    const storedUser = localStorage.getItem("bookmyvenue_user");

    if (storedVenues) {
      setVenues(JSON.parse(storedVenues));
    } else {
      setVenues(DEFAULT_VENUES);
      localStorage.setItem("venue_booking_venues", JSON.stringify(DEFAULT_VENUES));
    }

    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      setBookings(DEFAULT_BOOKINGS);
      localStorage.setItem("venue_booking_bookings", JSON.stringify(DEFAULT_BOOKINGS));
    }

    if (storedRole === "guest" || storedRole === "host") {
      setRole(storedRole);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Sync state helpers
  const saveVenues = (newVenues: Venue[]) => {
    setVenues(newVenues);
    localStorage.setItem("venue_booking_venues", JSON.stringify(newVenues));
  };

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem("venue_booking_bookings", JSON.stringify(newBookings));
  };

  const handleSetRole = (newRole: "guest" | "host") => {
    setRole(newRole);
    localStorage.setItem("venue_booking_role", newRole);
  };

  const login = (email: string, roleType: "customer" | "owner" | "admin", name?: string) => {
    const userSession: UserSession = {
      email,
      role: roleType,
      name: name || (roleType === "admin" ? "Admin User" : roleType === "owner" ? "Venue Owner" : "Customer Guest")
    };
    setUser(userSession);
    localStorage.setItem("bookmyvenue_user", JSON.stringify(userSession));
    if (roleType === "owner") {
      setRole("host");
      localStorage.setItem("venue_booking_role", "host");
    } else {
      setRole("guest");
      localStorage.setItem("venue_booking_role", "guest");
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bookmyvenue_user");
    setRole("guest");
    localStorage.setItem("venue_booking_role", "guest");
  };

  const addBooking = (bookingData: Omit<Booking, "id" | "status" | "createdAt">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `b-${Math.random().toString(36).substring(2, 9)}`,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    saveBookings([newBooking, ...bookings]);
  };

  const cancelBooking = (id: string) => {
    const updatedBookings = bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" as const } : b
    );
    saveBookings(updatedBookings);
  };

  const addVenue = (venueData: Omit<Venue, "id" | "rating" | "reviewsCount" | "ownerId">) => {
    const newVenue: Venue = {
      ...venueData,
      id: `v-${Math.random().toString(36).substring(2, 9)}`,
      rating: 5.0,
      reviewsCount: 0,
      ownerId: "host-custom" // representing currently logged in host
    };
    saveVenues([newVenue, ...venues]);
  };

  const deleteVenue = (id: string) => {
    const updatedVenues = venues.filter((v) => v.id !== id);
    const updatedBookings = bookings.map((b) =>
      b.venueId === id ? { ...b, status: "cancelled" as const } : b
    );
    saveVenues(updatedVenues);
    saveBookings(updatedBookings);
  };

  const updateBookingStatus = (id: string, status: "confirmed" | "cancelled") => {
    const updatedBookings = bookings.map((b) =>
      b.id === id ? { ...b, status } : b
    );
    saveBookings(updatedBookings);
  };

  return (
    <AppContext.Provider
      value={{
        venues,
        bookings,
        role,
        setRole: handleSetRole,
        user,
        login,
        logout,
        addBooking,
        cancelBooking,
        addVenue,
        deleteVenue,
        updateBookingStatus,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
