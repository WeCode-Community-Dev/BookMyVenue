import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.js";
import { VenueOwnerLandingInfo } from "../../components/venueOwner/landing/VenueOwnerLandingInfo.jsx";
import { VenueOwnerLoginCard } from "../../components/venueOwner/landing/VenueOwnerLoginCard.jsx";
import { VenueOwnerSignUpCard } from "../../components/venueOwner/landing/VenueOwnerSignUpCard.jsx";

export function VenueOwnerLogin() {
    const [mode, setMode] = useState("login");
    const { user, loading } = useAuth();

    // Wait for the initial token check before deciding what to show, so a hard
    // refresh on /venue-owner doesn't flash the login form before redirecting.
    if (loading) return null;

    // Already logged in as a venue owner — skip the login page.
    if (user?.role === "venueOwner") {
        return <Navigate to="/venue-owner/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-10 px-4 py-10 lg:flex-row lg:gap-16 lg:py-0">
                <VenueOwnerLandingInfo />
                {mode === "login" ? (
                    <VenueOwnerLoginCard onSwitchToSignUp={() => setMode("signup")} />
                ) : (
                    <VenueOwnerSignUpCard onSwitchToLogin={() => setMode("login")} />
                )}
            </div>
        </div>
    );
}