"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import VenueCard from "@/components/VenueCard";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Users, Calendar, Sparkles, ChevronDown, CheckCircle2, Shield, Zap } from "lucide-react";

const CATEGORIES = [
  { id: "conference", name: "Meetings", icon: "💼", color: "from-blue-500/10 to-indigo-500/10 hover:border-blue-500/50" },
  { id: "wedding", name: "Weddings", icon: "💍", color: "from-purple-500/10 to-pink-500/10 hover:border-purple-500/50" },
  { id: "coworking", name: "Coworking", icon: "💻", color: "from-green-500/10 to-emerald-500/10 hover:border-green-500/50" },
  { id: "studio", name: "Studios", icon: "📸", color: "from-amber-500/10 to-orange-500/10 hover:border-amber-500/50" },
  { id: "rooftop", name: "Rooftops", icon: "🌆", color: "from-rose-500/10 to-red-500/10 hover:border-rose-500/50" },
  { id: "garden", name: "Gardens", icon: "🌿", color: "from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/50" },
];

const FAQS = [
  {
    q: "How does the booking process work?",
    a: "Search for your perfect space, choose your date and timeslot, select any extra amenities you need, and submit a booking request. The space host will review your request and confirm. All notifications will appear inside your Bookings dashboard."
  },
  {
    q: "Can I book a venue by the hour?",
    a: "Yes! Many of our spaces are available for hourly rentals (typically with a 2-4 hour minimum). You can also secure daily rates for full-day events, which represent a significant discount."
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations are subject to the host's policy, but you can request to cancel directly from your 'My Bookings' tab. Generally, cancellations made 48 hours or more before the event start time receive a full refund."
  },
  {
    q: "How do I list my own space on VenueFlow?",
    a: "Switch to the Host Portal using the toggle in the navigation header. There, you can instantly create new listings, upload high-quality space photos, set hourly/daily pricing, and manage pending guest bookings."
  }
];

export default function Home() {
  const router = useRouter();
  const { venues } = useApp();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchCapacity, setSearchCapacity] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (searchType) params.set("type", searchType);
    if (searchCapacity) params.set("capacity", searchCapacity);
    router.push(`/venues?${params.toString()}`);
  };

  const selectCategory = (typeId: string) => {
    router.push(`/venues?type=${typeId}`);
  };

  // Get top 3 rated venues for features list
  const featuredVenues = [...venues]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-border bg-gradient-to-b from-blue-50/40 via-background to-background dark:from-blue-950/10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.91_0.01_250/0.45)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.91_0.01_250/0.45)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,oklch(0.22_0.01_250/0.3)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.22_0.01_250/0.3)_1px,transparent_1px)]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline */}
          <div className="mx-auto mb-4 inline-flex items-center space-x-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Discover & book unique spaces instantly</span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Find the Perfect Space for Your{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Next Big Idea
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Book professional boardrooms, elegant ballrooms, creative photography studios, and open-air rooftop lounges on a flexible schedule.
          </p>

          {/* Interactive Search Widget */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-10 max-w-4xl rounded-2xl sm:rounded-full border border-border bg-card p-2 sm:p-3 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3"
          >
            {/* Location Filter */}
            <div className="flex-1 flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-border">
              <MapPin className="h-5 w-5 mr-2 text-primary shrink-0" />
              <div className="text-left w-full">
                <label className="block text-xxs font-bold text-muted-foreground uppercase tracking-wider">
                  Location
                </label>
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="">Anywhere</option>
                  <option value="San Francisco">San Francisco, CA</option>
                  <option value="New York">New York, NY</option>
                  <option value="Chicago">Chicago, IL</option>
                  <option value="Los Angeles">Los Angeles, CA</option>
                  <option value="Miami">Miami, FL</option>
                  <option value="Austin">Austin, TX</option>
                </select>
              </div>
            </div>

            {/* Capacity Filter */}
            <div className="flex-1 flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-border">
              <Users className="h-5 w-5 mr-2 text-primary shrink-0" />
              <div className="text-left w-full">
                <label className="block text-xxs font-bold text-muted-foreground uppercase tracking-wider">
                  Capacity
                </label>
                <select
                  value={searchCapacity}
                  onChange={(e) => setSearchCapacity(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="">Any Size</option>
                  <option value="15">Up to 15 guests</option>
                  <option value="50">Up to 50 guests</option>
                  <option value="100">Up to 100 guests</option>
                  <option value="250">250+ guests</option>
                </select>
              </div>
            </div>

            {/* Space Type Filter */}
            <div className="flex-1 flex items-center px-4 py-2">
              <Calendar className="h-5 w-5 mr-2 text-primary shrink-0" />
              <div className="text-left w-full">
                <label className="block text-xxs font-bold text-muted-foreground uppercase tracking-wider">
                  Space Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="conference">Conference Room</option>
                  <option value="wedding">Wedding & Ballroom</option>
                  <option value="coworking">Co-working Space</option>
                  <option value="studio">Creative Studio</option>
                  <option value="rooftop">Rooftop Lounge</option>
                  <option value="garden">Garden Oasis</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              className="rounded-xl sm:rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-6 text-base shadow transition-all flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Category Icons Grid */}
      <section className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground mb-8">
          Explore spaces by type
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow bg-gradient-to-tr ${cat.color}`}
            >
              <span className="text-3xl mb-3">{cat.icon}</span>
              <span className="text-sm font-bold text-foreground">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="py-16 bg-muted/30 dark:bg-muted/5 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Featured Spaces
              </h2>
              <p className="text-muted-foreground mt-2 text-sm max-w-md">
                Handpicked, premium venues featuring exceptional amenities and outstanding host hospitality.
              </p>
            </div>
            <Button
              onClick={() => router.push("/venues")}
              variant="outline"
              className="mt-4 sm:mt-0 rounded-xl"
            >
              Browse All Spaces
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / SaaS Highlights */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Why Book Through VenueFlow?
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We simplify space renting so you can focus entirely on creating exceptional memories and productive outputs.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Benefit 1 */}
          <div className="flex flex-col items-start p-6 rounded-2xl border border-border bg-card shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-primary mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Instant Booking Request</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Skip hours of back-and-forth emails. Select your dates, calculate live costs, and submit instantly.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="flex flex-col items-start p-6 rounded-2xl border border-border bg-card shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-primary mb-5">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Verified Premium Spaces</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Every venue lists details, amenities, and dimensions transparently. No surprises, only exceptional spaces.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col items-start p-6 rounded-2xl border border-border bg-card shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-primary mb-5">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Flexible Hourly Rates</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Don't pay for full days if you only need a couple of hours. Book exact slots that match your schedule.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/20 dark:bg-muted/5 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Answers to common queries regarding reservations, listings, and cancellations.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-foreground cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-muted-foreground text-sm leading-relaxed animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
