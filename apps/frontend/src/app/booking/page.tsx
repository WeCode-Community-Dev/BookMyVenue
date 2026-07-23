"use client";

import { Suspense, useEffect } from "react";
import { selectAuthLoading, selectIsAuthenticated } from "@/features/auth/AuthSlice";

import { AppText } from "@/lib/language/LanguageHelper";
import BookingLayout from "@/features/bookings/BookingLayout";
import { SCREENS } from "@/lib/Constants";
import { bookingPageStyle } from "@/features/booking/styles/BookingPageStyle";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Page = () => {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace(SCREENS.VENUES);
        }
    }, [
        loading, isAuthenticated, router
    ]);

    if (loading || !isAuthenticated) {
        return (
            <main className={bookingPageStyle.pageWrapper}>
                <div className={bookingPageStyle.container}>
                    <div className={bookingPageStyle.spinner} />
                    <p className={bookingPageStyle.text}>
                        <AppText textName="CHECKING_AUTHENTICATION" textModule="MESSAGES" />
                    </p>
                </div>
            </main>
        );
    }

    return (
        <Suspense fallback={
            <main className={bookingPageStyle.pageWrapper}>
                <div className={bookingPageStyle.container}>
                    <div className={bookingPageStyle.spinner} />
                    <p className={bookingPageStyle.text}>
                        <AppText textName="LOADING_BOOKING" textModule="MESSAGES" />
                    </p>
                </div>
            </main>
        }>
            <BookingLayout />
        </Suspense>
    );
};

export default Page;
