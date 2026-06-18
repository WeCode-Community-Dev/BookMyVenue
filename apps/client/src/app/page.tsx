"use client";
import { useState } from "react";
import {
    MapPin,
    Search,
    Star,
    ChevronDown,
    Phone,
    Mail,
    Table,
    Heart,
    Shield,
    Clock,
    ArrowRight,
    Menu,
    X,
    Users,
    Building2,
    Sparkles,
    PartyPopper,
    Briefcase,
} from "lucide-react";

const DISTRICTS = [
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

const CATEGORIES = [
    { label: "Weddings", icon: Heart, count: "240+ venues" },
    { label: "Conferences", icon: Building2, count: "85+ venues" },
    { label: "Parties", icon: PartyPopper, count: "130+ venues" },
    { label: "Corporate", icon: Briefcase, count: "60+ venues" },
    { label: "Events", icon: Sparkles, count: "180+ venues" },
];

const VENUES = [
    {
        name: "The Grand Pavilion",
        location: "Thrissur",
        district: "Thrissur",
        category: "Weddings",
        price: "₹28,000",
        unit: "per session",
        capacity: "800 guests",
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1601482441062-b9f13131f33a?w=600&h=400&fit=crop&auto=format",
        tag: "Most Booked",
    },
    {
        name: "Lakeview Convention Centre",
        location: "Ernakulam",
        district: "Ernakulam",
        category: "Conferences",
        price: "₹15,000",
        unit: "per session",
        capacity: "350 guests",
        rating: 4.6,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1679205691826-9157415559c2?w=600&h=400&fit=crop&auto=format",
        tag: "Verified",
    },
    {
        name: "Royal Gardens",
        location: "Thiruvananthapuram",
        district: "Thiruvananthapuram",
        category: "Events",
        price: "₹22,000",
        unit: "per session",
        capacity: "600 guests",
        rating: 4.9,
        reviews: 201,
        image: "https://images.unsplash.com/photo-1747041807225-722af454c719?w=600&h=400&fit=crop&auto=format",
        tag: "Top Rated",
    },
    {
        name: "Emerald Hall",
        location: "Kozhikode",
        district: "Kozhikode",
        category: "Parties",
        price: "₹12,000",
        unit: "per session",
        capacity: "200 guests",
        rating: 4.5,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1780682571078-242672d1dd59?w=600&h=400&fit=crop&auto=format",
        tag: "New",
    },
    {
        name: "Prestige Business Club",
        location: "Kochi",
        district: "Ernakulam",
        category: "Corporate",
        price: "₹18,000",
        unit: "per session",
        capacity: "120 guests",
        rating: 4.7,
        reviews: 73,
        image: "https://images.unsplash.com/photo-1768508951405-10e83c4a2872?w=600&h=400&fit=crop&auto=format",
        tag: "Premium",
    },
    {
        name: "Chandrabhavan Palace",
        location: "Thrissur",
        district: "Thrissur",
        category: "Weddings",
        price: "₹45,000",
        unit: "per session",
        capacity: "1200 guests",
        rating: 4.9,
        reviews: 310,
        image: "https://images.unsplash.com/photo-1761472606347-bfebc5a3e546?w=600&h=400&fit=crop&auto=format",
        tag: "Luxury",
    },
];

const VALUES = [
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

export default function Home() {
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [districtOpen, setDistrictOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [wishlist, setWishlist] = useState<string[]>([]);

    const toggleWishlist = (name: string) => {
        setWishlist((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    };

    const filtered = activeCategory === "All" ? VENUES : VENUES.filter((v) => v.category === activeCategory);

    return (
        <div
            className="min-h-screen bg-background text-foreground"
            style={{ fontFamily: "'Nunito', sans-serif" }}
        >
            {/* NAV */}
            <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <span
                                className="text-xl font-bold tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                BookMyVenues
                            </span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <a
                                href="#venues"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                            >
                                Explore Venues
                            </a>
                            <a
                                href="#categories"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                            >
                                Categories
                            </a>
                            <a
                                href="#about"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                            >
                                About
                            </a>
                            <a
                                href="#contact"
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                            >
                                Contact
                            </a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <button className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors px-4 py-1.5 rounded-full border border-primary-foreground/30 hover:border-primary-foreground/60">
                                Login
                            </button>
                            <button className="text-sm font-semibold bg-accent text-white px-4 py-1.5 rounded-full hover:bg-accent/90 transition-colors">
                                Sign Up
                            </button>
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden text-primary-foreground"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-primary border-t border-primary-foreground/10 px-4 py-4 flex flex-col gap-3">
                        <a href="#venues" className="text-primary-foreground/80 text-sm py-1">
                            Explore Venues
                        </a>
                        <a href="#categories" className="text-primary-foreground/80 text-sm py-1">
                            Categories
                        </a>
                        <a href="#about" className="text-primary-foreground/80 text-sm py-1">
                            About
                        </a>
                        <a href="#contact" className="text-primary-foreground/80 text-sm py-1">
                            Contact
                        </a>
                        <div className="flex gap-2 pt-2">
                            <button className="flex-1 text-sm border border-primary-foreground/30 text-primary-foreground rounded-full py-1.5">
                                Login
                            </button>
                            <button className="flex-1 text-sm bg-accent text-white rounded-full py-1.5 font-semibold">
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO */}
            <section className="relative overflow-hidden bg-primary">
                {/* Background image with overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1747041807198-b5f7172bd0ee?w=1600&h=800&fit=crop&auto=format"
                        alt="Lavishly decorated event hall"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-8 right-12 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
                <div className="absolute bottom-12 left-8 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 text-center">
                    <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
                        Kerala's #1 Venue Platform
                    </p>
                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Find Your Perfect
                        <br />
                        <span className="text-accent">Event Venue</span> in Kerala
                    </h1>
                    <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-12">
                        From intimate gatherings to grand weddings — discover verified venues across all 14
                        districts of God's Own Country.
                    </p>

                    {/* Search Box */}
                    <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row gap-3">
                        {/* District Dropdown */}
                        <div className="relative flex-1">
                            <button
                                className="w-full flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl text-left text-foreground text-sm font-medium hover:bg-muted transition-colors"
                                onClick={() => {
                                    setDistrictOpen(!districtOpen);
                                    setCatOpen(false);
                                }}
                            >
                                <MapPin className="w-4 h-4 text-accent shrink-0" />
                                <span className="flex-1 truncate">
                                    {selectedDistrict || "Select District"}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-muted-foreground transition-transform ${districtOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            {districtOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-30 max-h-52 overflow-y-auto">
                                    {DISTRICTS.map((d) => (
                                        <button
                                            key={d}
                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground"
                                            onClick={() => {
                                                setSelectedDistrict(d);
                                                setDistrictOpen(false);
                                            }}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative flex-1">
                            <button
                                className="w-full flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl text-left text-foreground text-sm font-medium hover:bg-muted transition-colors"
                                onClick={() => {
                                    setCatOpen(!catOpen);
                                    setDistrictOpen(false);
                                }}
                            >
                                <Sparkles className="w-4 h-4 text-accent shrink-0" />
                                <span className="flex-1 truncate">
                                    {selectedCategory === "All" ? "Select Category" : selectedCategory}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-muted-foreground transition-transform ${catOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            {catOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-30">
                                    {["All", ...CATEGORIES.map((c) => c.label)].map((cat) => (
                                        <button
                                            key={cat}
                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground"
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setCatOpen(false);
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shrink-0">
                            <Search className="w-4 h-4" />
                            Search
                        </button>
                    </div>

                    {/* Quick stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-10 text-primary-foreground/60 text-sm">
                        <span className="flex items-center gap-1.5">
                            <span className="text-accent font-bold text-base">700+</span> Venues
                        </span>
                        <span className="text-primary-foreground/30">·</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-accent font-bold text-base">14</span> Districts
                        </span>
                        <span className="text-primary-foreground/30">·</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-accent font-bold text-base">12K+</span> Happy Bookings
                        </span>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section id="categories" className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                            Browse by Type
                        </p>
                        <h2
                            className="text-3xl sm:text-4xl font-bold text-foreground"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            What Are You Planning?
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {CATEGORIES.map(({ label, icon: Icon, count }) => {
                            const isActive = activeCategory === label;
                            return (
                                <button
                                    key={label}
                                    onClick={() => setActiveCategory(isActive ? "All" : label)}
                                    className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
                                        isActive
                                            ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                            : "border-border bg-card text-foreground hover:border-primary/40 hover:shadow-md"
                                    }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                            isActive
                                                ? "bg-primary-foreground/20"
                                                : "bg-secondary group-hover:bg-muted"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 ${isActive ? "text-accent" : "text-primary"}`}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-sm">{label}</p>
                                        <p
                                            className={`text-xs mt-0.5 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                                        >
                                            {count}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FEATURED VENUES */}
            <section id="venues" className="py-16 bg-secondary/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                        <div>
                            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                                Handpicked For You
                            </p>
                            <h2
                                className="text-3xl sm:text-4xl font-bold text-foreground"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {activeCategory === "All" ? "Featured Venues" : `${activeCategory} Venues`}
                            </h2>
                        </div>
                        <button className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-3 transition-all">
                            View all venues <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((venue) => (
                            <div
                                key={venue.name}
                                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-52 bg-muted overflow-hidden">
                                    <img
                                        src={venue.image}
                                        alt={venue.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Tag */}
                                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {venue.tag}
                                    </span>
                                    {/* Wishlist */}
                                    <button
                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        onClick={() => toggleWishlist(venue.name)}
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${wishlist.includes(venue.name) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                                        />
                                    </button>
                                    {/* Category badge */}
                                    <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                                        {venue.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3
                                        className="font-bold text-lg text-foreground mb-1 leading-tight"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {venue.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        <span>
                                            {venue.location}, {venue.district}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-semibold text-foreground">
                                                {venue.rating}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                ({venue.reviews})
                                            </span>
                                        </div>
                                        <span className="text-border">·</span>
                                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>{venue.capacity}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <div>
                                            <span className="text-lg font-bold text-primary">
                                                {venue.price}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-1">
                                                {venue.unit}
                                            </span>
                                        </div>
                                        <button className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-accent transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-lg font-medium">No venues found for this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* VALUE PROPS */}
            <section id="about" className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                            Why Choose Us
                        </p>
                        <h2
                            className="text-3xl sm:text-4xl font-bold text-foreground"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Simple. Secure. Stress-Free.
                        </h2>
                        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                            We make venue booking in Kerala effortless — from first search to final
                            confirmation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {VALUES.map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}
                                className="group text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3
                                    className="text-xl font-bold text-foreground mb-3"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="relative overflow-hidden bg-primary py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1692964808433-a7f9554c3f24?w=1600&h=600&fit=crop&auto=format"
                        alt="Elegant venue interior"
                        className="w-full h-full object-cover opacity-10"
                    />
                </div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                <div className="relative max-w-3xl mx-auto px-4 text-center">
                    <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
                        List Your Venue
                    </p>
                    <h2
                        className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-5"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Own a Venue in Kerala?
                        <br />
                        Reach Thousands of Customers
                    </h2>
                    <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
                        Join 700+ venues already on our platform. List for free and start receiving bookings
                        from across the state within days.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="bg-accent text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-accent/90 transition-colors">
                            List Your Venue — Free
                        </button>
                        <button className="text-primary-foreground/80 font-medium hover:text-primary-foreground transition-colors flex items-center gap-1.5">
                            Learn more <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="contact" className="bg-foreground text-background/80 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-white" />
                                </div>
                                <span
                                    className="text-xl font-bold text-background"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    BookMyVenues
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed mb-5">
                                Kerala's most trusted venue discovery and booking platform. Covering all 14
                                districts from Kasaragod to Thiruvananthapuram.
                            </p>
                            <div className="flex gap-3">
                                {[Table, Table, Table].map((Icon, i) => (
                                    <button
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-accent transition-colors"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4
                                className="text-background font-bold mb-4"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Quick Links
                            </h4>
                            <ul className="space-y-2 text-sm">
                                {["Explore Venues", "Categories", "Pricing", "Blog", "FAQs"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="hover:text-accent transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h4
                                className="text-background font-bold mb-4"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Categories
                            </h4>
                            <ul className="space-y-2 text-sm">
                                {CATEGORIES.map(({ label }) => (
                                    <li key={label}>
                                        <a href="#" className="hover:text-accent transition-colors">
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4
                                className="text-background font-bold mb-4"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Contact Us
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                                    <span>Kochi, Kerala, India — PIN 682001</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-accent shrink-0" />
                                    <a
                                        href="tel:+919876543210"
                                        className="hover:text-accent transition-colors"
                                    >
                                        +91 98765 43210
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-accent shrink-0" />
                                    <a
                                        href="mailto:hello@bookmyvenues.co.in"
                                        className="hover:text-accent transition-colors"
                                    >
                                        hello@bookmyvenues.co.in
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/40">
                        <span>© 2024 BookMyVenues. All rights reserved.</span>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-background/70 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-background/70 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-background/70 transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                        <span>English (IN) · INR ₹</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
