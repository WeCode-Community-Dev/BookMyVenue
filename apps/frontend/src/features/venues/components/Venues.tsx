"use client";

import { selectAuthLoading, selectIsAuthenticated, selectJustLoggedOut } from "@/features/auth/AuthSlice";
import { useCallback, useEffect, useRef, useState } from "react";

import { AppText } from "@/lib/language/LanguageHelper";
import Card from "@/components/global/card/Card";
import EventTypeFilter from "@/components/global/EventTypeFilter";
import LoginModal from "@/components/global/login/Login";
import MapPanel from "@/components/global/MapPanel";
import OfferSection from "@/components/global/OfferSection";
import { Venue } from "@/types/Venue";
import VenueFiltersBar from "@/components/global/VenueFilterBar";
import VenueTypeSection from "@/components/global/VenueTypeSection";
import VerifyBooking from "@/components/global/booking/VerifyBooking";
import { fetchVenues } from "../services/VenuService";
import { useSelector } from "react-redux";
import { venueStyle } from "../styles/VenueStyle";

export default function Venues() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const justLoggedOut = useSelector(selectJustLoggedOut);
    const limit = 5;

    const loaderRef = useRef<HTMLDivElement | null>(null);
    // Guards against overlapping/duplicate fetches, independent of React's render timing
    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const pageRef = useRef(1);

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
        loadingMore, setLoadingMore
    ] = useState(false);

    const [
        hasMore, setHasMore
    ] = useState(true);

    const [
        error, setError
    ] = useState<string | null>(null);

    const [
        selectedVenue, setSelectedVenue
    ] = useState<Venue | null>(null);

    const [
        bookingOpen, setBookingOpen
    ] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated && !justLoggedOut) {
            setLoginOpen(true);
        } else if (isAuthenticated) {
            setLoginOpen(false);
        }
    }, [
        isAuthenticated, loading, justLoggedOut
    ]);

    // Keep refs in sync so the observer callback always reads fresh values
    // without needing to be recreated on every state change.
    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [
        hasMore
    ]);

    const loadPage = useCallback(async (pageToLoad: number) => {
        // hard guard: never allow overlap
        if (isFetchingRef.current) return; 
        isFetchingRef.current = true;

        if (pageToLoad === 1) {
            setLoadingVenues(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        try {
            const response = await fetchVenues(pageToLoad, limit);

            if (response.length === 0) {
                setHasMore(false);
                hasMoreRef.current = false;
            } else {
                setVenuesList((prev) => {
                    if (pageToLoad === 1) return response;
                    return [
                        ...prev, ...response
                    ];
                });
                pageRef.current = pageToLoad;
            }
        } catch (apiErr: any) {
            setError(apiErr.message || "Failed to load venues.");
        } finally {
            if (pageToLoad === 1) {
                setLoadingVenues(false);
            } else {
                setLoadingMore(false);
            }
            isFetchingRef.current = false;
        }
    }, [
        limit
    ]);

    // Initial load
    useEffect(() => {
        loadPage(1);

    }, [
    ]);

    // Observer created ONCE. Reads live state via refs, so no stale
    // closures and no re-creation churn that causes re-firing.
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[ 0 ].isIntersecting &&
                    hasMoreRef.current &&
                    !isFetchingRef.current
                ) {
                    const nextPage = pageRef.current + 1;
                    loadPage(nextPage);
                }
            },
            // start loading slightly before it's in view
            { rootMargin: "200px" } 
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            return observer.disconnect();
        };
    }, [
        loadPage
    ]);

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
            <div className={venueStyle.flexContainer}>
                <main className={venueStyle.mainSection}>
                    <OfferSection />
                    <EventTypeFilter />
                    <VenueTypeSection />
                    <VenueFiltersBar />
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
                                        <AppText
                                            textName="ERROR_LOADING_VENUES"
                                            textModule="MESSAGES"
                                            append={{ error }}
                                        />
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
                        <div ref={loaderRef}>
                            {loadingMore && (
                                <div className={venueStyle.loadingText}>Loading more venues...</div>
                            )}
                        </div>
                    </div>
                </main>
                <MapPanel />
            </div>
        </>
    );
}
