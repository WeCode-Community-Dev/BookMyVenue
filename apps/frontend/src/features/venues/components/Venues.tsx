"use client";

import Card, { Venue } from "@/components/global/card/Card";

import EventTypeFilter from "@/components/global/eventtypefilter";
import LoginModal from "@/components/global/login/Login";
import MapPanel from "@/components/global/mappanel";
import OfferSection from "@/components/global/offersection";
import VenueFiltersBar from "@/components/global/venuefilterbar";
import VenueTypeSection from "@/components/global/venuetypesection";
import VerifyBooking from "@/components/global/booking/VerifyBooking";
import { useState, useEffect } from "react";
import { venueStyle } from "../styles/VenueStyle";
import { venues } from "../services/VenuService";

import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectAuthLoading, selectJustLoggedOut } from "@/features/auth/AuthSlice";

export default function Venues() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const justLoggedOut = useSelector(selectJustLoggedOut);

    const [
        loginOpen, setLoginOpen
    ] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated && !justLoggedOut) {
            setLoginOpen(true);
        } else if (isAuthenticated) {
            setLoginOpen(false);
        }
    }, [isAuthenticated, loading, justLoggedOut]);

    const [
        selectedVenue, setSelectedVenue
    ] = useState<Venue | null>(null);

    const [
        bookingOpen, setBookingOpen
    ] = useState(false);

    return (
        <>
            <LoginModal isOpen={loginOpen} onOpenChange={setLoginOpen} />
            <VerifyBooking
                isOpen={bookingOpen}
                onClose={() => {
                    return setBookingOpen(false);
                }}
                venue={selectedVenue}
                actionType="pay"
            />
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
                                <Card
                                    key={venue.id}
                                    venue={venue}
                                    onViewDetails={(venueInfo) => {
                                        setSelectedVenue(venueInfo);
                                        setBookingOpen(true);
                                    }}
                                />
                            );
                        })}
                    </div>
                </main>
                <MapPanel />
            </div>
        </>
    );
}
