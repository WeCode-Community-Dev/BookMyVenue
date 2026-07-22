"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Venue } from "@/types";
import * as authService from "@/services/auth.service";
import * as profileService from "@/services/profile.service";
import * as searchService from "@/services/search.service";
import * as venueService from "@/services/venue.service";
import * as adminService from "@/services/admin.service";
import * as bookingService from "@/services/booking.service";
import { mapBackendBooking, mapBackendProfile } from "@/lib/backend-mappers";
import { BackendRole } from "@/types/backend";

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
  wishlist: string[];
  login: (emailOrRole: string, password?: string) => Promise<void>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<UserProfile>) => Promise<void>;
  addVenue: (venueData: Partial<Venue>) => Promise<void>;
  cancelBooking: (bookingId: string) => void;
  toggleWishlist: (venueId: string) => void;
  dismissNotification: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  approveVenue: (venueId: string) => Promise<void>;
  rejectVenue: (venueId: string, reason: string) => Promise<void>;
}

const defaultUser: UserProfile = {
  name: "",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  country: "",
  bio: "",
  memberSince: "BookMyVenue",
  role: "User",
  stats: {
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    favorites: 0,
  },
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    title: "Live API Mode",
    description: "Search, profile, venue listing, admin approval, and booking history now use the backend where routes exist.",
    timestamp: "Just now",
    read: false,
    type: "system",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function mergeVenues(...lists: Venue[][]) {
  const byId = new Map<string, Venue>();
  for (const venue of lists.flat()) {
    byId.set(venue.id, { ...byId.get(venue.id), ...venue });
  }
  return Array.from(byId.values());
}

function buildGoogleAuthUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  return `${apiBaseUrl.replace(/\/$/, "")}/auth/google`;
}

function extractGoogleAuthResponse(popup: Window) {
  const raw = popup.document.body?.innerText?.trim();
  if (!raw) return null;

  return JSON.parse(raw) as { token?: string; message?: string };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [recommendedVenues, setRecommendedVenues] = useState<Venue[]>([]);
  const [myVenues, setMyVenues] = useState<Venue[]>([]);
  const [pendingVenues, setPendingVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const venues = useMemo(() => mergeVenues(myVenues, pendingVenues, recommendedVenues), [myVenues, pendingVenues, recommendedVenues]);

  const loadRecommendedVenues = async () => {
    try {
      setRecommendedVenues(await searchService.getRecommendedVenues());
    } catch (error) {
      console.error("Failed to load recommended venues:", error);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data.map(mapBackendBooking));
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
    }
  };

  const loadMyVenues = async () => {
    try {
      setMyVenues(await venueService.getMyVenues());
    } catch (error) {
      console.error("Failed to load my venues:", error);
      setMyVenues([]);
    }
  };

  const loadPendingVenues = async () => {
    try {
      setPendingVenues(await adminService.getPendingVenues());
    } catch (error) {
      console.error("Failed to load pending venues:", error);
      setPendingVenues([]);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const profileData = await profileService.getMe();
      const decoded = decodeJwtPayload(token);
      const backendRole = (decoded?.role || "USER") as BackendRole;

      setUser((prev) => ({
        ...prev,
        ...mapBackendProfile(profileData, backendRole),
        stats: prev.stats,
      }));
      setIsLoggedIn(true);

      await Promise.allSettled([
        loadRecommendedVenues(),
        loadBookings(),
        backendRole === "VENUE_OWNER" || backendRole === "ADMIN" ? loadMyVenues() : Promise.resolve(setMyVenues([])),
        backendRole === "ADMIN" ? loadPendingVenues() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error("Session verification failed:", error);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(defaultUser);
      setBookings([]);
      setMyVenues([]);
      setPendingVenues([]);
    }
  };

  useEffect(() => {
    loadRecommendedVenues();
    if (localStorage.getItem("token")) {
      fetchProfile();
    }
  }, []);

  const login = async (emailOrRole: string, password?: string) => {
    if (emailOrRole === "User" || emailOrRole === "Venue Owner" || emailOrRole === "Admin") {
      setIsLoggedIn(true);
      setUser((prev) => ({ ...prev, role: emailOrRole as UserProfile["role"] }));
      return;
    }

    const data = await authService.login({ email: emailOrRole, password: password || "" });
    localStorage.setItem("token", data.token || "");
    await fetchProfile();
  };

  const signup = async (email: string, password: string, confirmPassword: string) => {
    await authService.signUp({ email, password, confirmPassword });
  };

  const loginWithGoogle = async () => {
    if (typeof window === "undefined") {
      throw new Error("Google sign-in is only available in the browser.");
    }

    const popup = window.open(
      buildGoogleAuthUrl(),
      "bookmyvenue-google-auth",
      "width=520,height=720,menubar=no,toolbar=no,location=yes,resizable=yes,scrollbars=yes,status=no",
    );

    if (!popup) {
      throw new Error("Popup blocked. Please allow popups and try again.");
    }

    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        cleanup();
        try {
          popup.close();
        } catch {}
        reject(new Error("Google sign-in timed out. Please try again."));
      }, 120000);

      const poller = window.setInterval(async () => {
        if (popup.closed) {
          cleanup();
          reject(new Error("Google sign-in was closed before completion."));
          return;
        }

        try {
          const callbackUrl = popup.location.href;
          if (!callbackUrl) return;

          const currentUrl = new URL(callbackUrl);
          if (!currentUrl.pathname.endsWith("/auth/google/callback")) {
            return;
          }

          const authResponse = extractGoogleAuthResponse(popup);
          if (!authResponse) {
            return;
          }

          if (!authResponse.token) {
            throw new Error(authResponse.message || "Google sign-in failed.");
          }

          localStorage.setItem("token", authResponse.token);
          cleanup();
          popup.close();
          await fetchProfile();
          resolve();
        } catch (error) {
          if (error instanceof DOMException) {
            return;
          }

          cleanup();
          try {
            popup.close();
          } catch {}
          reject(error instanceof Error ? error : new Error("Google sign-in failed."));
        }
      }, 500);

      const cleanup = () => {
        window.clearTimeout(timeout);
        window.clearInterval(poller);
      };
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(defaultUser);
    setBookings([]);
    setMyVenues([]);
    setPendingVenues([]);
  };

  const updateUser = async (updatedFields: Partial<UserProfile>) => {
    const payload: Record<string, string> = {};
    if (updatedFields.name !== undefined) payload.name = updatedFields.name;
    if (updatedFields.phone !== undefined) payload.phoneNumber = updatedFields.phone;
    if (updatedFields.avatar !== undefined) payload.profilePicture = updatedFields.avatar;
    if (updatedFields.address !== undefined) payload.address = updatedFields.address;
    if (updatedFields.city !== undefined) payload.city = updatedFields.city;
    if (updatedFields.state !== undefined) payload.state = updatedFields.state;
    if (updatedFields.country !== undefined) payload.country = updatedFields.country;
    if (updatedFields.dob !== undefined) payload.dateOfBirth = updatedFields.dob;
    if (updatedFields.gender !== undefined) payload.gender = updatedFields.gender;
    if (updatedFields.bio !== undefined) payload.biography = updatedFields.bio;

    const profileData = await profileService.updateProfile(payload);
    const token = localStorage.getItem("token");
    const decoded = token ? decodeJwtPayload(token) : null;
    const backendRole = (decoded?.role || "USER") as BackendRole;

    setUser((prev) => ({
      ...prev,
      ...mapBackendProfile(profileData, backendRole),
      stats: prev.stats,
    }));
  };

  const addVenue = async (venueData: Partial<Venue>) => {
    const normalizedImageUrls = (venueData.images || [])
      .filter(Boolean)
      .filter((url, index, array) => array.indexOf(url) === index);

    const createdVenue = await venueService.createVenue({
      name: venueData.name || "Untitled Venue",
      description: venueData.description,
      city: venueData.city || "Kochi",
      address: venueData.address || "",
      latitude: venueData.latitude,
      longitude: venueData.longitude,
      capacity: venueData.capacity,
      price: venueData.startingPrice,
      categories: venueData.categories || (venueData.category ? [venueData.category] : []),
      amenities: venueData.amenities || [],
      imageUrls: normalizedImageUrls,
      documents: venueData.documents || [],
    });


    setMyVenues((prev) => [createdVenue, ...prev]);
    setNotifications((prev) => [
      {
        id: `n-sys-${Date.now()}`,
        title: "Venue Submitted",
        description: `Your venue "${createdVenue.name}" was sent to the backend and is now waiting for approval.`, 
        timestamp: "Just now",
        read: false,
        type: "system",
      },
      ...prev,
    ]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking)));
  };

  const toggleWishlist = (venueId: string) => {
    setWishlist((prev) => (prev.includes(venueId) ? prev.filter((id) => id !== venueId) : [...prev, venueId]));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const approveVenue = async (venueId: string) => {
    const result = await adminService.approveVenue(venueId);
    setPendingVenues((prev) => prev.filter((venue) => venue.id !== venueId));
    setRecommendedVenues((prev) => mergeVenues([result.venue], prev));
  };

  const rejectVenue = async (venueId: string, reason: string) => {
    await adminService.rejectVenue(venueId, reason);
    setPendingVenues((prev) => prev.filter((venue) => venue.id !== venueId));
  };

  const computedUser = {
    ...user,
    stats: {
      upcoming: bookings.filter((booking) => booking.status === "Confirmed").length,
      completed: bookings.filter((booking) => booking.status === "Completed").length,
      cancelled: bookings.filter((booking) => booking.status === "Cancelled").length,
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
        signup,
        loginWithGoogle,
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







