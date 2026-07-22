import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicSiteHeader } from "@/components/landing/public-site-header";
import { PublicVenueDetail } from "@/components/venues/public-detail/public-venue-detail";
import { getVenue } from "@/services/venueServices";

type VenueDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: VenueDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const venue = await getVenue(id);
    return {
      title: `${venue.name} | BookMyVenue`,
      description: venue.description?.slice(0, 160) ?? `Book ${venue.name}`,
    };
  } catch {
    return { title: "Venue | BookMyVenue" };
  }
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = await params;

  let venue;
  try {
    venue = await getVenue(id);
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <PublicSiteHeader />
      <main className="flex flex-1 flex-col">
        <PublicVenueDetail venue={venue} />
      </main>
      {/* <PublicSiteFooter /> */}
    </div>
  );
}
