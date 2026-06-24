import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { CustomJwtSessionClaims } from "@bookmyvenue/types";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)"]);

export default clerkMiddleware(async (auth, request) => {
    if (isPublicRoute(request)) return;

    const { userId, sessionClaims, redirectToSignIn } = await auth();

    if (!userId) {
        return redirectToSignIn();
    }
    
    const role = (sessionClaims as CustomJwtSessionClaims).metadata?.role;
    if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
        "/__clerk/(.*)",
    ],
};
