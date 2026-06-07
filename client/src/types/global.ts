// src/types/index.ts

export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Venue {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  slug: string;
  pricePerHour: number;
  capacity: number;
  address: string;
  images: string[];
  isVerified: boolean;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}

export interface VenueCardProps {
  venue: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    location: string;
    capacity: number;
    pricePerHour: number;
    rating: number;
    category: string;
  };
}

export interface TestimonialCardProps {
  review: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    rating: number;
    comment: string;
    venueName: string;
  };
}