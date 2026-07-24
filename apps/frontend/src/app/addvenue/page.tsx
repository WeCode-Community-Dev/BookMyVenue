"use client";

import { selectAuthLoading, selectIsAuthenticated } from "@/features/auth/AuthSlice";

import AddVenue from "@/features/venues/components/AddVenue";
import { SCREENS } from "@/lib/Constants";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const AddVenuePage = () => {
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
        return null;
    }

    return <AddVenue />;
};

export default AddVenuePage;
