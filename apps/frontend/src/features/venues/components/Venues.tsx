"use client";

import { selectAuthLoading, selectIsAuthenticated, selectJustLoggedOut } from "@/features/auth/AuthSlice";
import { useEffect, useState } from "react";

import { AppText } from "@/lib/language/LanguageHelper";
import Card from "@/components/global/card/Card";
import EventTypeFilter from "@/components/global/EventTypeFilter";
import LoginModal from "@/components/global/login/Login";
import MapPanel from "@/components/global/mappanel";
import OfferSection from "@/components/global/offersection";
import { Venue } from "@/types/Venue";
import VenueFiltersBar from "@/components/global/venuefilterbar";
import VenueTypeSection from "@/components/global/venuetypesection";
import VerifyBooking from "@/components/global/booking/VerifyBooking";
import { fetchVenues } from "../services/VenuService";
import { useSelector } from "react-redux";
import { venueStyle } from "../styles/VenueStyle";

export default function Venues() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const justLoggedOut = useSelector(selectJustLoggedOut);

    const [
        loginOpen, setLoginOpen
    ] = useState(false);

    const [
        venuesList, setVenuesList
    ] = useState<Venue[]>([
    ]);

    const [
        loadingVenues, setLoadingVenues
    ] = useState(true);

    const [
        error, setError
    ] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !isAuthenticated && !justLoggedOut) {
            setLoginOpen(true);
        } else if (isAuthenticated) {
            setLoginOpen(false);
        }
    }, [
        isAuthenticated, loading, justLoggedOut
    ]);

    useEffect(() => {
        let active = true;
        const loadVenues = async () => {
            try {
                setLoadingVenues(true);
                setError(null);
                const fetched = await fetchVenues();
                if (active) {
                    setVenuesList(fetched);
                }
            } catch (ApiErr: any) {
                if (active) {
                    setError(ApiErr.message || "Failed to load venues.");
                }
            } finally {
                if (active) {
                    setLoadingVenues(false);
                }
            }
        };
        loadVenues();
        return () => {
            active = false;
        };
    }, [
    ]);

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
            <div className={venueStyle.flexContainer}>
                {/* <Sidebar /> */}
                <main className={venueStyle.mainSection}>
                    <OfferSection />
                    <EventTypeFilter />
                    <VenueTypeSection />
                    <VenueFiltersBar />
                    {/* venues are listed below */}
                    <div className={venueStyle.listvenuecontainer}>
                        {loadingVenues
                            ? (
                                <div className={venueStyle.loadingText}>
                                    <AppText textName="LOADING_VENUES" textModule="MESSAGES" />
                                </div>
                            )
                            : error
                                ? (
                                    <div className={venueStyle.errorText}>
                                        <AppText textName="ERROR_LOADING_VENUES" textModule="MESSAGES" 
                                            append={{ error }} />
                                    </div>
                                )
                                : venuesList.length === 0
                                    ? (
                                        <div className={venueStyle.emptyText}>
                                            <AppText textName="NO_VENUES_FOUND" textModule="MESSAGES" />
                                        </div>
                                    )
                                    : (
                                        venuesList.map((venue) => {
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
                                        })
                                    )}
                    </div>
                </main>
                <MapPanel />
            </div>
        </>
    );
}
