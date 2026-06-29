"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MOCK_VENUES, MOCK_CITIES, Venue } from "@/src/lib/mockData";
import { getWishlist, toggleWishlist, getSession } from "@/src/lib/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar as CalendarIcon,
  Search,
  Star,
  Sparkles,
  Building,
  Users,
  CreditCard,
  Heart,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Search Form State
  const [location, setLocation] = useState("");
  const [showCities, setShowCities] = useState(false);
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [wishlist, setWishlistState] = useState<string[]>([]);

  useEffect(() => {
    setWishlistState(getWishlist());
    const session = getSession();
    if (session && session.role === "customer" && session.isProfileCompleted === false) {
      router.push("/customer/profile");
    }
  }, [router]);

  const handleCityClick = (city: string) => {
    setLocation(city);
    setShowCities(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = date ? date.toISOString().split("T")[0] : "";
    router.push(`/venues?location=${encodeURIComponent(location)}&occasion=${encodeURIComponent(occasion)}&date=${dateStr}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleWishlist(id);
    setWishlistState(updated);
  };

  // Get Top 3 rated venues for features
  const featuredVenues = MOCK_VENUES.slice(0, 3);

  // Quick link categories
  const categories = [
    { label: "Wedding Hall", type: "Hall", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=150" },
    { label: "Conference Room", type: "Hall", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=150" },
    { label: "Rooftop Lounge", type: "Rooftop", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=150" },
    { label: "Resort Lawn", type: "Resort", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=150" },
    { label: "Creative Studio", type: "Studio", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=150" },
    { label: "Party Banquet", type: "Hall", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=150&id2" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full h-[620px] flex items-center justify-center bg-black overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1800"
              alt="Luxury Wedding Hall Ambient Background"
              fill
              priority
              className="object-cover opacity-60"
            />
            {/* Soft dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center text-white flex flex-col items-center">
            {/* Accent badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-primary/20 border border-teal-primary/40 text-teal-light text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-amber-cta" />Venue Booking
            </div>

            {/* <form
              onSubmit={handleSearch}
              className="w-full max-w-4xl bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 text-neutral-dark grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
            >
          
              <div className="relative flex flex-col items-start px-1 py-1 border-b md:border-b-0 md:border-r border-neutral-light">
                <span className="text-[10px] uppercase font-bold text-neutral-muted flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-teal-primary" /> Location
                </span>
                <input
                  type="text"
                  placeholder="Where are you planning?"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setShowCities(true);
                  }}
                  onFocus={() => setShowCities(true)}
                  className="w-full bg-transparent border-0 outline-none text-sm font-semibold pt-1 focus:ring-0 placeholder:text-neutral-muted/70 placeholder:font-normal"
                />

                {showCities && (
                  <div className="absolute left-0 top-[110%] z-50 w-64 bg-white rounded-xl shadow-xl border border-border py-2 animate-fade-in max-h-60 overflow-y-auto">
                    <div className="px-3 py-1.5 text-xs font-semibold text-neutral-muted uppercase">Popular Cities</div>
                    {MOCK_CITIES.filter(c => c.toLowerCase().includes(location.toLowerCase())).map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCityClick(city)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-teal-light hover:text-teal-primary transition-colors flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-neutral-muted" />
                        {city}
                      </button>
                    ))}
                    {MOCK_CITIES.filter(c => c.toLowerCase().includes(location.toLowerCase())).length === 0 && (
                      <div className="px-4 py-2 text-sm text-neutral-muted">No cities matched</div>
                    )}
                  </div>
                )}
              </div>

           
              <div className="flex flex-col items-start px-2 py-1 border-b md:border-b-0 md:border-r border-neutral-light">
                <span className="text-[10px] uppercase font-bold text-neutral-muted flex items-center gap-1">
                  <Building className="h-3 w-3 text-teal-primary" /> Occasion
                </span>
                <Select value={occasion} onValueChange={(val) => setOccasion(val || "")}>
                  <SelectTrigger className="w-full border-0 shadow-none bg-transparent p-0 h-auto font-semibold text-sm focus-visible:ring-0">
                    <SelectValue placeholder="Select Occasion" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Birthday">Birthday</SelectItem>
                    <SelectItem value="Social">Social Gathering</SelectItem>
                    <SelectItem value="Other">Other Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

          
              <div className="flex flex-col items-start px-2 py-1">
                <span className="text-[10px] uppercase font-bold text-neutral-muted flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-teal-primary" /> Date
                </span>
                <Popover>
                  <PopoverTrigger
                    type="button"
                    className="w-full text-left bg-transparent border-0 outline-none text-sm font-semibold pt-1 focus:ring-0 flex items-center justify-between text-neutral-dark placeholder:text-neutral-muted/70 cursor-pointer"
                  >
                    {date ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Pick a date"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="bg-white border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="px-2">
                <Button
                  type="submit"
                  className="w-full bg-teal-primary hover:bg-teal-hover text-white h-12 rounded-xl flex items-center justify-center gap-2 font-medium shadow-md shadow-teal-primary/30"
                >
                  <Search className="h-4 w-4" />
                  Search Venues
                </Button>
              </div>
            </form> */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.1] mb-6 animate-slide-up">
              Find the Perfect Venue for Every Occasion
            </h1>
            <p className="text-lg sm:text-xl text-neutral-light/90 max-w-xl mb-10 font-sans font-light">
              Discover verified spaces, compare transparent pricing, and secure your booking in minutes.
            </p>

            <div className="px-2">
              <Button
                type="button"
                onClick={() => router.push("/venues")}
                className="w-full bg-teal-primary hover:bg-teal-hover text-white h-12 rounded-xl flex items-center justify-center gap-2 font-medium shadow-md shadow-teal-primary/30"
              >
                <Search className="h-4 w-4" />
                Search Venues
              </Button>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="w-full bg-[#1A1A19] text-white py-6 border-b border-neutral-dark">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-around items-center gap-6 text-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-primary/10 border border-teal-primary/30 flex items-center justify-center text-teal-light">
                  <Building className="h-5 w-5 text-teal-primary" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold font-serif leading-none text-white">2,400+ Venues</p>
                  <p className="text-xs text-neutral-muted">Verified & curated spaces</p>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-neutral-dark" />

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-primary/10 border border-teal-primary/30 flex items-center justify-center text-teal-light">
                  <MapPin className="h-5 w-5 text-teal-primary" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold font-serif leading-none text-white">18 Cities</p>
                  <p className="text-xs text-neutral-muted">Across India & growing</p>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-neutral-dark" />

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-primary/10 border border-teal-primary/30 flex items-center justify-center text-teal-light">
                  <Users className="h-5 w-5 text-teal-primary" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold font-serif leading-none text-white">50,000+ Bookings</p>
                  <p className="text-xs text-neutral-muted">Successfully hosted events</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY QUICK-LINKS */}
        <section className="w-full py-12 bg-[#FAFAF8]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif font-bold text-neutral-dark mb-6">Explore by Space Type</h2>

            {/* Scrollable container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-teal-primary/10">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/venues?type=${cat.type}`}
                  className="flex-shrink-0 group flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md border border-neutral-light transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover group-hover:brightness-90 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-dark group-hover:text-teal-primary transition-colors">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED VENUES (3-col grid) */}
        <section className="w-full py-16 bg-white border-y border-neutral-light">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-xs font-bold text-teal-primary uppercase tracking-wider mb-2">Featured Selections</p>
                <h2 className="text-3xl font-serif font-bold text-neutral-dark">Top Picks Near You</h2>
              </div>
              <Link href="/venues" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-teal-primary hover:underline">
                View All Venues <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVenues.map((venue) => {
                const isStarred = wishlist.includes(venue.id);
                return (
                  <div
                    key={venue.id}
                    className="group flex flex-col bg-background rounded-2xl border border-neutral-light overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Venue Image */}
                    <div className="relative h-56 w-full bg-neutral-light overflow-hidden">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge Overlays */}
                      {venue.verified && (
                        <Badge className="absolute top-4 left-4 bg-teal-primary text-white text-[10px] font-semibold border-0 py-0.5 px-2.5">
                          Verified
                        </Badge>
                      )}

                      {/* Wishlist Heart */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, venue.id)}
                        className="absolute top-4 right-4 h-9 w-9 bg-white/95 rounded-full flex items-center justify-center shadow-md text-neutral-dark hover:text-red-500 transition-colors focus:outline-none"
                      >
                        <Heart className={`h-4.5 w-4.5 transition-all ${isStarred ? "fill-red-500 text-red-500" : "text-neutral-muted"}`} />
                      </button>
                    </div>

                    {/* Venue Info */}
                    <div className="p-5 flex-grow flex flex-col">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {venue.occasions.map((occ) => (
                          <span key={occ} className="text-[10px] font-semibold bg-neutral-light text-neutral-muted py-0.5 px-2 rounded-full">
                            {occ}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-lg font-serif font-bold text-neutral-dark group-hover:text-teal-primary transition-colors line-clamp-1 mb-1">
                        {venue.name}
                      </h3>
                      <p className="text-xs text-neutral-muted flex items-center gap-1 mb-4">
                        <MapPin className="h-3.5 w-3.5 text-teal-primary" /> {venue.location}
                      </p>

                      {/* Guest and Price Meta */}
                      <div className="flex justify-between items-center pt-3 mt-auto border-t border-neutral-light">
                        <div className="text-xs text-neutral-muted font-medium flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-neutral-muted" /> Max {venue.capacity} guests
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-muted font-medium uppercase leading-none">Per Day</p>
                          <p className="text-base font-bold text-teal-primary font-sans">
                            ₹{venue.pricePerDay.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* View Details Link */}
                      <Link href={`/venues/${venue.id}`} className="mt-4">
                        <Button className="w-full bg-teal-light text-teal-primary border border-teal-primary/10 hover:bg-teal-primary hover:text-white rounded-xl py-2 h-10 font-semibold transition-all">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/venues" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-primary hover:underline">
                View All Venues <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="w-full py-16 bg-[#FAFAF8]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold text-teal-primary uppercase tracking-wider mb-2">Simplicity First</p>
            <h2 className="text-3xl font-serif font-bold text-neutral-dark mb-12">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-neutral-light shadow-sm">
                <div className="h-16 w-16 rounded-2xl bg-teal-light text-teal-primary flex items-center justify-center font-bold text-2xl mb-6 shadow-inner">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark mb-2">1. Search & Filter</h3>
                <p className="text-sm text-neutral-muted max-w-xs leading-relaxed">
                  Enter location, date, and occasion to explore local spaces. Filter by capacity, budget, and amenities.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-neutral-light shadow-sm">
                <div className="h-16 w-16 rounded-2xl bg-amber-light text-amber-cta flex items-center justify-center font-bold text-2xl mb-6 shadow-inner">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark mb-2">2. Explore Details</h3>
                <p className="text-sm text-neutral-muted max-w-xs leading-relaxed">
                  View high-resolution photo galleries, slots, exact pricing breakdowns, and venue booking policies.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-neutral-light shadow-sm">
                <div className="h-16 w-16 rounded-2xl bg-teal-light text-teal-primary flex items-center justify-center font-bold text-2xl mb-6 shadow-inner">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark mb-2">3. Book Securely</h3>
                <p className="text-sm text-neutral-muted max-w-xs leading-relaxed">
                  Select your slot and guest count, submit a booking request, and lock in your date instantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
