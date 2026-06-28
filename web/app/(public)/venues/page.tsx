import Link from "next/link";

import { Button } from "@/components/ui/button";

type VenuesPageProps = {
  searchParams: Promise<{
    location?: string;
    date?: string;
    occasion?: string;
  }>;
};

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const params = await searchParams;
  const { location, date, occasion } = params;

  const hasFilters = location || date || occasion;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-12 md:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-headline-md font-bold text-on-surface md:text-headline-lg">
          Browse Venues
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Public venue search is coming soon. Your filters have been captured
          below.
        </p>
      </div>

      {hasFilters ? (
        <dl className="flex flex-col gap-3 rounded-lg bg-surface-container-low p-5">
          {location ? (
            <div className="flex flex-col gap-0.5">
              <dt className="text-label-sm font-semibold uppercase tracking-wide text-primary">
                Location
              </dt>
              <dd className="text-body-md text-on-surface">{location}</dd>
            </div>
          ) : null}
          {date ? (
            <div className="flex flex-col gap-0.5">
              <dt className="text-label-sm font-semibold uppercase tracking-wide text-primary">
                Date
              </dt>
              <dd className="text-body-md text-on-surface">{date}</dd>
            </div>
          ) : null}
          {occasion ? (
            <div className="flex flex-col gap-0.5">
              <dt className="text-label-sm font-semibold uppercase tracking-wide text-primary">
                Occasion
              </dt>
              <dd className="text-body-md text-on-surface">{occasion}</dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <p className="text-body-sm text-on-surface-variant">
          Use the search bar on the home page to filter venues by location, date,
          and occasion.
        </p>
      )}

      <Button asChild variant="outline" className="w-fit">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
