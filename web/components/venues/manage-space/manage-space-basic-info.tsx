import Link from "next/link";
import { Info, Pencil } from "lucide-react";

import { FormSectionCard } from "@/components/venues/create-space/form-section-card";
import { ReviewField } from "@/components/venues/create/review-field";
import type { Space } from "@/lib/data/venues";
import {
  formatSpaceCapacityLabel,
} from "@/lib/data/space-manage";

type ManageSpaceBasicInfoProps = {
  space: Space;
  venueId: string;
};

export function ManageSpaceBasicInfo({ space, venueId }: ManageSpaceBasicInfoProps) {
  const capacity = formatSpaceCapacityLabel(
    space.capacityValue,
    space.capacityType,
  );

  return (
    <FormSectionCard
      title="Basic Information"
      icon={Info}
      headerAction={
        <Link
          href={`/my-venues/${venueId}/spaces/${space.id}/edit`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-tint transition-opacity hover:opacity-80"
        >
          <Pencil className="size-3.5" />
          Edit
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewField label="Space Name" value={space.name} />
          <ReviewField label="Category" value={space.category.name} />
          <ReviewField label="Capacity" value={capacity} />
        </div>
        <ReviewField
          label="Description"
          value={space.description ?? "—"}
        />
      </div>
    </FormSectionCard>
  );
}
