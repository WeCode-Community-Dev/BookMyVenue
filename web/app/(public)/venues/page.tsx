import { Suspense } from "react";

import { PublicSiteHeader } from "@/components/landing/public-site-header";
import { VenuesBrowse } from "@/components/venues/browse/venues-browse";
import {
  getVenues,
  VENUES_PAGE_LIMIT,
} from "@/services/venueServices";

type VenuesPageProps = {
  searchParams: Promise<{
    location?: string;
    date?: string;
    occasion?: string;
    category?: string;
    amenityIds?: string;
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
  const {page=1, amenityIds} = await searchParams;
  

  const { venues, meta } = await getVenues(Number(page), VENUES_PAGE_LIMIT, amenityIds);

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
            meta={meta}
          />
        </Suspense>
      </main>
    </div>
  );
}
