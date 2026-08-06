import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AddSpaceCardProps = {
  venueId: string;
};

export function AddSpaceCard({ venueId }: AddSpaceCardProps) {
  return (
    <Card className="h-full gap-0 rounded-lg border-2 border-dashed border-outline-variant/60 bg-transparent py-0 shadow-none ring-0">
      <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-surface-tint/10">
          <Plus className="size-7 text-surface-tint" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-on-surface">Add New Space</p>
          <p className="max-w-[220px] text-sm text-on-surface-variant">
            Expand your venue by adding another bookable area.
          </p>
        </div>
        <Button variant="outline" className="border-surface-tint text-surface-tint" asChild>
          <Link href={`/my-venues/${venueId}/spaces/create`}>Start Setup</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
