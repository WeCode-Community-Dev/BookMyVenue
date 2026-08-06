import Link from "next/link";

import { CreateSpaceForm } from "@/components/venues/create-space/create-space-form";
import { getVenue } from "@/services/venueServices";

export default async function CreateSpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const venue = await getVenue(id);

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href={`/my-venues/${id}`}
          className="text-sm text-surface-tint hover:underline"
        >
          &larr; Back to venue
        </Link>
        <div>
          <h1 className="text-headline-md font-semibold text-on-surface">
            Add New Space
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Define a specific area or room within {venue.name} to begin accepting
            bookings.
          </p>
        </div>
      </div>
      <CreateSpaceForm venueId={id} />
    </div>
  );
}
