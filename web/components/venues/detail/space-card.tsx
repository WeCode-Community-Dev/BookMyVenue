"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  MoreVertical,
  Pencil,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Space } from "@/lib/data/venues";
import {
  formatCapacity,
  getCapacityIcon,
  getImageUrl,
  getSpaceCoverImage,
  getSpaceDisplayStatus,
} from "@/lib/data/venue-detail";

import { SpaceStatusBadge } from "./space-status-badge";

type SpaceCardProps = {
  space: Space;
  venueId: string;
};

export function SpaceCard({ space, venueId }: SpaceCardProps) {
  const coverImage = getSpaceCoverImage(space);
  const status = getSpaceDisplayStatus(space);
  const photoCount = space.images.length;
  const amenityCount = space.amenities.length;
  const CapacityIcon = getCapacityIcon(space.capacityType);

  return (
    <Card className="gap-0 overflow-hidden rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <div className="relative aspect-4/3 w-full">
        {coverImage ? (
          <Image
            src={getImageUrl(coverImage.image.url)}
            alt={coverImage.image.altText || space.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-low">
            <Camera className="size-8 text-on-surface-variant/40" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge
            variant="outline"
            className="gap-1 border-transparent bg-black/60 text-white backdrop-blur-sm"
          >
            <CapacityIcon className="size-3" />
            {formatCapacity(space)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <SpaceStatusBadge status={status} />
        </div>
      </div>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[10px] font-semibold tracking-wider text-surface-tint uppercase">
              {space.category.name}
            </p>
            <h3 className="truncate text-base font-semibold text-on-surface">
              {space.name}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                aria-label={`Actions for ${space.name}`}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/my-venues/${venueId}/spaces/${space.id}/edit`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/my-venues/${venueId}/spaces/${space.id}/manage`}>
                  Manage
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Camera className="size-3.5" />
            {photoCount} Photos
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            {amenityCount} Amenities
          </span>
        </div>
        <div className="flex items-center gap-2 border-t border-outline-variant/40 pt-3">
          <Button variant="secondary" size="sm" className="flex-1 gap-1.5" asChild>
            <Link href={`/my-venues/${venueId}/spaces/${space.id}/edit`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
          <Button variant="secondary" size="sm" className="flex-1 gap-1.5" asChild>
            <Link href={`/my-venues/${venueId}/spaces/${space.id}/manage`}>
              <Settings className="size-3.5" />
              Manage
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label={`Delete ${space.name}`}
            onClick={() => console.log("Delete space:", space.id)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
