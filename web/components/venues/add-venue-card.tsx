import Link from "next/link";
import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function AddVenueCard() {
  return (
    <Link href="/my-venues/create" className="block h-full">
      <Card className="h-full gap-0 rounded-lg border-2 border-dashed border-outline-variant/60 bg-transparent py-0 shadow-none ring-0 transition-colors hover:border-surface-tint/50 hover:bg-surface-container-low/50">
        <CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-3 p-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-surface-container-low">
            <Plus className="size-6 text-surface-tint" />
          </div>
          <p className="text-sm font-medium text-on-surface-variant">
            Add a new property
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
