"use client";

import React, { createContext, useContext, useState } from "react";
import { Venue } from "@/types";
import { MOCK_VENUES } from "@/lib/mock-data";

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  city: string;
  date: string;
  timeSlot: string;
  price: number;
  guests: number;
  status: "Confirmed" | "Completed" | "Cancelled";
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "booking" | "system" | "promo";
}

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  bio: string;
  memberSince: string;
  role: "User" | "Venue Owner" | "Admin";
  stats: {
    upcoming: number;
    completed: number;
    cancelled: number;
    favorites: number;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile;
  venues: Venue[];
  bookings: Booking[];
  notifications: Notification[];
  wishlist: string[]; // venue ids
  login: (role: "User" | "Venue Owner" | "Admin") => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
  addVenue: (venueData: Partial<Venue>) => void;
  cancelBooking: (bookingId: string) => void;
  toggleWishlist: (venueId: string) => void;
  dismissNotification: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  approveVenue: (venueId: string) => void;
  rejectVenue: (venueId: string) => void;
}

const defaultUser: UserProfile = {
  name: "Amith Biju",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  email: "amith.biju@example.com",
  phone: "+91 98765 43210",
  dob: "1998-05-12",
  gender: "Male",
  address: "4B Skyline Apartments, Marine Drive",
  city: "Kochi",
  state: "Kerala",
  country: "India",
  bio: "Event planner and space enthusiast. Booking beautiful spaces across Kerala.",
  memberSince: "September 2022",
  role: "User",
  stats: {
    upcoming: 1,
    completed: 1,
    cancelled: 1,
    favorites: 3,
  },
};

const initialBookings: Booking[] = [
  {
    id: "B-88392",
    venueId: "v2",
    venueName: "Aura Sky Lounge & Pool",
    venueImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    city: "Kochi",
    date: "2026-07-12",
    timeSlot: "6:00 PM - 11:00 PM",
    price: 75000,
    guests: 150,
    status: "Confirmed",
  },
  {
    id: "B-23912",
    venueId: "v7",
    venueName: "The Glass House Cafe",
    venueImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    city: "Kochi",
    date: "2026-06-15",
    timeSlot: "4:00 PM - 8:00 PM",
    price: 12000,
    guests: 40,
    status: "Completed",
  },
  {
    id: "B-49281",
    venueId: "v3",
    venueName: "Silicon Hub Seminar Hall",
    venueImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    city: "Bangalore",
    date: "2026-05-10",
    timeSlot: "9:00 AM - 5:00 PM",
    price: 35000,
    guests: 100,
    status: "Cancelled",
  },
];

const initialNotifications: Notification[] = [
  {
    id: "n1",
    title: "Booking Confirmed",
    description: "Your booking for Aura Sky Lounge & Pool on July 12, 2026 has been successfully confirmed.",
    timestamp: "2 hours ago",
    read: false,
    type: "booking",
  },
  {
    id: "n2",
    title: "Profile Setup Complete",
    description: "Welcome to BookMyVenue! Your identity is fully verified.",
    timestamp: "3 days ago",
    read: true,
    type: "system",
  },
  {
    id: "n3",
    title: "Kochi Weekend Special",
    description: "Get up to 20% discount on sports lawns in Kochi this weekend. Use code SPORTS20.",
    timestamp: "1 week ago",
    read: true,
    type: "promo",
  },
];

const initialWishlist: string[] = ["v1", "v8", "v20"];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [wishlist, setWishlist] = useState<string[]>(initialWishlist);

  const login = (role: "User" | "Venue Owner" | "Admin") => {
    setIsLoggedIn(true);
    setUser((prev) => ({
      ...prev,
      role,
    }));
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updateUser = (updatedFields: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const addVenue = (venueData: Partial<Venue>) => {
    const newId = `v-custom-${Date.now()}`;
    const newVenue: Venue = {
      id: newId,
      name: venueData.name || "Custom Venue",
      city: venueData.city || "Kochi",
      rating: 5.0,
      reviewCount: 0,
      startingPrice: venueData.startingPrice || 10000,
      thumbnail: venueData.thumbnail || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
      capacity: venueData.capacity || 100,
      category: venueData.category || "Wedding",
      description: venueData.description || "Beautiful custom venue.",
      address: venueData.address || "123 Venue Street",
      amenities: venueData.amenities || [],
      images: venueData.images || [venueData.thumbnail || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"],
      verified: false,
      favorite: false,
      owner: {
        name: user.name,
        avatar: user.avatar,
        verified: true,
        hostingSince: "2026",
        responseTime: "within an hour",
        responseRate: "100%",
        languages: ["English"],
        bio: user.bio || "Venue Host on BookMyVenue",
      },
      rules: ["Respect the space", "Clear trash after use"],
      reviews: [],
    };

    setVenues((prev) => [newVenue, ...prev]);

    // Push system notification
    const newNotification: Notification = {
      id: `n-sys-${Date.now()}`,
      title: "Venue Published",
      description: `Your venue "${newVenue.name}" has been published successfully and is now active!`,
      timestamp: "Just now",
      read: false,
      type: "system",
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
    );

    const cancelledBooking = bookings.find((b) => b.id === bookingId);
    if (cancelledBooking) {
      // Add notification
      const newNotification: Notification = {
        id: `n-sys-${Date.now()}`,
        title: "Booking Cancelled",
        description: `You have successfully cancelled your booking for ${cancelledBooking.venueName}.`,
        timestamp: "Just now",
        read: false,
        type: "booking",
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }
  };

  const toggleWishlist = (venueId: string) => {
    setWishlist((prev) => {
      if (prev.includes(venueId)) {
        return prev.filter((id) => id !== venueId);
      } else {
        return [...prev, venueId];
      }
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const approveVenue = (venueId: string) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === venueId ? { ...v, verified: true } : v))
    );

    const venue = venues.find((v) => v.id === venueId);
    if (venue) {
      const newNotification: Notification = {
        id: `n-sys-${Date.now()}`,
        title: "Venue Approved",
        description: `Venue "${venue.name}" has been approved by the Admin and is now verified.`,
        timestamp: "Just now",
        read: false,
        type: "system",
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }
  };

  const rejectVenue = (venueId: string) => {
    setVenues((prev) => prev.filter((v) => v.id !== venueId));
  };

  // Compute dynamic stats based on other states
  const computedUser = {
    ...user,
    stats: {
      upcoming: bookings.filter((b) => b.status === "Confirmed").length,
      completed: bookings.filter((b) => b.status === "Completed").length,
      cancelled: bookings.filter((b) => b.status === "Cancelled").length,
      favorites: wishlist.length,
    },
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user: computedUser,
        venues,
        bookings,
        notifications,
        wishlist,
        login,
        logout,
        updateUser,
        addVenue,
        cancelBooking,
        toggleWishlist,
        dismissNotification,
        markAllNotificationsAsRead,
        approveVenue,
        rejectVenue,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
