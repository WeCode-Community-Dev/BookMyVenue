export type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

export interface Venue {
    id: string;
    name: string;
    location: string;
    category: string;
    capacity: number;
    price: number;
    rating: number;
    bookings: number;
    status: "Active" | "Inactive";
    image: string;
}

export interface Booking {
    id: string;
    client: string;
    venue: string;
    date: string;
    guests: number;
    amount: number;
    status: BookingStatus;
    category: string;
}

export const STATUS_STYLE: Record<BookingStatus, string> = {
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-red-50 text-red-600 border-red-200",
};

export const STATUS_DOT: Record<BookingStatus, string> = {
    Confirmed: "bg-emerald-500",
    Pending: "bg-amber-400",
    Cancelled: "bg-red-500",
};

export const BOOKINGS: Booking[] = [
    { id: "BK-1041", client: "Arun & Divya", venue: "The Grand Pavilion", date: "2024-07-12", guests: 450, amount: 28000, status: "Confirmed", category: "Wedding" },
    { id: "BK-1040", client: "InfoSys Kochi", venue: "Lakeview Conference", date: "2024-07-08", guests: 120, amount: 15000, status: "Confirmed", category: "Conference" },
    { id: "BK-1039", client: "Riya Nair", venue: "The Grand Pavilion", date: "2024-07-05", guests: 200, amount: 22000, status: "Pending", category: "Birthday" },
    { id: "BK-1038", client: "TATA Motors Kerala", venue: "Lakeview Conference", date: "2024-06-30", guests: 80, amount: 12000, status: "Confirmed", category: "Corporate" },
    { id: "BK-1037", client: "Sajan & Preethi", venue: "Emerald Garden", date: "2024-06-25", guests: 600, amount: 35000, status: "Confirmed", category: "Wedding" },
    { id: "BK-1036", client: "Kerala Tourism", venue: "The Grand Pavilion", date: "2024-06-20", guests: 300, amount: 25000, status: "Cancelled", category: "Event" },
    { id: "BK-1035", client: "Manu & Asha", venue: "Emerald Garden", date: "2024-06-18", guests: 500, amount: 30000, status: "Confirmed", category: "Wedding" },
    { id: "BK-1034", client: "Cochin Startups", venue: "Lakeview Conference", date: "2024-06-15", guests: 60, amount: 9000, status: "Pending", category: "Conference" },
];

export const VENUES: Venue[] = [
    { id: "v1", name: "The Grand Pavilion", location: "Thrissur", category: "Wedding & Events", capacity: 800, price: 28000, rating: 4.8, bookings: 34, status: "Active", image: "https://images.unsplash.com/photo-1717680281618-442cb9c12b6c?w=400&h=260&fit=crop&auto=format" },
    { id: "v2", name: "Lakeview Conference Centre", location: "Ernakulam", category: "Conference", capacity: 350, price: 15000, rating: 4.6, bookings: 21, status: "Active", image: "https://images.unsplash.com/photo-1780337092608-aad7948d7a60?w=400&h=260&fit=crop&auto=format" },
    { id: "v3", name: "Emerald Garden", location: "Kozhikode", category: "Wedding", capacity: 700, price: 32000, rating: 4.9, bookings: 18, status: "Active", image: "https://images.unsplash.com/photo-1779308936221-89739e035a53?w=400&h=260&fit=crop&auto=format" },
];
 function fmt(n: number) {
    return "₹" + n.toLocaleString("en-IN");
}
