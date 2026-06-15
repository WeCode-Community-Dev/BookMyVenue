"use client";

import Card from "@/components/global/card/Card";
import EventTypeFilter from "@/components/global/eventtypefilter";
import LoginModal from "@/components/global/login/Login";
import MapPanel from "@/components/global/mappanel";
import OfferSection from "@/components/global/offersection";
import VenueFiltersBar from "@/components/global/venuefilterbar";
import VenueTypeSection from "@/components/global/venuetypesection";
import { useState } from "react";
import { venueStyle } from "../styles/VenueStyle";
import { venues } from "../services/VenuService";

export default function Venues() {
    const [
        loginOpen, setLoginOpen
    ] = useState(true);

    return (
        <>
            <LoginModal isOpen={loginOpen} onOpenChange={setLoginOpen} />
            {/* <Header /> */}
            <div className="flex">
                {/* <Sidebar /> */}
                <main className="flex-1">
                    <OfferSection />
                    <EventTypeFilter />
                    <VenueTypeSection />
                    <VenueFiltersBar />
                    {/* venues are listed below */}
                    <div className={venueStyle.listvenuecontainer}>
                        {venues.map((venue) => {
                            return (
                                <Card key={venue.id} venue={venue} />
                            );
                        })}
                    </div>
                </main>
                <MapPanel />
            </div>
        </>
    );
}


// export default page

// import React from 'react'

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
