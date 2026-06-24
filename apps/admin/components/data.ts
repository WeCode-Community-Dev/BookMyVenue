export type VenueStatus = "Pending" | "Active" | "Rejected" | "Suspended";
export type UserRole = "Owner" | "Customer";
export type UserStatus = "Active" | "Suspended";
export type BookingStatus = "Confirmed" | "Pending" | "Cancelled";
export type Tab = "overview" | "venues" | "users" | "bookings" | "reports";

export interface Venue {
  id: string; name: string; owner: string; location: string;
  category: string; capacity: number; price: number;
  status: VenueStatus; submitted: string; rating: number; bookings: number;
  image: string;
}
export interface User {
  id: string; name: string; email: string; phone: string;
  role: UserRole; status: UserStatus; joined: string;
  venues: number; bookings: number; revenue: number;
}
export interface Booking {
  id: string; client: string; venue: string; owner: string;
  date: string; amount: number; status: BookingStatus; district: string; category: string;
}

export function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export const VENUE_STATUS_STYLE: Record<VenueStatus, string> = {
  Active:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending:   "bg-amber-50 text-amber-700 border-amber-200",
  Rejected:  "bg-red-50 text-red-600 border-red-200",
  Suspended: "bg-gray-100 text-gray-600 border-gray-200",
};

export const BOOKING_STATUS_STYLE: Record<BookingStatus, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending:   "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
};

export const REVENUE_DATA = [
  { month: "Jan", revenue: 185000, bookings: 42 },
  { month: "Feb", revenue: 220000, bookings: 55 },
  { month: "Mar", revenue: 198000, bookings: 48 },
  { month: "Apr", revenue: 310000, bookings: 74 },
  { month: "May", revenue: 275000, bookings: 66 },
  { month: "Jun", revenue: 390000, bookings: 91 },
  { month: "Jul", revenue: 420000, bookings: 104 },
];

export const CATEGORY_DATA = [
  { name: "Wedding", value: 42, color: "#7B1F2E" },
  { name: "Conference", value: 18, color: "#C8790A" },
  { name: "Party", value: 22, color: "#2563eb" },
  { name: "Corporate", value: 11, color: "#059669" },
  { name: "Other", value: 7, color: "#9333ea" },
];

export const DISTRICT_DATA = [
  { district: "Ernakulam", venues: 148, bookings: 312 },
  { district: "Thrissur", venues: 112, bookings: 244 },
  { district: "Kozhikode", venues: 89, bookings: 187 },
  { district: "Thiruvananthapuram", venues: 95, bookings: 201 },
  { district: "Palakkad", venues: 56, bookings: 98 },
  { district: "Kannur", venues: 44, bookings: 81 },
];

export const VENUES: Venue[] = [
  { id: "V001", name: "The Grand Pavilion", owner: "Suresh Nair", location: "Thrissur", category: "Wedding", capacity: 800, price: 28000, status: "Active", submitted: "2024-05-10", rating: 4.8, bookings: 34, image: "https://images.unsplash.com/photo-1717680281618-442cb9c12b6c?w=60&h=60&fit=crop&auto=format" },
  { id: "V002", name: "Lakeview Conference Centre", owner: "Priya Menon", location: "Ernakulam", category: "Conference", capacity: 350, price: 15000, status: "Active", submitted: "2024-05-14", rating: 4.6, bookings: 21, image: "https://images.unsplash.com/photo-1780337092608-aad7948d7a60?w=60&h=60&fit=crop&auto=format" },
  { id: "V003", name: "Emerald Garden", owner: "Rajan Pillai", location: "Kozhikode", category: "Wedding", capacity: 700, price: 32000, status: "Pending", submitted: "2024-07-01", rating: 0, bookings: 0, image: "https://images.unsplash.com/photo-1779308936221-89739e035a53?w=60&h=60&fit=crop&auto=format" },
  { id: "V004", name: "Royal Mahal Banquets", owner: "Anil Kumar", location: "Palakkad", category: "Wedding", capacity: 1200, price: 45000, status: "Pending", submitted: "2024-07-03", rating: 0, bookings: 0, image: "https://images.unsplash.com/photo-1763553113332-800519753e40?w=60&h=60&fit=crop&auto=format" },
  { id: "V005", name: "Chandrabhavan Palace", owner: "Sreeja Nambiar", location: "Thrissur", category: "Wedding", capacity: 1000, price: 40000, status: "Active", submitted: "2024-04-20", rating: 4.9, bookings: 48, image: "https://images.unsplash.com/photo-1768851142332-75f3d1b47452?w=60&h=60&fit=crop&auto=format" },
  { id: "V006", name: "Seaview Party Lawn", owner: "Biju Thomas", location: "Alappuzha", category: "Party", capacity: 400, price: 18000, status: "Rejected", submitted: "2024-06-12", rating: 0, bookings: 0, image: "https://images.unsplash.com/photo-1780682571078-242672d1dd59?w=60&h=60&fit=crop&auto=format" },
  { id: "V007", name: "Prestige Business Hub", owner: "Deepa Krishnan", location: "Ernakulam", category: "Corporate", capacity: 150, price: 20000, status: "Suspended", submitted: "2024-03-05", rating: 3.8, bookings: 9, image: "https://images.unsplash.com/photo-1768508951405-10e83c4a2872?w=60&h=60&fit=crop&auto=format" },
];

export const USERS: User[] = [
  { id: "U001", name: "Suresh Nair", email: "suresh@example.com", phone: "+91 98765 43210", role: "Owner", status: "Active", joined: "2024-01-15", venues: 3, bookings: 0, revenue: 320000 },
  { id: "U002", name: "Priya Menon", email: "priya@example.com", phone: "+91 97654 32109", role: "Owner", status: "Active", joined: "2024-02-20", venues: 2, bookings: 0, revenue: 185000 },
  { id: "U003", name: "Arun Kumar", email: "arun@example.com", phone: "+91 96543 21098", role: "Customer", status: "Active", joined: "2024-03-10", venues: 0, bookings: 7, revenue: 0 },
  { id: "U004", name: "Divya Krishnan", email: "divya@example.com", phone: "+91 95432 10987", role: "Customer", status: "Active", joined: "2024-04-05", venues: 0, bookings: 4, revenue: 0 },
  { id: "U005", name: "Rajan Pillai", email: "rajan@example.com", phone: "+91 94321 09876", role: "Owner", status: "Active", joined: "2024-05-18", venues: 1, bookings: 0, revenue: 95000 },
  { id: "U006", name: "Biju Thomas", email: "biju@example.com", phone: "+91 93210 98765", role: "Owner", status: "Suspended", joined: "2024-06-01", venues: 1, bookings: 0, revenue: 0 },
  { id: "U007", name: "Meera Nair", email: "meera@example.com", phone: "+91 92109 87654", role: "Customer", status: "Active", joined: "2024-06-22", venues: 0, bookings: 12, revenue: 0 },
];

export const BOOKINGS: Booking[] = [
  { id: "BK-1041", client: "Arun & Divya", venue: "The Grand Pavilion", owner: "Suresh Nair", date: "2024-07-12", amount: 28000, status: "Confirmed", district: "Thrissur", category: "Wedding" },
  { id: "BK-1040", client: "InfoSys Kochi", venue: "Lakeview Conference", owner: "Priya Menon", date: "2024-07-08", amount: 15000, status: "Confirmed", district: "Ernakulam", category: "Conference" },
  { id: "BK-1039", client: "Riya Nair", venue: "The Grand Pavilion", owner: "Suresh Nair", date: "2024-07-05", amount: 22000, status: "Pending", district: "Thrissur", category: "Birthday" },
  { id: "BK-1038", client: "TATA Motors", venue: "Lakeview Conference", owner: "Priya Menon", date: "2024-06-30", amount: 12000, status: "Confirmed", district: "Ernakulam", category: "Corporate" },
  { id: "BK-1037", client: "Sajan & Preethi", venue: "Chandrabhavan Palace", owner: "Sreeja Nambiar", date: "2024-06-25", amount: 40000, status: "Confirmed", district: "Thrissur", category: "Wedding" },
  { id: "BK-1036", client: "Kerala Tourism Dept.", venue: "The Grand Pavilion", owner: "Suresh Nair", date: "2024-06-20", amount: 25000, status: "Cancelled", district: "Thrissur", category: "Event" },
  { id: "BK-1035", client: "Manu & Asha", venue: "Chandrabhavan Palace", owner: "Sreeja Nambiar", date: "2024-06-18", amount: 38000, status: "Confirmed", district: "Thrissur", category: "Wedding" },
  { id: "BK-1034", client: "Cochin Startups", venue: "Lakeview Conference", owner: "Priya Menon", date: "2024-06-15", amount: 9000, status: "Pending", district: "Ernakulam", category: "Conference" },
];

import { Home, Building2, Users, CalendarCheck, BarChart3 } from "lucide-react";

export const NAV = [
  { key: "overview" as Tab, label: "Overview", icon: Home },
  { key: "venues" as Tab, label: "Venues", icon: Building2, badge: VENUES.filter(v => v.status === "Pending").length },
  { key: "users" as Tab, label: "Users", icon: Users },
  { key: "bookings" as Tab, label: "Bookings", icon: CalendarCheck },
  { key: "reports" as Tab, label: "Reports", icon: BarChart3 },
];
