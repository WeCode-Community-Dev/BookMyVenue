import Link from "next/link";
import { ArrowLeft, Eye, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SpaceStatusBadge } from "@/components/venues/detail/space-status-badge";
import type { Space } from "@/lib/data/venues";
import { getSpaceDisplayStatus } from "@/lib/data/venue-detail";

type ManageSpaceHeaderProps = {
  space: Space;
  venueId: string;
};

export function ManageSpaceHeader({ space, venueId }: ManageSpaceHeaderProps) {
  const status = getSpaceDisplayStatus(space);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={`/my-venues/${venueId}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-surface-tint hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to Spaces
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-on-surface sm:text-3xl">
              {space.name}
            </h1>
            <SpaceStatusBadge status={status} />
          </div>
          <p className="text-sm text-on-surface-variant">
            Manage all settings for this space.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href={`/my-venues/${venueId}`}>
              <Eye className="size-3.5" />
              Preview Space
            </Link>
          </Button>
          <Button size="sm" className="gap-1.5 bg-surface-tint text-on-primary hover:bg-surface-tint/90">
            <Upload className="size-3.5" />
            Publish Updates
          </Button>
        </div>
      </div>
    </div>
  );
}
