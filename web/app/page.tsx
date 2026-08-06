import { LandingCategories } from "@/components/landing/landing-categories";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingStats } from "@/components/landing/landing-stats";
import { PublicSiteHeader } from "@/components/landing/public-site-header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <PublicSiteHeader />

      <main className="flex flex-1 flex-col">
        <LandingHero />
        <LandingStats />
        <LandingCategories />
        <LandingHowItWorks />
      </main>
    </div>
  );
}
