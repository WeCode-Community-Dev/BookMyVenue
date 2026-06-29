import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Read cookies set by BFF proxy
  const hasRefreshToken = req.cookies.has("bmv_refresh_token");
  const userRole = req.cookies.get("bmv_user_role")?.value;

  // Define public sub-routes that should not be blocked/redirected
  const publicPaths = [
    "/customer/register",
    "/partner/login",
    "/partner/register",
    "/partner" // The public partner landing/marketing page
  ];
  
  if (publicPaths.some(path => pathname === path)) {
    return NextResponse.next();
  }

  // 1. Protect Customer & Booking routes (must be logged in as 'customer')
  const isCustomerRoute = pathname.startsWith("/customer") || pathname.startsWith("/booking");
  if (isCustomerRoute) {
    if (!hasRefreshToken || userRole !== "customer") {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = `returnUrl=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Partner routes (must be logged in as 'venue_owner')
  const isPartnerRoute = pathname.startsWith("/partner");
  if (isPartnerRoute) {
    if (!hasRefreshToken || userRole !== "venue_owner") {
      const partnerLoginUrl = req.nextUrl.clone();
      partnerLoginUrl.pathname = "/partner/login";
      partnerLoginUrl.search = `returnUrl=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
      return NextResponse.redirect(partnerLoginUrl);
    }
  }

  return NextResponse.next();
}

// Next.js Middleware Matcher configuration
export const config = {
  matcher: [
    "/customer/:path*",
    "/partner/:path*",
    "/booking/:path*"
  ],
};
