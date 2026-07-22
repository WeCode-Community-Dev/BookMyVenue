"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp, Venue } from "@/context/AppContext";
import VenueCard from "@/components/VenueCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, Grid, List, X, Sparkles, Filter, AlertCircle, ArrowUpDown } from "lucide-react";

const VENUE_TYPES: { id: Venue["type"]; label: string }[] = [
  { id: "conference", label: "Conference Room" },
  { id: "wedding", label: "Wedding & Ballroom" },
  { id: "coworking", label: "Co-working Space" },
  { id: "studio", label: "Creative Studio" },
  { id: "rooftop", label: "Rooftop Lounge" },
  { id: "garden", label: "Garden Oasis" }
];

const AMENITIES_LIST = [
  "Wi-Fi",
  "AC",
  "Sound System",
  "Projector",
  "TV Screen",
  "Whiteboard",
  "Catering Available",
  "Coffee & Tea",
  "Parking",
  "Lounge Area",
  "Stage",
  "Dressing Room"
];

function VenuesSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { venues: contextVenues } = useApp();

  // Venue listings state
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(400);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // UI States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "priceLow" | "priceHigh">("rating");

  // Helper: map images from backend
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
      if (typeof img === "string") {
        return img.startsWith("http") ? img : `http://localhost:8080/${img}`;
      }
      if (img && typeof img === "object") {
        const loc = img.fileLocation || img.filePath || img.url;
        if (loc) {
          return loc.startsWith("http") ? loc : `http://localhost:8080/${loc}`;
        }
      }
      return "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800";
    });
  };

  // Fetch venues from backend on mount
  useEffect(() => {
    const fetchAllVenues = async () => {
      setLoadingVenues(true);
      try {
        const response = await fetch("http://localhost:8080/api/venue");
        if (!response.ok) throw new Error("Failed to fetch from API");
        const data = await response.json();

        // Map backend entities to Venue interfaces
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
          reviewsCount: v.reviewsCount || 10,
          type: (v.venueType || v.type || "conference").toLowerCase() as any,
          images: mapBackendImages(v.imageFiles, v.venueType || v.type),
          amenities: Array.isArray(v.amenities) ? v.amenities.map((a: any) => typeof a === 'string' ? a : (a.name || "")) : [],
          ownerId: v.owner ? String(v.owner.id) : "host-1"
        }));

        setVenues(mapped);
      } catch (err) {
        console.warn("Backend venue listing endpoint failed, falling back to mock context venues.", err);
        setVenues(contextVenues);
      } finally {
        setLoadingVenues(false);
      }
    };
    fetchAllVenues();
  }, [contextVenues]);

  // Read URL query parameters on load
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const locationParam = searchParams.get("location");
    const capacityParam = searchParams.get("capacity");
    const queryParam = searchParams.get("q");

    if (typeParam) setSelectedTypes([typeParam]);
    if (locationParam) setSelectedLocation(locationParam);
    if (capacityParam) setSelectedCapacity(capacityParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [searchParams]);

  // Sync Search URL Parameters (optional search sync)
  const updateQueryParams = React.useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedTypes.length === 1) params.set("type", selectedTypes[0]);
    if (selectedCapacity) params.set("capacity", selectedCapacity);
    router.replace(`/venues?${params.toString()}`, { scroll: false });
  }, [searchQuery, selectedLocation, selectedTypes, selectedCapacity, router]);

  // Simulate premium SaaS live filtering loader
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 400); // 400ms visual buffer
    updateQueryParams();
    return () => clearTimeout(timer);
  }, [searchQuery, selectedLocation, selectedTypes, selectedCapacity, maxPrice, selectedAmenities, sortBy, updateQueryParams]);

  // Handle checkboxes
  const handleTypeToggle = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedTypes([]);
    setSelectedCapacity("");
    setMaxPrice(400);
    setSelectedAmenities([]);
    router.replace("/venues");
  };

  // Apply filter operations client-side
  const filteredVenues = venues.filter((v) => {
    // 1. Text Search
    if (
      searchQuery &&
      !v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !v.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 2. Location
    if (selectedLocation && v.location !== selectedLocation) {
      return false;
    }

    // 3. Venue Types
    if (selectedTypes.length > 0 && !selectedTypes.includes(v.type)) {
      return false;
    }

    // 4. Capacity
    if (selectedCapacity) {
      const capLimit = parseInt(selectedCapacity);
      if (capLimit === 15 && v.capacity > 15) return false;
      if (capLimit === 50 && v.capacity > 50) return false;
      if (capLimit === 100 && v.capacity > 100) return false;
      if (capLimit === 250 && v.capacity < 250) return false;
    }

    // 5. Max Price Hourly
    if (v.pricePerHour > maxPrice) {
      return false;
    }

    // 6. Amenities
    if (selectedAmenities.length > 0) {
      const hasAllAmenities = selectedAmenities.every((a) => v.amenities.includes(a));
      if (!hasAllAmenities) return false;
    }

    return true;
  });

  // Sort logic
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "priceLow") return a.pricePerHour - b.pricePerHour;
    if (sortBy === "priceHigh") return b.pricePerHour - a.pricePerHour;
    return 0;
  });

  return (
    <div className="flex-1 bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Title & Search bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center">
              <Sparkles className="h-6 w-6 text-primary mr-2" />
              Find Your Venue
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Discover verified spaces designed for productivity and celebrations.
            </p>
          </div>

          {/* Quick Search bar */}
          <div className="flex items-center space-x-2 max-w-md w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search venue names, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl border-border bg-card"
              />
            </div>
            <Button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              variant="outline"
              className="md:hidden rounded-xl flex items-center space-x-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Filters and List Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* 1. Sidebar Filters (Desktop) */}
          <aside
            className={`lg:block ${showFiltersMobile
              ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-6 overflow-y-auto block animate-in slide-in-from-bottom-5 duration-300"
              : "hidden"
              } border border-border bg-card p-6 rounded-2xl shadow-sm space-y-6 sticky top-24`}
          >
            {/* Header / Reset */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="font-extrabold text-foreground flex items-center text-md">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                Filters
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Clear All
                </button>
                {showFiltersMobile && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowFiltersMobile(false)}
                    className="rounded-xl lg:hidden h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Location Select */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Any City</option>
                <option value="San Francisco">San Francisco</option>
                <option value="New York">New York</option>
                <option value="Chicago">Chicago</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Miami">Miami</option>
                <option value="Austin">Austin</option>
              </select>
            </div>

            {/* Space Type Checkboxes */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                Venue Type
              </label>
              <div className="space-y-2">
                {VENUE_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center space-x-2.5 text-sm font-medium text-foreground cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={() => handleTypeToggle(type.id)}
                      className="rounded"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Capacity Filters */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Capacity
              </label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Any Capacity</option>
                <option value="15">Up to 15 guests</option>
                <option value="50">Up to 50 guests</option>
                <option value="100">Up to 100 guests</option>
                <option value="250">250+ guests</option>
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Max Hourly Price
                </label>
                <span className="text-sm font-bold text-foreground">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1.5 bg-secondary rounded-lg"
              />
              <div className="flex justify-between text-xxs text-muted-foreground">
                <span>$50/hr</span>
                <span>$400+/hr</span>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                Amenities
              </label>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {AMENITIES_LIST.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2.5 text-sm font-medium text-foreground cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                      className="rounded"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Button (Mobile only) */}
            {showFiltersMobile && (
              <Button
                onClick={() => setShowFiltersMobile(false)}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 mt-4"
              >
                Apply Filters
              </Button>
            )}
          </aside>

          {/* 2. Results List Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar: Layout switcher, Sorting details, Count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-border bg-card p-4 rounded-2xl shadow-sm text-sm space-y-3 sm:space-y-0">
              <div className="text-muted-foreground font-medium">
                Showing{" "}
                <strong className="text-foreground font-bold">
                  {filteredVenues.length}
                </strong>{" "}
                {filteredVenues.length === 1 ? "space" : "spaces"}
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center justify-between sm:justify-end space-x-4">
                {/* Sort Option */}
                <div className="flex items-center space-x-1.5">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-sm font-semibold text-foreground border-none focus:outline-none cursor-pointer"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>

                {/* Layout Toggles */}
                <div className="flex items-center space-x-1 border-l border-border pl-4">
                  <Button
                    onClick={() => setViewMode("grid")}
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    aria-label="Grid View"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    aria-label="List View"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Listing Grid */}
            {isSearching ? (
              // Loading Skeleton State
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col space-y-4"
                }
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-border p-4 rounded-2xl bg-card space-y-4">
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : sortedVenues.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-2xl shadow-sm">
                <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="font-extrabold text-xl text-foreground">No Spaces Match Your Criteria</h3>
                <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                  We couldn't find any venues fitting those filters. Try broadening your location, adjusting the hourly price, or selecting fewer amenities.
                </p>
                <Button
                  onClick={resetFilters}
                  className="mt-6 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              // Loaded Results Grid / List
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col space-y-6"
                }
              >
                {sortedVenues.map((venue) => {
                  if (viewMode === "grid") {
                    return <VenueCard key={venue.id} venue={venue} />;
                  }

                  // Render list mode layouts
                  const primaryImage = venue.images?.[0] || "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800";
                  return (
                    <div
                      key={venue.id}
                      className="group flex flex-col md:flex-row border border-border bg-card rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      {/* Image block */}
                      <div className="relative w-full md:w-[280px] h-[200px] shrink-0 bg-muted">
                        <img
                          src={primaryImage}
                          alt={venue.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        <span className="absolute top-3 left-3 bg-primary/95 backdrop-blur-sm text-primary-foreground text-xxs font-bold px-2 py-1 rounded-lg">
                          {venue.type.toUpperCase()}
                        </span>
                      </div>

                      {/* Content details block */}
                      <div className="flex-grow p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                            <span>{venue.location}</span>
                            <span className="flex items-center text-foreground font-semibold">
                              ★ {venue.rating.toFixed(1)} ({venue.reviewsCount})
                            </span>
                          </div>
                          <h3 className="font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                            {venue.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {venue.description}
                          </p>
                        </div>

                        {/* List Footer Block */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/60 mt-4 gap-4 sm:gap-0">
                          <div className="flex space-x-4 text-xs text-muted-foreground">
                            <span>Capacity: <strong>{venue.capacity} guests</strong></span>
                            <span>Amenities: <strong>{venue.amenities.slice(0, 3).join(", ")}...</strong></span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end space-x-6">
                            <div className="text-right">
                              <span className="text-lg font-bold text-foreground">${venue.pricePerHour}</span>
                              <span className="text-xs text-muted-foreground">/ hr</span>
                            </div>
                            <Button
                              onClick={() => router.push(`/venues/${venue.id}`)}
                              className="rounded-xl bg-primary text-primary-foreground font-semibold px-4 py-2"
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VenuesSearch() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    }>
      <VenuesSearchContent />
    </Suspense>
  );
}
