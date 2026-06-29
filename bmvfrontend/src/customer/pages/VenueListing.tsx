"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MOCK_CITIES } from "@/src/lib/mockData";
import { getWishlist, toggleWishlist } from "@/src/lib/authStore";
import { PublicVenueResponseDto, VenueType } from "@/src/venues/types";
import { fetchPublicVenues } from "@/src/venues/route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  MapPin,
  Users,
  Grid,
  List,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  Star,
  Sparkles,
  Calendar as CalendarIcon,
  Search,
  Map,
  X,
  ShieldAlert
} from "lucide-react";

export default function VenueListing() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Backend API states
  const [venues, setVenues] = useState<PublicVenueResponseDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [apiError, setApiError] = useState("");
  const limit = 10;



  const formatVenueType = (type: VenueType): string => {
    switch (type) {
      case VenueType.WEDDING_HALL: return "Wedding Hall";
      case VenueType.AUDITORIUM: return "Auditorium";
      case VenueType.RESORT: return "Resort";
      case VenueType.CONVENTION_CENTER: return "Convention Center";
      case VenueType.CAFE: return "Cafe";
      case VenueType.PARTY_HALL: return "Party Hall";
      case VenueType.MEETUP_SPACE: return "Meetup Space";
      case VenueType.MALL: return "Mall Space";
      case VenueType.HOTEL: return "Hotel Hall";
      default: return "Venue";
    }
  };

  const getOccasionsForType = (type: VenueType): string[] => {
    switch (type) {
      case VenueType.WEDDING_HALL: return ["Wedding", "Social"];
      case VenueType.AUDITORIUM: return ["Corporate", "Academic"];
      case VenueType.RESORT: return ["Wedding", "Social"];
      case VenueType.CONVENTION_CENTER: return ["Corporate", "Exhibition"];
      case VenueType.CAFE: return ["Birthday", "Social"];
      case VenueType.PARTY_HALL: return ["Birthday", "Social"];
      case VenueType.MEETUP_SPACE: return ["Corporate", "Workshop"];
      default: return ["Event"];
    }
  };

  // URL search params
  const paramLocation = searchParams.get("location") || "";
  const paramOccasion = searchParams.get("occasion") || "";
  const paramDate = searchParams.get("date") || "";
  const paramType = searchParams.get("type") || "";

  // UI / View State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlistState] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showMockMap, setShowMockMap] = useState(false);

  // Search input state
  const [searchLocation, setSearchLocation] = useState(paramLocation);

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>(paramType ? [paramType] : []);
  const [selectedOccasion, setSelectedOccasion] = useState<string>(paramOccasion);
  const [priceRange, setPriceRange] = useState<number[]>([5000, 500000]);
  const [minCapacity, setMinCapacity] = useState<number>(10);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [ratingFourPlus, setRatingFourPlus] = useState(false);
  const [availableDate, setAvailableDate] = useState<Date | undefined>(
    paramDate ? new Date(paramDate) : undefined
  );

  // Sort State
  const [sortBy, setSortBy] = useState("relevance");

  // Load wishlist on mount
  useEffect(() => {
    setWishlistState(getWishlist());
  }, []);

  // Update filters if search parameters change
  useEffect(() => {
    if (paramType) setSelectedTypes([paramType]);
    if (paramOccasion) setSelectedOccasion(paramOccasion);
    if (paramLocation) setSearchLocation(paramLocation);
    if (paramDate) setAvailableDate(new Date(paramDate));
  }, [paramType, paramOccasion, paramLocation, paramDate]);

  // Load venues from backend REST API
  const loadVenues = async () => {
    setLoading(true);
    setApiError("");
    try {
      const isPopularCity = MOCK_CITIES.some(c => c.toLowerCase() === searchLocation.toLowerCase());
      const typeParam = selectedTypes[0] as VenueType | undefined;

      const response = await fetchPublicVenues({
        city: isPopularCity ? searchLocation : undefined,
        search: !isPopularCity && searchLocation ? searchLocation : undefined,
        venueType: typeParam,
        maxCapacity: minCapacity > 10 ? minCapacity : undefined,
        page,
        limit,
      });

      setVenues(response.data);
      setTotalCount(response.total);
    } catch (err: any) {
      setApiError(err.message || "Failed to fetch venues from server.");
    } finally {
      setLoading(false);
    }
  };

  // Re-load venues when parameters or page change
  useEffect(() => {
    loadVenues();
  }, [searchLocation, selectedTypes, minCapacity, page]);

  // Reset to first page when query filters are changed
  useEffect(() => {
    setPage(1);
  }, [searchLocation, selectedTypes, minCapacity]);

  // Compute active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (selectedOccasion) count += 1;
    if (priceRange[0] !== 5000 || priceRange[1] !== 500000) count += 1;
    if (minCapacity > 10) count += 1;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (ratingFourPlus) count += 1;
    if (availableDate) count += 1;
    return count;
  };

  const activeCount = getActiveFilterCount();

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSelectedOccasion("");
    setPriceRange([5000, 500000]);
    setMinCapacity(10);
    setSelectedAmenities([]);
    setRatingFourPlus(false);
    setAvailableDate(undefined);
    setSearchLocation("");
    setPage(1);
    router.push("/venues");
  };

  const triggerSimulatedLoading = () => {
    loadVenues();
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    }
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    } else {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    }
  };

  const handleWishlistToggle = (id: string) => {
    const updated = toggleWishlist(id);
    setWishlistState(updated);
  };

  // Local sort on fetched page results
  const sortedVenues = [...venues].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.startingPrice - b.startingPrice;
    }
    if (sortBy === "price-high") {
      return b.startingPrice - a.startingPrice;
    }
    // Default/Popularity/Relevance: keep backend order (newest first)
    return 0;
  });

  const renderFiltersContent = () => (
    <div className="space-y-6">
      {/* Date Range / Availability */}
      <div>
        <h4 className="text-xs font-bold text-neutral-dark uppercase tracking-wider mb-2.5">Date Availability</h4>
        <Popover>
          <PopoverTrigger className="w-full justify-start text-left font-normal border border-input rounded-xl h-10 px-3 py-1 flex items-center bg-white cursor-pointer hover:bg-neutral-light transition-all">
            <CalendarIcon className="mr-2 h-4 w-4 text-teal-primary" />
            {availableDate ? availableDate.toLocaleDateString("en-IN") : "Select a date"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-border" align="start">
            <Calendar
              mode="single"
              selected={availableDate}
              onSelect={(d) => {
                setAvailableDate(d);
                triggerSimulatedLoading();
              }}
              className="bg-white border-0"
            />
          </PopoverContent>
        </Popover>
      </div>

      <hr className="border-neutral-light" />

      {/* Accordions for Filter Sections */}
      <Accordion defaultValue={["venue-type", "occasion", "pricing", "guest-capacity", "amenity-list", "ratings"]}>
        {/* Venue Type Accordion */}
        <AccordionItem value="venue-type" className="border-b border-neutral-light py-2">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">Venue Type</AccordionTrigger>
          <AccordionContent className="pt-2 pb-3 space-y-2">
            {Object.values(VenueType).map((type) => (
              <label key={type} className="flex items-center gap-2.5 text-sm text-neutral-dark cursor-pointer font-medium">
                <Checkbox
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    handleTypeChange(type, !!checked);
                    triggerSimulatedLoading();
                  }}
                />
                {formatVenueType(type)}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Occasion Accordion */}
        <AccordionItem value="occasion" className="border-b border-neutral-light py-2">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">Occasion</AccordionTrigger>
          <AccordionContent className="pt-2 pb-3">
            <RadioGroup
              value={selectedOccasion}
              onValueChange={(val) => {
                setSelectedOccasion(val);
                triggerSimulatedLoading();
              }}
              className="space-y-2.5"
            >
              {["Wedding", "Corporate", "Birthday", "Social"].map((occ) => (
                <div key={occ} className="flex items-center gap-2.5 text-sm text-neutral-dark font-medium">
                  <RadioGroupItem value={occ} id={`desktop-${occ}`} />
                  <label htmlFor={`desktop-${occ}`} className="cursor-pointer">{occ}</label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Pricing Accordion */}
        <AccordionItem value="pricing" className="border-b border-neutral-light py-2">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">Price Range (Per Day)</AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 px-1">
            <div className="flex justify-between text-xs font-semibold text-teal-primary mb-3">
              <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
              <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
            </div>
            <Slider
              value={priceRange}
              min={5000}
              max={500000}
              step={5000}
              onValueChange={(val) => setPriceRange(val as number[])}
              onValueCommitted={triggerSimulatedLoading}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Capacity Accordion */}
        <AccordionItem value="guest-capacity" className="border-b border-neutral-light py-2">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">Minimum Guests</AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 px-1">
            <div className="text-xs font-semibold text-teal-primary mb-3">
              {minCapacity === 10 ? "Any capacity" : `${minCapacity}+ guests`}
            </div>
            <Slider
              value={[minCapacity]}
              min={10}
              max={2000}
              step={10}
              onValueChange={(val) => setMinCapacity(Array.isArray(val) ? val[0] : val)}
              onValueCommitted={triggerSimulatedLoading}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Amenities Accordion */}
        <AccordionItem value="amenity-list" className="border-b border-neutral-light py-2">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">Amenities</AccordionTrigger>
          <AccordionContent className="pt-2 pb-3 space-y-2">
            {["Parking", "AC", "Catering", "AV Equipment", "Valet", "WiFi", "Decoration"].map((amenity) => (
              <label key={amenity} className="flex items-center gap-2.5 text-sm text-neutral-dark cursor-pointer font-medium">
                <Checkbox
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    handleAmenityChange(amenity, !!checked);
                    triggerSimulatedLoading();
                  }}
                />
                {amenity}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Ratings Accordion */}
        <AccordionItem value="ratings" className="py-2 border-0">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">Rating</AccordionTrigger>
          <AccordionContent className="pt-2 pb-2">
            <label className="flex items-center gap-2.5 text-sm text-neutral-dark cursor-pointer font-medium">
              <Checkbox
                checked={ratingFourPlus}
                onCheckedChange={(checked) => {
                  setRatingFourPlus(!!checked);
                  triggerSimulatedLoading();
                }}
              />
              4.0★ and above only
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Search header / quick location bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-neutral-light">
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
              <Search className="h-4 w-4" />
            </span>
            <Input
              type="text"
              placeholder="Search by city or location..."
              value={searchLocation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchLocation(e.target.value);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") triggerSimulatedLoading();
              }}
              className="pl-9 h-11 bg-white border-input rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-xs text-neutral-muted font-medium">
              Active filters: <Badge className="bg-teal-primary text-white py-0.5 px-2 text-[10px] ml-1">{activeCount}</Badge>
            </div>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-neutral-muted hover:text-teal-primary flex items-center gap-1 h-8 rounded-lg"
              >
                <RotateCcw className="h-3 w-3" /> Reset all
              </Button>
            )}
          </div>
        </div>

        {/* MAIN LAYOUT: Sticky sidebar + scrollable panel */}
        <div className="flex gap-8 items-start relative">

          {/* Desktop Left Sidebar Filters (hidden on mobile) */}
          <aside className="hidden lg:block w-72 shrink-0 bg-white border border-neutral-light rounded-2xl p-6 sticky top-20 max-h-[85vh] overflow-y-auto shadow-sm">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-neutral-light">
              <h3 className="font-serif font-bold text-lg text-neutral-dark">Filters</h3>
              {activeCount > 0 && (
                <button onClick={handleResetFilters} className="text-xs text-teal-primary font-semibold hover:underline">
                  Clear All
                </button>
              )}
            </div>
            {renderFiltersContent()}
          </aside>

          {/* Right Main Panel */}
          <div className="flex-1 w-full">

            {/* Top Bar inside panel */}
            <div className="flex justify-between items-center mb-6 bg-white border border-neutral-light p-3.5 rounded-xl shadow-xs">
              <div className="text-sm text-neutral-dark font-medium">
                {loading ? (
                  <Skeleton className="h-5 w-40" />
                ) : (
                  <span>
                    <strong className="text-teal-primary font-bold">{totalCount}</strong> venues found
                    {searchLocation && <span> in <strong className="text-neutral-dark">{searchLocation}</strong></span>}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <Select value={sortBy} onValueChange={(val) => { if (val) { setSortBy(val); triggerSimulatedLoading(); } }}>
                  <SelectTrigger className="w-[160px] h-9 border-input bg-white text-xs font-semibold rounded-lg">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="relevance">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="h-6 w-px bg-neutral-light hidden sm:block" />

                {/* Grid/List View Toggles */}
                <div className="hidden sm:flex items-center bg-neutral-light p-0.5 rounded-lg border border-neutral-light">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-teal-primary shadow-xs" : "text-neutral-muted hover:text-neutral-dark"}`}
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white text-teal-primary shadow-xs" : "text-neutral-muted hover:text-neutral-dark"}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RESULTS CONTAINER */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-xs flex gap-2 items-center mb-6 animate-fade-in">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {loading ? (
              // Loading skeletons
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-6"}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className={`bg-white rounded-2xl border border-neutral-light overflow-hidden p-4 ${viewMode === "list" ? "flex flex-col sm:flex-row gap-6" : "space-y-4"}`}>
                    <Skeleton className={`bg-neutral-light ${viewMode === "list" ? "h-48 sm:w-64" : "h-48 w-full"}`} />
                    <div className="flex-1 space-y-3 py-2">
                      <Skeleton className="h-4 w-24 bg-neutral-light" />
                      <Skeleton className="h-6 w-3/4 bg-neutral-light" />
                      <Skeleton className="h-4 w-1/2 bg-neutral-light" />
                      <div className="pt-4 border-t border-neutral-light flex justify-between">
                        <Skeleton className="h-5 w-24 bg-neutral-light" />
                        <Skeleton className="h-5 w-20 bg-neutral-light" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedVenues.length === 0 ? (
              // Empty State
              <div className="w-full bg-white border border-neutral-light rounded-2xl p-16 text-center flex flex-col items-center animate-fade-in shadow-xs">
                <div className="h-20 w-20 rounded-full bg-teal-light text-teal-primary flex items-center justify-center mb-6">
                  <RotateCcw className="h-10 w-10 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <h3 className="font-serif font-bold text-2xl text-neutral-dark mb-2">No venues match filters</h3>
                <p className="text-sm text-neutral-muted max-w-sm mb-6 leading-relaxed">
                  We couldn't find any venues that match your current filter selections. Try broadening your budget range, decreasing guest counts, or selecting fewer amenities.
                </p>
                <Button onClick={handleResetFilters} className="bg-teal-primary text-white hover:bg-teal-hover rounded-xl px-6">
                  Reset Filters
                </Button>
              </div>
            ) : (
              // Result Cards (Grid or List view)
              <div className="space-y-6">
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in" : "space-y-6 animate-fade-in"}>
                  {sortedVenues.map((venue) => {
                    const isStarred = wishlist.includes(venue.id);
                    const venueImage = venue.thumbnailImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800";
                    const formattedType = formatVenueType(venue.venueType);
                    const occasions = getOccasionsForType(venue.venueType);
                    return (
                      <div
                        key={venue.id}
                        className={`group flex bg-white rounded-2xl border border-neutral-light overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${viewMode === "list" ? "flex-col sm:flex-row" : "flex-col"
                          }`}
                      >
                        {/* Image Frame */}
                        <div className={`relative bg-neutral-light overflow-hidden shrink-0 ${viewMode === "list" ? "h-56 sm:h-auto sm:w-72" : "h-52 w-full"}`}>
                          <Image
                            src={venueImage}
                            alt={venue.venueName}
                            fill
                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <Badge className="absolute top-3 left-3 bg-teal-primary text-white text-[9px] font-bold border-0 py-0.5 px-2.5">
                            Verified
                          </Badge>
                          {/* <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishlistToggle(venue.id);
                            }}
                            className="absolute top-3 right-3 h-8 w-8 bg-white/95 rounded-full flex items-center justify-center shadow-sm text-neutral-dark hover:text-red-500 transition-colors focus:outline-none"
                          >
                            <Heart className={`h-4 w-4 transition-all ${isStarred ? "fill-red-500 text-red-500" : "text-neutral-muted"}`} />
                          </button> */}
                        </div>

                        {/* Content Frame */}
                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div>
                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-light text-teal-primary py-0.5 px-2 rounded-full">
                                {formattedType}
                              </span>
                              {occasions.slice(0, 2).map((occ) => (
                                <span key={occ} className="text-[9px] font-semibold bg-neutral-light text-neutral-muted py-0.5 px-2 rounded-full">
                                  {occ}
                                </span>
                              ))}
                            </div>

                            <h3 className="text-base font-serif font-bold text-neutral-dark group-hover:text-teal-primary transition-colors mb-1 line-clamp-1">
                              {venue.venueName}
                            </h3>

                            <p className="text-xs text-neutral-muted flex items-center gap-1 mb-3">
                              <MapPin className="h-3 w-3 text-teal-primary" /> {venue.city}, India
                            </p>

                            {/* <div className="flex items-center gap-1.5 mb-4">
                              <div className="flex text-amber-cta">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < 4 ? "fill-amber-cta" : "text-neutral-light"}`}
                                  />
                                ))}
                              </div>

                            </div> */}
                          </div>

                          {/* Price & Action Strip */}
                          <div className="pt-3 border-t border-neutral-light flex justify-between items-center mt-auto">
                            <div>
                              <span className="text-[10px] text-neutral-muted font-medium uppercase leading-none block">Starting from</span>
                              <span className="text-base font-bold text-teal-primary font-sans">
                                ₹{venue.startingPrice.toLocaleString("en-IN")}
                              </span>
                            </div>

                            <Link href={`/venues/${venue.id}`}>
                              <Button size="sm" className="bg-teal-primary text-white hover:bg-teal-hover rounded-lg h-9 px-4 text-xs font-semibold">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalCount > limit && (
                  <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-neutral-light">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="border-input hover:bg-neutral-light rounded-lg h-9 px-4 text-xs font-semibold cursor-pointer"
                    >
                      Previous
                    </Button>
                    <span className="text-xs text-neutral-muted font-medium">
                      Page {page} of {Math.ceil(totalCount / limit)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= Math.ceil(totalCount / limit)}
                      onClick={() => {
                        setPage((p) => p + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="border-input hover:bg-neutral-light rounded-lg h-9 px-4 text-xs font-semibold cursor-pointer"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE BOTTOM ACTION BAR (Fixed on mobile bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-light p-3 flex justify-around shadow-2xl">
          {/* Bottom Sheet Filter Toggle */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger className="flex items-center justify-center gap-1.5 h-10 w-[45%] text-xs font-bold border border-input rounded-xl bg-white cursor-pointer hover:bg-neutral-light transition-all">
              <SlidersHorizontal className="h-4 w-4 text-teal-primary" />
              Filter
              {activeCount > 0 && (
                <Badge className="bg-teal-primary text-white rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {activeCount}
                </Badge>
              )}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-white rounded-t-3xl p-6 overflow-y-auto">
              <SheetHeader className="flex flex-row justify-between items-center pb-4 border-b border-neutral-light">
                <SheetTitle className="font-serif font-bold text-lg text-neutral-dark">Filters</SheetTitle>
                <div className="flex gap-4">
                  {activeCount > 0 && (
                    <button onClick={handleResetFilters} className="text-xs text-teal-primary font-semibold">
                      Reset All
                    </button>
                  )}
                </div>
              </SheetHeader>
              <div className="py-4">
                {renderFiltersContent()}
              </div>
              <div className="pt-4 border-t border-neutral-light flex gap-3">
                <Button onClick={() => setMobileFiltersOpen(false)} className="flex-1 bg-teal-primary text-white hover:bg-teal-hover rounded-xl py-3.5 h-auto text-sm font-semibold">
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort trigger on Mobile */}
          <Popover>
            <PopoverTrigger className="flex items-center justify-center gap-1.5 h-10 w-[45%] text-xs font-bold border border-input rounded-xl bg-white cursor-pointer hover:bg-neutral-light transition-all">
              <SlidersHorizontal className="h-4 w-4 text-amber-cta rotate-90" />
              Sort By
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-white p-1 rounded-xl shadow-xl border border-border" align="center">
              {[
                { label: "Popularity", value: "relevance" },
                { label: "Price: Low to High", value: "price-low" },
                { label: "Price: High to Low", value: "price-high" },
                { label: "Top Rated", value: "rating" }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setSortBy(item.value);
                    triggerSimulatedLoading();
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-teal-light hover:text-teal-primary transition-colors ${sortBy === item.value ? "bg-teal-light/50 text-teal-primary" : "text-neutral-dark"}`}
                >
                  {item.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        {/* MAP OVERLAY POPUP MOCK */}
        {showMockMap && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative border border-border">
              <button
                onClick={() => setShowMockMap(false)}
                className="absolute top-4 right-4 h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-md text-neutral-dark hover:text-teal-primary"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-6 border-b border-neutral-light">
                <h3 className="font-serif font-bold text-lg text-neutral-dark flex items-center gap-2">
                  <Map className="text-teal-primary" /> Map View: Kochi Venues
                </h3>
              </div>
              <div className="bg-neutral-light h-96 relative flex items-center justify-center">
                {/* Mock map graphic details */}
                <div className="absolute inset-0 bg-neutral-light opacity-80 flex items-center justify-center font-bold text-neutral-muted">
                  [Google Maps Interactive Sandbox Placeholder]
                </div>
                {/* Pins */}
                {sortedVenues.map((v, i) => (
                  <div
                    key={v.id}
                    className="absolute bg-teal-primary text-white font-bold text-[10px] px-2 py-1 rounded-full shadow-md animate-bounce"
                    style={{
                      top: `${20 + i * 12}%`,
                      left: `${30 + (i % 3) * 18}%`,
                      animationDelay: `${i * 100}ms`
                    }}
                  >
                    ₹{(v.startingPrice / 1000).toFixed(0)}K
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Extra space on mobile so bottom action bar doesn't overlay footer */}
      <div className="h-16 lg:hidden" />

      <Footer />
    </div>
  );
}
