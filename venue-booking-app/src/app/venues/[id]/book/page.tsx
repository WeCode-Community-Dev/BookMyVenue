"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, CalendarRange } from "lucide-react";
import SlotSelection from "@/components/SlotSelection";
import { api } from "@/lib/api";
import { Venue, useApp } from "@/context/AppContext";

const BACKEND_URL = "http://localhost:8080";

const mapBackendImages = (imageFiles: any[] | undefined, venueType: string): string[] => {
  if (!imageFiles || imageFiles.length === 0) return ["https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800"];
  return imageFiles.map((img: any) => {
    if (typeof img === "string") return img.startsWith("http") ? img : `http://localhost:8080/${img}`;
    if (img && typeof img === "object") {
      const loc = img.fileLocation || img.filePath || img.url;
      if (loc) return loc.startsWith("http") ? loc : `http://localhost:8080/${loc}`;
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

export default function BookVenueSlotsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useApp();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push(`/login?message=${encodeURIComponent("Please log in to select and reserve venue slots")}&redirect=${encodeURIComponent(`/venues/${id}/book`)}`);
    }
  }, [user, id, router]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchVenueDetails = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/venue/${id}?id=${id}`);
        if (!response.ok) throw new Error("API failed");
        const data = await response.json();
        const mapped = mapVenueResponseToVenue(data);
        if (isMounted) {
          setVenue(mapped);
          setLoading(false);
        }
      } catch (err) {
        // Fallback to local storage
        api.getVenueDetails(id)
          .then((data) => {
            if (isMounted) {
              setVenue(mapVenueResponseToVenue(data));
              setLoading(false);
            }
          })
          .catch(() => {
            if (isMounted) {
              setLoading(false);
            }
          });
      }
    };

    fetchVenueDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-background min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-muted-foreground text-sm">Initializing booking gateway...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-background min-h-[400px]">
        <h4 className="font-extrabold text-lg text-foreground">Venue Not Found</h4>
        <p className="text-muted-foreground text-sm mt-1">We couldn't load the slot scheduler for this venue.</p>
        <Link href="/venues" className="mt-4 text-primary hover:underline text-sm font-semibold">
          Back to venue search
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-background py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation Link */}
        <Link
          href={`/venues/${id}`}
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline mb-6 select-none"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to venue details
        </Link>

        {/* Mini Venue Header Card */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                  {venue.type}
                </span>
                <span className="text-xs font-semibold text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {venue.location}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground mt-1 tracking-tight">
                {venue.name}
              </h2>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xxs font-extrabold uppercase tracking-wider text-muted-foreground block">
              Base Price Rate
            </span>
            <span className="text-2xl font-black text-foreground mt-0.5 block">
              ${venue.pricePerHour} <span className="text-xs text-muted-foreground font-normal">/ hr</span>
            </span>
          </div>
        </div>

        {/* Slot Selection Scheduler Component */}
        <SlotSelection
          venueId={id}
          venueName={venue.name}
          pricePerHour={venue.pricePerHour}
        />

      </div>
    </div>
  );
}
