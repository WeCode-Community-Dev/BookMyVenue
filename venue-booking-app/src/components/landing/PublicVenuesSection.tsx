"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, Venue } from "@/context/AppContext";
import VenueCard from "@/components/VenueCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Building2, ShieldCheck, Lock } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All Venues", icon: "🏢" },
  { id: "conference", name: "Meetings", icon: "💼" },
  { id: "wedding", name: "Weddings", icon: "💍" },
  { id: "coworking", name: "Coworking", icon: "💻" },
  { id: "studio", name: "Studios", icon: "📸" },
  { id: "rooftop", name: "Rooftops", icon: "🌆" },
  { id: "garden", name: "Gardens", icon: "🌿" },
];

export default function PublicVenuesSection() {
  const router = useRouter();
  const { venues: contextVenues, user } = useApp();

  const [activeCategory, setActiveCategory] = useState("all");
  const [venuesList, setVenuesList] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  // Map backend image helper
  const mapBackendImages = (imageFiles: any[] | undefined, venueType: string): string[] => {
    if (!imageFiles || imageFiles.length === 0) {
      const type = (venueType || "").toLowerCase();
      if (type.includes("conference") || type.includes("meeting")) {
        return ["https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800"];
      } else if (type.includes("wedding") || type.includes("ballroom")) {
        return ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"];
      } else if (type.includes("coworking")) {
        return ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"];
      } else if (type.includes("studio")) {
        return ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800"];
      } else if (type.includes("rooftop")) {
        return ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800"];
      } else {
        return ["https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=800"];
      }
    }
    return imageFiles.map((img: any) => {
      if (typeof img === "string") return img.startsWith("http") ? img : `http://localhost:8080/${img}`;
      if (img && typeof img === "object") {
        const loc = img.fileLocation || img.filePath || img.url;
        if (loc) return loc.startsWith("http") ? loc : `http://localhost:8080/${loc}`;
      }
      return "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800";
    });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/venue");
        if (!res.ok) throw new Error("Backend offline");
        const data = await res.json();
        const mapped = data.map((v: any) => ({
          id: String(v.id),
          name: v.name || "",
          description: v.description || "",
          capacity: v.seatingCapacity || v.capacity || 20,
          location: v.city || v.location || "San Francisco",
          address: v.address || "",
          pricePerHour: v.pricePerHour || 75,
          pricePerDay: v.pricePerDay || (v.pricePerHour ? v.pricePerHour * 8 : 550),
          rating: v.rating || 4.8,
          reviewsCount: v.reviewsCount || 12,
          type: (v.venueType || v.type || "conference").toLowerCase() as any,
          images: mapBackendImages(v.imageFiles, v.venueType || v.type),
          amenities: Array.isArray(v.amenities) ? v.amenities.map((a: any) => typeof a === 'string' ? a : (a.name || "")) : [],
          ownerId: v.owner ? String(v.owner.id) : "host-1"
        }));

        if (isMounted) {
          setVenuesList(mapped);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setVenuesList(contextVenues);
          setLoading(false);
        }
      }
    };

    fetchVenues();
    return () => { isMounted = false; };
  }, [contextVenues]);

  const filteredVenues = activeCategory === "all"
    ? venuesList
    : venuesList.filter((v) => v.type === activeCategory);

  return (
    <section className="py-16 bg-muted/20 dark:bg-muted/5 border-b border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Building2 className="h-4 w-4" />
              <span>Public Directory & Catalog</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Explore Available Spaces
            </h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg">
              Browse approved venue listings, inspect capacity & amenities freely without logging in.
            </p>
          </div>

          <Button
            onClick={() => router.push("/venues")}
            variant="outline"
            className="mt-4 md:mt-0 rounded-xl font-bold border-border bg-card hover:bg-accent flex items-center"
          >
            View All {venuesList.length} Venues
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>

        {/* Public Notice Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-foreground flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <span>
              <strong>Public Access Mode:</strong> Anyone can search and view full venue specifications. When you click <em>Book Space</em>, you will be prompted to sign in to confirm your time slot reservation.
            </span>
          </div>
          {!user && (
            <button
              onClick={() => router.push("/login?message=Please+sign+in+to+access+venue+bookings")}
              className="text-primary hover:underline font-bold text-xs shrink-0 hidden sm:block"
            >
              Sign In Now &rarr;
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm scale-102"
                  : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Venue Cards Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl border border-border/80 bg-card p-4 animate-pulse" />
            ))}
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card">
            <p className="text-muted-foreground text-sm font-medium">No venues found in this category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.slice(0, 6).map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
