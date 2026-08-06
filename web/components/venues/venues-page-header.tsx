import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VenuesPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline-md font-semibold text-on-surface">
          My Venues
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Manage and track your venue properties.
        </p>
      </div>
      <Button className="h-10 gap-2 shrink-0" asChild>
        <Link href="/my-venues/create">
          <Plus className="size-4" />
          Create Venue
        </Link>
      </Button>
    </div>
  );
}
