import Image from "next/image";
import Link from "next/link";
import { Archive, Camera, Eye, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Space } from "@/lib/data/venues";
import {
  formatRelativeUpdatedAt,
  formatSpaceCapacityLabel,
  getSpaceDisplayCode,
  spaceManageSupport,
} from "@/lib/data/space-manage";
import {
  getImageUrl,
  getSpaceCoverImage,
} from "@/lib/data/venue-detail";
import { cn } from "@/lib/utils";

type ManageSpaceSidebarProps = {
  space: Space;
  venueId: string;
};

export function ManageSpaceSidebar({ space, venueId }: ManageSpaceSidebarProps) {
  const coverImage = getSpaceCoverImage(space);
  const displayCode = getSpaceDisplayCode(space.id);
  const capacity = formatSpaceCapacityLabel(
    space.capacityValue,
    space.capacityType,
  );

  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-0 overflow-hidden rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
        <div className="relative aspect-video w-full">
          {coverImage ? (
            <Image
              src={getImageUrl(coverImage.image.url)}
              alt={coverImage.image.altText || space.name}
              fill
              className="object-cover"
              sizes="320px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-container-low">
              <Camera className="size-8 text-on-surface-variant/40" />
            </div>
          )}
          <Badge
            variant="outline"
            className="absolute top-3 right-3 border-transparent bg-black/60 text-white backdrop-blur-sm"
          >
            ID: {displayCode}
          </Badge>
        </div>
        <CardContent className="flex flex-col gap-3 p-5">
          <h3 className="text-lg font-semibold text-on-surface">{space.name}</h3>
          <dl className="flex flex-col gap-2 text-sm">
            <PreviewRow label="Category" value={space.category.name} />
            <PreviewRow label="Capacity" value={capacity} />
            <PreviewRow
              label="Status"
              value={space.isActive ? "Active" : "Inactive"}
              valueClassName={space.isActive ? "text-emerald-600" : undefined}
            />
            <PreviewRow
              label="Last Updated"
              value={formatRelativeUpdatedAt(space.updatedAt)}
            />
          </dl>
        </CardContent>
      </Card>

      <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
        <CardHeader className="px-5 pt-5 pb-0">
          <CardTitle className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 px-4 pt-3 pb-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link href={`/my-venues/${venueId}`}>
              <Eye className="size-4" />
              Preview Space
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Share2 className="size-4" />
            Share Space
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          >
            <Archive className="size-4" />
            Archive Space
          </Button>
        </CardContent>
      </Card>

      <div className="relative overflow-hidden rounded-lg bg-surface-tint px-5 py-6 text-white">
        <span
          className="pointer-events-none absolute -right-4 -bottom-4 text-[120px] font-bold leading-none text-white/10 select-none"
          aria-hidden="true"
        >
          ?
        </span>
        <div className="relative flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{spaceManageSupport.title}</h3>
          <p className="text-sm text-white/80">{spaceManageSupport.description}</p>
          <Button
            variant="secondary"
            size="sm"
            className="w-fit bg-white/20 text-white hover:bg-white/30 hover:text-white"
          >
            {spaceManageSupport.ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className={cn("font-medium text-on-surface", valueClassName)}>
        {value}
      </dd>
    </div>
  );
}
