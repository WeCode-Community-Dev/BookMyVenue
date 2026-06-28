import { CalendarCheck } from "lucide-react";
import Link from "next/link";

import { LandingCategories } from "@/components/landing/landing-categories";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingStats } from "@/components/landing/landing-stats";
import { Button } from "@/components/ui/button";
import { landingNavLinks } from "@/lib/data/landing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-surface-container-lowest">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-surface-tint">
              <CalendarCheck className="size-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-lg font-bold tracking-tight text-on-surface">
              BookMyVenue
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {landingNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/signup">Signup</Link>
            </Button>

            <Button asChild className="hidden sm:inline-flex">
              <Link href="/signup">List Your Venue</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <LandingHero />
        <LandingStats />
        <LandingCategories />
        <LandingHowItWorks />
      </main>
    </div>
  );
}
