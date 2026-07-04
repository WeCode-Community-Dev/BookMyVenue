import { Heart, Building2, PartyPopper, Briefcase, Sparkles, Search, Shield, Clock } from "lucide-react";

export const DISTRICTS = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
];

export const CATEGORIES = [
    { label: "Weddings", icon: Heart, count: "240+ venues" },
    { label: "Conferences", icon: Building2, count: "85+ venues" },
    { label: "Parties", icon: PartyPopper, count: "130+ venues" },
    { label: "Corporate", icon: Briefcase, count: "60+ venues" },
    { label: "Events", icon: Sparkles, count: "180+ venues" },
];

//  const VENUES = [
//     {
//         name: "The Grand Pavilion",
//         location: "Thrissur",
//         district: "Thrissur",
//         category: "Weddings",
//         price: "₹28,000",
//         unit: "per session",
//         capacity: "800 guests",
//         rating: 4.8,
//         reviews: 124,
//         image: "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=600&h=400&fit=crop&auto=format",
//         tag: "Most Booked",
//     },
//     {
//         name: "Lakeview Convention Centre",
//         location: "Ernakulam",
//         district: "Ernakulam",
//         category: "Conferences",
//         price: "₹15,000",
//         unit: "per session",
//         capacity: "350 guests",
//         rating: 4.6,
//         reviews: 89,
//         image: "https://images.unsplash.com/photo-1679205691826-9157415559c2?w=600&h=400&fit=crop&auto=format",
//         tag: "Verified",
//     },
//     {
//         name: "Royal Gardens",
//         location: "Thiruvananthapuram",
//         district: "Thiruvananthapuram",
//         category: "Events",
//         price: "₹22,000",
//         unit: "per session",
//         capacity: "600 guests",
//         rating: 4.9,
//         reviews: 201,
//         image: "https://images.unsplash.com/photo-1747041807225-722af454c719?w=600&h=400&fit=crop&auto=format",
//         tag: "Top Rated",
//     },
//     {
//         name: "Emerald Hall",
//         location: "Kozhikode",
//         district: "Kozhikode",
//         category: "Parties",
//         price: "₹12,000",
//         unit: "per session",
//         capacity: "200 guests",
//         rating: 4.5,
//         reviews: 56,
//         image: "https://images.unsplash.com/photo-1780682571078-242672d1dd59?w=600&h=400&fit=crop&auto=format",
//         tag: "New",
//     },
//     {
//         name: "Prestige Business Club",
//         location: "Kochi",
//         district: "Ernakulam",
//         category: "Corporate",
//         price: "₹18,000",
//         unit: "per session",
//         capacity: "120 guests",
//         rating: 4.7,
//         reviews: 73,
//         image: "https://images.unsplash.com/photo-1768508951405-10e83c4a2872?w=600&h=400&fit=crop&auto=format",
//         tag: "Premium",
//     },
//     {
//         name: "Chandrabhavan Palace",
//         location: "Thrissur",
//         district: "Thrissur",
//         category: "Weddings",
//         price: "₹45,000",
//         unit: "per session",
//         capacity: "1200 guests",
//         rating: 4.9,
//         reviews: 310,
//         image: "https://images.unsplash.com/photo-1761472606347-bfebc5a3e546?w=600&h=400&fit=crop&auto=format",
//         tag: "Luxury",
//     },
// ];

export const VALUES = [
    {
        icon: Search,
        title: "Easy Search",
        description:
            "Browse thousands of verified venues across all 14 districts of Kerala. Filter by location, capacity, and budget in seconds.",
    },
    {
        icon: Shield,
        title: "Secure Booking",
        description:
            "Every booking is protected with our encrypted payment gateway. Pay with confidence — full refund policy on eligible cancellations.",
    },
    {
        icon: Clock,
        title: "24/7 Support",
        description:
            "Our dedicated team is available around the clock to help you plan, book, and coordinate your perfect event.",
    },
];
