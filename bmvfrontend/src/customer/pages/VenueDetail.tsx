"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSession, toggleWishlist, getWishlist } from "@/src/lib/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Users,
  Star,
  CheckCircle2,
  Calendar as CalendarIcon,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Plus,
  Minus,
  Info,
  Clock,
  ShieldCheck,
  PartyPopper,
  X,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { fetchPublicVenueDetail } from "@/src/venues/route";
import { PublicVenueDetailResponseDto, VenueType, BookingType } from "@/src/venues/types";
import { apiFetch } from "@/src/lib/api";

interface VenueDetailProps {
  id: string;
}

export default function VenueDetail({ id }: VenueDetailProps) {
  const router = useRouter();

  // API State
  const [venue, setVenue] = useState<PublicVenueDetailResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // UI States
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [guestsCount, setGuestsCount] = useState(50);
  const [wishlist, setWishlistState] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Availability States
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Check availability when date changes
  useEffect(() => {
    if (!selectedDate) {
      setIsAvailable(null);
      return;
    }

    const checkDateAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const formatDate = (dateObj: Date) => {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const dateStr = formatDate(selectedDate);
        const res = await apiFetch<{ available: boolean }>(`/venues/public/${id}/check-availability?date=${dateStr}`);
        setIsAvailable(res.available);
      } catch (err) {
        // Fallback to available if check fails
        setIsAvailable(true);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkDateAvailability();
  }, [selectedDate, id]);

  // Load wishlist & fetch venue details
  useEffect(() => {
    setWishlistState(getWishlist());

    const loadVenueDetail = async () => {
      setLoading(true);
      setApiError("");
      try {
        const data = await fetchPublicVenueDetail(id);
        setVenue(data);
        // Default guest count to a reasonable value within max capacity
        setGuestsCount(Math.min(50, data.maxCapacity));
      } catch (err: any) {
        setApiError(err.message || "Failed to load venue details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadVenueDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          <Skeleton className="h-6 w-32 bg-neutral-light rounded-lg" />
          <Skeleton className="h-[380px] w-full bg-neutral-light rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-44 w-full bg-neutral-light rounded-2xl" />
              <Skeleton className="h-60 w-full bg-neutral-light rounded-2xl" />
            </div>
            <Skeleton className="h-96 w-full bg-neutral-light rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (apiError || !venue) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 animate-bounce">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="font-serif font-bold text-3xl text-neutral-dark mb-2">Venue Load Failed</h2>
          <p className="text-neutral-muted max-w-sm mb-8">{apiError || "The venue details could not be loaded."}</p>
          <Link href="/venues">
            <Button className="bg-teal-primary text-white hover:bg-teal-hover rounded-xl px-6 py-2.5 h-auto text-sm font-bold shadow-md">
              Back to Listings
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isStarred = wishlist.includes(venue.id);

  const handleWishlistToggle = () => {
    const updated = toggleWishlist(venue.id);
    setWishlistState(updated);
  };

  // Pricing calculation: strictly date-based (full-day only)
  const basePrice = venue.startingPrice;
  const gstTax = Math.round(basePrice * 0.18); // 18% GST
  const serviceFee = Math.round(basePrice * 0.025); // 2.5% Service Fee
  const totalPrice = basePrice + gstTax + serviceFee;

  const handleBookNow = () => {
    const session = getSession();

    const formatDate = (dateObj: Date) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Save selection details to localStorage
    const bookingParams = {
      venueId: venue.id,
      venueName: venue.venueName,
      venueImage: venueImages[0],
      date: selectedDate ? formatDate(selectedDate) : formatDate(new Date()),
      slot: "Full Day",
      guests: guestsCount,
      totalPrice: totalPrice,
    };

    localStorage.setItem("bmv_pending_booking", JSON.stringify(bookingParams));

    if (!session) {
      router.push(`/login?returnUrl=${encodeURIComponent(`/booking/confirm`)}`);
    } else {
      router.push("/booking/confirm");
    }
  };

  // Helper mappings
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

  const getAmenities = () => {
    const list = [];
    if (venue.hasParking) {
      list.push(`Parking${venue.parkingCapacity ? ` (Capacity: ${venue.parkingCapacity})` : ""}`);
    }

    // Type-specific defaults to keep list rich
    switch (venue.venueType) {
      case VenueType.WEDDING_HALL:
        list.push("AC", "Decoration", "Catering", "Valet");
        break;
      case VenueType.AUDITORIUM:
        list.push("AC", "AV Equipment", "WiFi");
        break;
      case VenueType.RESORT:
        list.push("Catering", "AC", "WiFi", "Valet");
        break;
      default:
        list.push("AC", "WiFi");
        break;
    }
    return list;
  };

  const amenityEmojis: Record<string, string> = {
    Parking: "🅿",
    AC: "❄",
    Catering: "🍽",
    "AV Equipment": "🔊",
    Valet: "🚗",
    WiFi: "📶",
    Decoration: "✨"
  };

  // Process Images from Backend
  const images = venue.images?.map((img) => img.imageUrl) || [];
  const venueImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
  ];

  const fullAddress = `${venue.address}, ${venue.city}, ${venue.district}, ${venue.state} - ${venue.pincode}`;

  const handleOpenLightbox = (index: number) => {
    setActivePhotoIdx(index);
    setLightboxOpen(true);
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % venueImages.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + venueImages.length) % venueImages.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 relative z-10">

        {/* Back Link */}
        <div className="mb-4">
          <Link href="/venues" className="inline-flex items-center gap-1 text-xs font-bold text-neutral-muted hover:text-teal-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to Venues
          </Link>
        </div>

        {/* IMAGE GALLERY GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden shadow-md bg-white p-2 border border-neutral-light mb-8">

          {/* Main Hero Photo */}
          <div className="md:col-span-2 relative h-[320px] md:h-[420px] bg-neutral-light group cursor-pointer" onClick={() => handleOpenLightbox(0)}>
            <Image
              src={venueImages[0]}
              alt={`${venue.venueName} Main View`}
              fill
              className="object-cover group-hover:brightness-95 transition-all"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 backdrop-blur-xs font-semibold border border-white/10">
              <Maximize2 className="h-3.5 w-3.5" /> Tap to expand
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="hidden md:grid grid-cols-2 gap-2 h-[420px]">
            {venueImages.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden group bg-neutral-light"
                onClick={() => handleOpenLightbox(idx + 1)}
              >
                <Image
                  src={img}
                  alt={`${venue.venueName} Detail ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-300 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-all" />

                {/* Overlay on last item */}
                {idx === 3 && venueImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                    +{venueImages.length - 5} Photos
                  </div>
                )}
              </div>
            ))}
            {/* Fallback empty placeholders */}
            {Array.from({ length: Math.max(0, 4 - venueImages.slice(1, 5).length) }).map((_, i) => (
              <div key={`fallback-${i}`} className="bg-neutral-light rounded-lg flex items-center justify-center text-neutral-muted">
                <CalendarIcon className="h-6 w-6 opacity-30" />
              </div>
            ))}
          </div>
        </section>

        {/* DETAILS & STICKY BOOKING PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Side: Venue Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Info Card */}
            <div className="bg-white border border-neutral-light rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-teal-primary text-white border-0 py-0.5 px-2.5 text-xs font-semibold">
                  {formatVenueType(venue.venueType)}
                </Badge>
                <Badge variant="outline" className="border-teal-primary/30 text-teal-primary bg-teal-light py-0.5 px-2.5 text-xs font-semibold">
                  Verified Venue
                </Badge>
                <button
                  onClick={handleWishlistToggle}
                  className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-neutral-muted hover:text-red-500 transition-colors"
                >
                  <Heart className={`h-4 w-4 ${isStarred ? "fill-red-500 text-red-500" : ""}`} />
                  {isStarred ? "Saved to Wishlist" : "Save to Wishlist"}
                </button>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-dark mb-2 leading-tight">
                {venue.venueName}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-neutral-muted mb-4">
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-teal-primary" /> {venue.city}, {venue.state}
                </p>
                <div className="hidden sm:block h-3.5 w-px bg-neutral-light" />
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-cta text-amber-cta" />
                  <span className="font-bold text-neutral-dark">4.5</span>
                  <span>(12 reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-neutral-light">
                <div className="text-center sm:text-left bg-neutral-light/40 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-muted block">Capacity</span>
                  <span className="text-sm font-bold text-neutral-dark">{venue.maxCapacity} guests max</span>
                </div>
                <div className="text-center sm:text-left bg-neutral-light/40 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-muted block">Area Size</span>
                  <span className="text-sm font-bold text-neutral-dark">{venue.squareFeet.toLocaleString("en-IN")} sqft</span>
                </div>
                <div className="text-center sm:text-left bg-neutral-light/40 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-muted block">Price Day</span>
                  <span className="text-sm font-bold text-teal-primary">₹{venue.startingPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-center sm:text-left bg-neutral-light/40 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-muted block">City</span>
                  <span className="text-sm font-bold text-neutral-dark">{venue.city}</span>
                </div>
              </div>
            </div>

            {/* Tabs details */}
            <Tabs defaultValue="overview" className="w-full bg-white border border-neutral-light rounded-2xl p-6 shadow-sm">
              <TabsList className="bg-neutral-light border-0 mb-6 flex">
                <TabsTrigger value="overview" className="flex-grow py-2">Overview</TabsTrigger>
                <TabsTrigger value="amenities" className="flex-grow py-2">Amenities</TabsTrigger>
                <TabsTrigger value="policies" className="flex-grow py-2">Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-neutral-dark">About this Venue</h3>
                <p className="text-sm text-neutral-muted leading-relaxed whitespace-pre-line font-light">
                  {venue.description}
                </p>
                <div className="pt-4 border-t border-neutral-light">
                  <h4 className="text-sm font-semibold text-neutral-dark mb-2">Detailed Address</h4>
                  <p className="text-sm text-neutral-muted mb-4">{fullAddress}</p>

                  <h4 className="text-sm font-semibold text-neutral-dark mb-2">Suitable Occasions</h4>
                  <div className="flex flex-wrap gap-2">
                    {getOccasionsForType(venue.venueType).map((occ) => (
                      <span key={occ} className="text-xs font-semibold bg-teal-light text-teal-primary py-1.5 px-3.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 animate-pulse" /> {occ}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-neutral-dark">Available Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {getAmenities().map((amenity) => {
                    const cleanName = amenity.split(" (")[0];
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-3 border border-neutral-light rounded-xl hover:border-teal-primary/30 hover:bg-teal-light/20 transition-all">
                        <span className="text-xl">
                          {amenityEmojis[cleanName] || "🔹"}
                        </span>
                        <span className="text-sm font-semibold text-neutral-dark">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="policies" className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-neutral-dark">Venue Policies & Guidelines</h3>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-amber-light flex items-center justify-center text-amber-cta mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-dark">Booking Time Window</h4>
                      <p className="text-xs text-neutral-muted">Full day booking hours: 8:00 AM – 11:00 PM. Access is strictly granted during these hours unless prior approval is obtained.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-amber-light flex items-center justify-center text-amber-cta mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-dark">Cancellation Terms</h4>
                      <p className="text-xs text-neutral-muted">Free cancellation up to 15 days before the event date. 50% refund between 7-14 days. Bookings canceled within 7 days are non-refundable.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-amber-light flex items-center justify-center text-amber-cta mt-0.5">
                      <PartyPopper className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-dark">Catering and External Sur-charges</h4>
                      <p className="text-xs text-neutral-muted">Catering services are optional. External vendors (Catering / Decoration) are permitted and require a basic coordination fee.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side: Desktop Booking Card (Slots Selector Removed) */}
          <div className="hidden lg:block">
            <Card className="sticky top-20 border border-neutral-light shadow-md bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-neutral-dark">Booking Rate</span>
                  <div className="text-right">
                    <span className="text-xl font-bold font-serif text-teal-primary">₹{basePrice.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-neutral-muted block">/ day</span>
                  </div>
                </div>

                <hr className="border-neutral-light" />

                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-neutral-muted">Select Date</label>
                  <Popover>
                    <PopoverTrigger className="w-full justify-between text-left font-normal border border-input rounded-xl h-10 px-3 py-1 flex items-center bg-white cursor-pointer hover:bg-neutral-light transition-all">
                      <span className="flex items-center gap-2 text-sm font-semibold text-neutral-dark">
                        <CalendarIcon className="h-4 w-4 text-teal-primary" />
                        {selectedDate ? selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Pick Date"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-border" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="bg-white border-0"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Expected Guests Stepper */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-neutral-muted">Expected Guests</label>
                  <div className="flex items-center justify-between border border-input rounded-xl px-3 py-1 bg-white">
                    <button
                      onClick={() => setGuestsCount((prev) => Math.max(10, prev - 10))}
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-neutral-light text-neutral-dark"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold text-neutral-dark">{guestsCount} guests</span>
                    <button
                      onClick={() => setGuestsCount((prev) => Math.min(venue.maxCapacity, prev + 10))}
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-neutral-light text-neutral-dark"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-3 border-t border-neutral-light text-xs text-neutral-muted">
                  <div className="flex justify-between">
                    <span>Base rate (Full Day)</span>
                    <span className="font-semibold text-neutral-dark">₹{basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">GST (18% <Info className="h-3 w-3 text-neutral-muted" />)</span>
                    <span className="font-semibold text-neutral-dark">₹{gstTax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee (2.5%)</span>
                    <span className="font-semibold text-neutral-dark">₹{serviceFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-dark pt-2.5 border-t border-neutral-light">
                    <span>Estimated Total</span>
                    <span className="text-teal-primary text-base">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Submit Booking Button */}
                {checkingAvailability ? (
                  <Button disabled className="w-full bg-neutral-light text-neutral-muted py-3.5 h-auto text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#0D7377]" />
                    Checking Availability...
                  </Button>
                ) : isAvailable === false ? (
                  <div className="w-full bg-red-50 border border-red-200 text-red-600 py-3.5 px-4 rounded-xl text-center font-bold text-sm">
                    Already Booked
                  </div>
                ) : (
                  <Button
                    onClick={handleBookNow}
                    className="w-full bg-amber-cta text-white hover:bg-amber-hover py-3.5 h-auto text-sm font-bold shadow-md shadow-amber-cta/30 rounded-xl cursor-pointer"
                  >
                    Book Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* MOBILE STICKY BOTTOM PANEL (Slots Selector Removed) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-light px-4 py-3 flex items-center justify-between shadow-2xl">
          <div>
            <span className="text-[10px] text-neutral-muted font-bold uppercase leading-none block">Total Price</span>
            <span className="text-base font-bold text-teal-primary font-sans">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          {checkingAvailability ? (
            <Button disabled className="bg-neutral-light text-neutral-muted px-6 h-10 font-bold rounded-xl flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking...
            </Button>
          ) : isAvailable === false ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 h-10 flex items-center justify-center font-bold rounded-xl text-xs">
              Already Booked
            </div>
          ) : (
            <Sheet>
              <SheetTrigger className="bg-amber-cta text-white hover:bg-amber-hover px-6 h-10 font-bold rounded-xl cursor-pointer flex items-center justify-center">
                Configure & Book
              </SheetTrigger>
            <SheetContent side="bottom" className="bg-white rounded-t-3xl p-6 overflow-y-auto max-h-[85vh]">
              <SheetHeader className="pb-4 border-b border-neutral-light flex flex-row justify-between items-center">
                <SheetTitle className="font-serif font-bold text-lg text-neutral-dark">Reserve Venue</SheetTitle>
              </SheetHeader>

              <div className="py-4 space-y-4">
                {/* Date Picker */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-muted">Date</label>
                  <Popover>
                    <PopoverTrigger className="w-full justify-between text-left font-normal border border-input rounded-xl h-10 px-3 py-1 flex items-center bg-white cursor-pointer hover:bg-neutral-light transition-all">
                      <span className="flex items-center gap-2 text-sm font-semibold text-neutral-dark">
                        <CalendarIcon className="h-4 w-4 text-teal-primary" />
                        {selectedDate ? selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Pick Date"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-border" align="center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="bg-white border-0"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guest Count Stepper */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-muted">Expected Guests</label>
                  <div className="flex items-center justify-between border border-input rounded-xl px-3 py-1 bg-white">
                    <button
                      onClick={() => setGuestsCount((prev) => Math.max(10, prev - 10))}
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-neutral-light text-neutral-dark"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold text-neutral-dark">{guestsCount} guests</span>
                    <button
                      onClick={() => setGuestsCount((prev) => Math.min(venue.maxCapacity, prev + 10))}
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-neutral-light text-neutral-dark"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-3 border-t border-neutral-light text-xs text-neutral-muted">
                  <div className="flex justify-between">
                    <span>Base rate (Full Day)</span>
                    <span className="font-semibold text-neutral-dark">₹{basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-neutral-dark">₹{gstTax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee (2.5%)</span>
                    <span className="font-semibold text-neutral-dark">₹{serviceFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-dark pt-2 border-t border-neutral-light">
                    <span>Total Estimate</span>
                    <span className="text-teal-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-light flex gap-3">
                {checkingAvailability ? (
                  <Button disabled className="flex-1 bg-neutral-light text-neutral-muted py-3.5 h-auto text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#0D7377]" />
                    Checking...
                  </Button>
                ) : (isAvailable as any) === false ? (
                  <div className="flex-1 bg-red-50 border border-red-200 text-red-600 py-3.5 px-4 rounded-xl text-center font-bold text-sm">
                    Already Booked
                  </div>
                ) : (
                  <Button onClick={handleBookNow} className="flex-1 bg-amber-cta text-white hover:bg-amber-hover rounded-xl py-3.5 h-auto text-sm font-bold shadow-md shadow-amber-cta/30">
                    Book Now
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
          )}
        </div>

        {/* LIGHTBOX GALLERY MODAL */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xs flex flex-col justify-between p-4">
            <div className="flex justify-between items-center text-white p-2">
              <span className="text-xs font-semibold">
                Photo {activePhotoIdx + 1} of {venueImages.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="h-9 w-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow flex items-center justify-between relative max-w-5xl mx-auto w-full">
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 z-10 h-10 w-10 bg-black/55 hover:bg-black/85 rounded-full flex items-center justify-center text-white border border-white/10 focus:outline-none"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="relative w-full h-[65vh] flex justify-center items-center">
                <Image
                  src={venueImages[activePhotoIdx]}
                  alt={`${venue.venueName} Gallery Photo ${activePhotoIdx + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={handleNextPhoto}
                className="absolute right-2 z-10 h-10 w-10 bg-black/55 hover:bg-black/85 rounded-full flex items-center justify-center text-white border border-white/10 focus:outline-none"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="flex gap-2 justify-center py-4 overflow-x-auto max-w-xl mx-auto w-full">
              {venueImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative h-12 w-16 shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${activePhotoIdx === idx ? "border-amber-cta opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-85"
                    }`}
                >
                  <Image src={img} alt={`Gallery Thumb ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="h-16 lg:hidden" />
      <Footer />
    </div>
  );
}
