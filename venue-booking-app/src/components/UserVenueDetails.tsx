"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Venue, useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Star, Sparkles, Check, Info, ShieldCheck, ArrowRight, CalendarRange, Clock } from "lucide-react";

interface UserVenueDetailsProps {
  venueId: string;
  previewMode?: boolean;
}

export interface NormalizedException {
  id: string;
  date: string; // YYYY-MM-DD
  closed: boolean;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
}

export const normalizeExceptions = (data: any[]): NormalizedException[] => {
  if (!Array.isArray(data)) return [];
  return data
    .filter((e: any) => e.status !== "CANCELLED")
    .map((e: any) => {
      return {
        id: String(e.id),
        date: e.exceptionDate || e.startDate || "",
        closed: e.closed !== undefined ? e.closed : (e.type === "holiday" || e.type === "maintenance"),
        startTime: e.openingTime || e.startTime || null,
        endTime: e.closingTime || e.endTime || null,
        reason: e.reason || e.name || ""
      };
    })
    .filter((e: any) => e.date);
};

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

const mapVenueResponseToVenue = (v: any): Venue => {
  return {
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
    ownerId: v.ownerId ? String(v.ownerId) : "host-1"
  };
};

export default function UserVenueDetails({ venueId, previewMode = false }: UserVenueDetailsProps) {
  const router = useRouter();
  const { user } = useApp();

  // Find Venue via API / Backend
  const [venue, setVenue] = useState<Venue | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exceptions, setExceptions] = useState<NormalizedException[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchVenue = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/venue/${venueId}?id=${venueId}`);
        if (!response.ok) throw new Error("API failed to find venue");
        
        const data = await response.json();
        const mappedVenue = mapVenueResponseToVenue(data);

        // Fetch exceptions
        let fetchedExceptions: any[] = [];
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          const exResponse = await fetch(`http://localhost:8080/api/owner/venue/${venueId}/exceptions`, {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
          });
          if (exResponse.ok) {
            fetchedExceptions = await exResponse.json();
          }
        } catch (exErr) {
          console.warn("Could not fetch exceptions from backend:", exErr);
        }
        
        if (isMounted) {
          setVenue(mappedVenue);
          setExceptions(normalizeExceptions(fetchedExceptions));
          setActiveImage(mappedVenue.images?.[0] || "");
          setLoading(false);
        }
      } catch (err) {
        console.warn("Backend venue endpoint unavailable, loading from mock data.", err);
        // Fallback to local storage API
        api.getVenueDetails(venueId)
          .then(async (data) => {
            const mapped = mapVenueResponseToVenue(data);
            let localExceptions: any[] = [];
            try {
              localExceptions = await api.getExceptionRules(venueId);
            } catch (exErr) {
              console.warn("Could not fetch local exception rules:", exErr);
            }

            if (isMounted) {
              setVenue(mapped);
              setExceptions(normalizeExceptions(localExceptions));
              setActiveImage(mapped.images?.[0] || "");
              setLoading(false);
            }
          })
          .catch((mockErr) => {
            if (isMounted) {
              setError("Failed to load venue details.");
              setLoading(false);
            }
          });
      }
    };

    fetchVenue();

    return () => {
      isMounted = false;
    };
  }, [venueId]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-background min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-muted-foreground text-sm">Loading venue specifications...</p>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-background min-h-[400px] border border-dashed border-border rounded-2xl">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <Info className="h-6 w-6" />
        </div>
        <h4 className="font-extrabold text-lg text-foreground">Failed to Load Venue</h4>
        <p className="text-muted-foreground text-sm max-w-sm mt-1">{error || "The venue does not exist."}</p>
      </div>
    );
  }

  const handleBookRedirect = () => {
    if (!user) {
      const bookPath = `/venues/${venue.id}/book`;
      router.push(`/login?message=${encodeURIComponent("Please sign in to book this venue")}&redirect=${encodeURIComponent(bookPath)}`);
      return;
    }
    router.push(`/venues/${venue.id}/book`);
  };

  return (
    <div className="w-full">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2.5 py-1 rounded-lg uppercase">
              {venue.type}
            </span>
            <span className="flex items-center text-sm font-bold text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
              {venue.rating.toFixed(2)}{" "}
              <span className="text-muted-foreground font-medium ml-1">
                ({venue.reviewsCount} reviews)
              </span>
            </span>
            {previewMode && (
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                PREVIEW AS USER
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {venue.name}
          </h1>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 text-primary mr-1.5 shrink-0" />
            <span>{venue.address} &bull; {venue.location}</span>
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <div className="text-sm text-muted-foreground">Starting at</div>
          <div className="flex items-baseline md:justify-end space-x-1 mt-0.5">
            <span className="text-3xl font-extrabold text-foreground">${venue.pricePerHour}</span>
            <span className="text-sm text-muted-foreground">/ hr</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">or ${venue.pricePerDay} per day</div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Main Large Image */}
        <div className="lg:col-span-2 aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted relative">
          <img
            src={activeImage}
            alt={venue.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Thumbnail list */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 h-full">
          {venue.images && venue.images.slice(0, 3).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-video lg:h-[110px] w-full rounded-xl overflow-hidden border-2 bg-muted transition-all cursor-pointer ${
                activeImage === img ? "border-primary shadow-sm" : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Details & Booking Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Main Details Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-foreground mb-4">About this space</h2>
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
              {venue.description}
            </p>

            {/* Quick specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-border mt-6 pt-6 text-sm">
              <div className="flex items-center space-x-2.5">
                <Users className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Capacity</div>
                  <div className="font-bold text-foreground">{venue.capacity} guests</div>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="font-bold text-foreground">{venue.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Setup Type</div>
                  <div className="font-bold text-foreground">Customizable</div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-foreground mb-4">Included Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {venue.amenities && venue.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-muted-foreground font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exceptions Section */}
          {exceptions.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-foreground mb-4">Availability Exceptions</h2>
              <div className="space-y-3">
                {exceptions.map((ex) => (
                  <div key={ex.id} className="flex items-start justify-between p-3.5 rounded-xl border border-border/60 bg-muted/5">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-foreground">
                          {new Date(ex.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        {ex.closed ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/30">
                            Closed
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                            Special Hours
                          </span>
                        )}
                      </div>
                      {ex.reason && (
                        <p className="text-xs text-muted-foreground">{ex.reason}</p>
                      )}
                    </div>
                    {!ex.closed && ex.startTime && ex.endTime && (
                      <span className="text-xs font-semibold text-foreground bg-secondary px-2.5 py-1 rounded-lg flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {ex.startTime.substring(0, 5)} - {ex.endTime.substring(0, 5)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-foreground mb-4">Location Map</h2>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-slate-100 dark:bg-slate-900/40 relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px] dark:opacity-10 dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px)]" />
              <div className="relative z-10 flex flex-col items-center p-6 bg-card rounded-2xl border border-border shadow max-w-sm text-center">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm text-foreground">{venue.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-normal">{venue.address}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-foreground">Guest Reviews</h2>
            
            {venue.reviewsCount === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No reviews yet. Be the first to review this space!
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-6 pb-6 border-b border-border">
                  <div className="text-center">
                    <div className="text-4xl font-black text-foreground">{venue.rating.toFixed(2)}</div>
                    <div className="flex justify-center text-amber-400 my-1">
                      {"★".repeat(Math.round(venue.rating)) + "☆".repeat(5 - Math.round(venue.rating))}
                    </div>
                    <div className="text-xs text-muted-foreground">Based on {venue.reviewsCount} reviews</div>
                  </div>
                  
                  <div className="flex-1 space-y-1.5 hidden sm:block">
                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                      <span className="w-12">5 stars</span>
                      <div className="flex-grow h-2 bg-secondary rounded overflow-hidden">
                        <div className="bg-amber-400 h-full w-[85%]" />
                      </div>
                      <span className="w-8 text-right">85%</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                      <span className="w-12">4 stars</span>
                      <div className="flex-grow h-2 bg-secondary rounded overflow-hidden">
                        <div className="bg-amber-400 h-full w-[12%]" />
                      </div>
                      <span className="w-8 text-right">12%</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                      <span className="w-12">3 stars</span>
                      <div className="flex-grow h-2 bg-secondary rounded overflow-hidden">
                        <div className="bg-amber-400 h-full w-[3%]" />
                      </div>
                      <span className="w-8 text-right">3%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground">Sarah Jenkins</span>
                      <span className="text-xs text-muted-foreground">June 10, 2026</span>
                    </div>
                    <div className="text-amber-400 text-xs">★★★★★</div>
                    <p className="text-muted-foreground leading-relaxed text-xs">
                      This {venue.type} was absolutely perfect for our needs. The setup of {venue.name} was highly professional, facilities were top-notch, and the location in {venue.location} was very convenient. Highly recommended!
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Book Now button at the bottom of left column */}
          <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-2xl shadow-sm">
            <div>
              <h4 className="font-extrabold text-base text-foreground">Ready to reserve this space?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Select a calendar day and time slot to book instantly.</p>
            </div>
            <Button
              onClick={handleBookRedirect}
              className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 py-5 shadow flex items-center transition-transform hover:scale-[1.02] cursor-pointer"
            >
              Book Now
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Sticky Booking Widget (Simplified) */}
        <div className="sticky top-24 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <span className="text-2xl font-extrabold text-foreground">${venue.pricePerHour}</span>
              <span className="text-sm text-muted-foreground font-medium"> / hour</span>
            </div>

            <div className="space-y-3 pt-3 border-t border-border text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Capacity:</span>
                <span className="font-bold text-foreground">{venue.capacity} guests</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-bold text-foreground">{venue.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-bold text-foreground capitalize">{venue.type}</span>
              </div>
            </div>

            <Button
              onClick={handleBookRedirect}
              className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-6 shadow-md transition-all cursor-pointer flex items-center justify-center text-sm"
            >
              Book Now
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>

            <div className="text-xxs text-center text-muted-foreground leading-normal px-2">
              Select date & time slot on the next page. Free cancellation up to 24h prior.
            </div>
          </div>

          {/* Guarantee safety */}
          <div className="border border-border bg-card rounded-2xl p-4 shadow-sm flex items-center space-x-3 text-xs">
            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h5 className="font-bold text-foreground">BookMyVenue Guarantee</h5>
              <p className="text-muted-foreground mt-0.5">Secure payment & verified space layout assured.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
