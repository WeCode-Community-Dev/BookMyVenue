"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getDetailedVenue } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import VenueHeader from "@/components/venue/VenueHeader";
import VenueGallery from "@/components/venue/VenueGallery";
import VenueInfo from "@/components/venue/VenueInfo";
import VenueDescription from "@/components/venue/VenueDescription";
import VenueAmenities from "@/components/venue/VenueAmenities";
import VenueRules from "@/components/venue/VenueRules";
import VenueReviews from "@/components/venue/VenueReviews";
import OwnerProfile from "@/components/venue/OwnerProfile";
import ContactOwnerModal from "@/components/venue/ContactOwnerModal";
import BookingCard from "@/components/venue/BookingCard";
import VenueCalendar from "@/components/venue/VenueCalendar";
import { VenueCard } from "@/components/home/venue-card";
import { AlertCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VenueDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { venues } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);

  const venue = useMemo(() => {
    const found = venues.find((v) => v.id === id);
    if (!found) return undefined;
    if (found.description) return found;
    return getDetailedVenue(id);
  }, [venues, id]);

  if (!venue) {
    return (
      <>
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md text-center shadow-xl space-y-6">
            <div className="mx-auto size-12 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertCircle className="size-6 text-rose-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900">Venue Not Found</h2>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                We couldn&apos;t locate the venue directory details for id &quot;{id}&quot;. It might have been unlisted or removed.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-sm font-bold shadow-xs active:translate-y-px transition-all"
            >
              Return to Discovery
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Resolve similar venues list
  const similarVenues = (venue.similarVenueIds || [])
    .map((simId) => venues.find((v) => v.id === simId))
    .filter((v): v is typeof venues[0] => !!v);

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 sm:space-y-8">
          
          {/* Header & Photo Gallery */}
          <div className="space-y-4">
            <VenueHeader venue={venue} />
            <VenueGallery images={venue.images || [venue.thumbnail]} name={venue.name} />
          </div>

          {/* 2-Column Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            
            {/* Left Content column (65%) */}
            <div className="lg:col-span-2 space-y-1">
              <VenueInfo
                capacity={venue.capacity}
                category={venue.category}
                rating={venue.rating}
                reviewCount={venue.reviewCount}
                startingPrice={venue.startingPrice}
                city={venue.city}
              />
              <VenueDescription description={venue.description || ""} />
              <VenueAmenities amenities={venue.amenities || []} />
              <VenueCalendar />
              <VenueRules rules={venue.rules || []} />
              <OwnerProfile
                owner={venue.owner!}
                onContactClick={() => setIsContactOpen(true)}
              />
              <VenueReviews
                reviews={venue.reviews || []}
                rating={venue.rating}
                reviewCount={venue.reviewCount}
              />
            </div>

            {/* Right Sticky Booking column (35%) */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 pb-8">
              <BookingCard
                startingPrice={venue.startingPrice}
                rating={venue.rating}
                reviewCount={venue.reviewCount}
              />
            </div>
          </div>

          {/* Similar Venues Row */}
          {similarVenues.length > 0 && (
            <div className="border-t border-slate-200/80 pt-10 pb-6">
              <div className="mb-6 select-none">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  You may also like
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
                  Similar premium event spaces we think you will love
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarVenues.map((simVenue) => (
                  <VenueCard key={simVenue.id} venue={simVenue} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modal overlays */}
      <ContactOwnerModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        ownerName={venue.owner!.name}
      />

      <Footer />
    </>
  );
}
