"use client";

import Header from "@/components/global/header";
import Sidebar from "@/components/global/sidebar";
import MapPanel from "@/components/global/mappanel";
import OfferSection from "@/components/global/offersection";
import VenueTypeSection from "@/components/global/venuetypesection";
import EventTypeFilter from "@/components/global/eventtypefilter";
import VenueFiltersBar from "@/components/global/venuefilterbar";
import Card from "@/components/global/card";
import LoginModal from "@/components/global/login";
import { useState } from "react";

export const venues = [
  {
    id: 1,
    name: "Lagoona Beach Resort",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    location: "Cherai, Kochi",
    distance: "12 km",
    rating: 4.8,
    reviews: 88,
    verified: true,
    guests: 200,
    amenities: ["AC", "Parking"],
    moreAmenities: 5,
    availability: "Available This Weekend",
    price: 18000,
  },

  {
    id: 2,
    name: "The Garden Courtyard",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    location: "Kakkanad, Kochi",
    distance: "2.3 km",
    rating: 4.6,
    reviews: 128,
    verified: true,
    guests: 100,
    amenities: ["AC", "Parking"],
    moreAmenities: 3,
    availability: "Available Today",
    price: 8000,
  },

  {
    id: 3,
    name: "Silverline Banquets",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    location: "Edappally, Kochi",
    distance: "4.1 km",
    rating: 4.7,
    reviews: 96,
    verified: true,
    guests: 100,
    amenities: ["AC", "Parking"],
    moreAmenities: 4,
    availability: "Available This Weekend",
    price: 15000,
  },

  {
    id: 4,
    name: "Metro Cafe & Lounge",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    location: "Panampilly Nagar",
    distance: "1.8 km",
    rating: 4.4,
    reviews: 63,
    verified: false,
    guests: 40,
    amenities: ["AC", "WiFi"],
    moreAmenities: 2,
    availability: "Available Tomorrow",
    price: 4500,
  },

  {
    id: 5,
    name: "Palm Grove Convention Center",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
    location: "Aluva",
    distance: "9 km",
    rating: 4.9,
    reviews: 142,
    verified: true,
    guests: 500,
    amenities: ["AC", "Parking"],
    moreAmenities: 8,
    availability: "Available Today",
    price: 25000,
  },

  {
    id: 6,
    name: "Coral Bay Resort",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    location: "Fort Kochi",
    distance: "7 km",
    rating: 4.5,
    reviews: 71,
    verified: true,
    guests: 150,
    amenities: ["Pool", "Parking"],
    moreAmenities: 6,
    availability: "Available This Weekend",
    price: 12000,
  },

  {
    id: 7,
    name: "Royal Palace Banquets",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    location: "Thrippunithura",
    distance: "10 km",
    rating: 4.7,
    reviews: 110,
    verified: true,
    guests: 350,
    amenities: ["AC", "Parking"],
    moreAmenities: 5,
    availability: "Available Tomorrow",
    price: 22000,
  },

  {
    id: 8,
    name: "Blue Ocean Retreat",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    location: "Vypin",
    distance: "15 km",
    rating: 4.3,
    reviews: 54,
    verified: false,
    guests: 80,
    amenities: ["Pool", "WiFi"],
    moreAmenities: 4,
    availability: "Available Today",
    price: 9500,
  },
];

export default function Page() {
  const [loginOpen, setLoginOpen] = useState(true);

  return (
    <>
    <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1">
          <OfferSection />
          <EventTypeFilter />
          <VenueTypeSection />
          <VenueFiltersBar />
          {/* venues are listed below */}
          <div
            className="mx-4 mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]"
          >
            {venues.map((venue) => (
              <Card key={venue.id} venue={venue} />
            ))}
          </div>
        </main>
        <MapPanel />
      </div>
    </>
  );
}
// import Header from '@/components/global/header'
// import React from 'react'

// const page = () => {
//   return (
//     <div>
//       <Header/>
//     </div>
//   )
// }

// export default page

// import React from 'react'

// const page = () => {
//   return (
//     <div>
//       2. Venues Route (/venues)

// This is the heart of the application.

// Must
// ✅ Catogories

// ✅ Venue Listing

// ✅ Venue Detail Page

// ✅ Venue Images

// ✅ Price

// ✅ Capacity

// Impressive

// ⭐ Location-based search

// Near Me

// using browser geolocation.

// ⭐ Advanced Filters

// Venue Type
// Price Range
// Capacity
// District

// ⭐ Sort By

// Nearest
// Lowest Price
// Highest Rating

// ⭐ Interactive Google Map

// Showing venue pins.

// This alone will impress many reviewers.
//     </div>
//   )
// }

// export default page;
