import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicSiteHeader } from "@/components/landing/public-site-header";
import { SpaceBookingPage } from "@/components/venues/public-detail/booking/space-booking-page";
import { getVenue } from "@/services/venueServices";

type SpaceBookPageProps = {
  params: Promise<{ id: string; spaceId: string }>;
  searchParams: Promise<{ date?: string; guests?: string; pricingType?: string }>;
};

export async function generateMetadata({
  params,
}: SpaceBookPageProps): Promise<Metadata> {
  const { id, spaceId } = await params;
  try {
    const venue = await getVenue(id);
    const space = venue.spaces.find((s) => s.id === spaceId);
    if (!space) return { title: "Book Space | BookMyVenue" };
    return {
      title: `${space.name} at ${venue.name} | BookMyVenue`,
      description: `Book ${space.name} at ${venue.name}`,
    };
  } catch {
    return { title: "Book Space | BookMyVenue" };
  }
}

export default async function SpaceBookPage({
  params,
  searchParams,
}: SpaceBookPageProps) {
  const { id, spaceId } = await params;
  const { date, guests, pricingType } = await searchParams;

  let venue;
  try {
    venue = await getVenue(id);
  } catch {
    notFound();
  }

  const space = venue.spaces.find((s) => s.id === spaceId);
  if (!space) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <PublicSiteHeader />
      <main className="flex flex-1 flex-col">
        <SpaceBookingPage
          venue={venue}
          space={space}
          initialDate={date}
          initialGuests={guests}
          initialPricingType={pricingType}
        />
      </main>
      {/* <PublicSiteFooter /> */}
    </div>
  );
}
