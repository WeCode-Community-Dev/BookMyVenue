import { Suspense } from "react";

import { PublicSiteHeader } from "@/components/landing/public-site-header";
import { VenuesBrowse } from "@/components/venues/browse/venues-browse";
import {
  fetchAmenities,
  getSpaceCategories,
  getVenues,
} from "@/services/venueServices";

type VenuesPageProps = {
  searchParams: Promise<{
    location?: string;
    date?: string;
    occasion?: string;
    category?: string;
    amenities?: string;
    minCapacity?: string;
    maxCapacity?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    view?: string;
  }>;
};

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const params = await searchParams;

  const venues = await getVenues();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <PublicSiteHeader />
      <main className="flex flex-1 flex-col">
        <Suspense
          fallback={
            <div className="mx-auto flex w-full max-w-6xl px-4 py-8 md:px-8">
              <p className="text-body-md text-on-surface-variant">
                Loading venues...
              </p>
            </div>
          }
        >
          <VenuesBrowse
            venues={venues}
          />
        </Suspense>
      </main>
    </div>
  );
}
