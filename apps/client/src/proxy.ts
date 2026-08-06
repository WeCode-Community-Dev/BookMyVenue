import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { CustomJwtSessionClaims } from "@bookmyvenue/types";

const isProtectedRoute = createRouteMatcher(["/bookings(.*)", "/owner(.*)", "/venues/(.*)/book(.*)"]);
const isOwnerRoute = createRouteMatcher(["/owner(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    if (isProtectedRoute(req) && !userId) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isOwnerRoute(req)) {
        const role = (sessionClaims as CustomJwtSessionClaims).metadata?.role;

        if (role !== "OWNER") {
            return NextResponse.redirect(new URL("/", req.url)); // or a 403 page
        }
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
        "/__clerk/(.*)",
    ],
};
