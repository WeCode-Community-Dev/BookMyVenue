"use client";

import Image from "next/image";
import { Camera, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Space } from "@/lib/data/venues";
import {
  getImageUrl,
  getSpaceCoverImage,
} from "@/lib/data/venue-detail";
import {
  formatSpaceArea,
  formatSpaceCapacity,
} from "@/lib/data/public-venue-detail";
import { cn } from "@/lib/utils";

type PublicSpaceListProps = {
  spaces: Space[];
  selectedSpaceId: string | null;
  onSelectSpace: (spaceId: string) => void;
};

export function PublicSpaceList({
  spaces,
  selectedSpaceId,
  onSelectSpace,
}: PublicSpaceListProps) {
  if (spaces.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-on-surface">Available Spaces</h2>
      <div className="flex flex-col gap-4">
        {spaces.map((space) => {
          const cover = getSpaceCoverImage(space);
          const capacity = formatSpaceCapacity(space);
          const area = formatSpaceArea(space);
          // const hourlyPrice = getSpaceHourlyPrice(space.id);
          const isSelected = selectedSpaceId === space.id;

          return (
            <Card
              key={space.id}
              className={cn(
                "flex flex-col gap-0 overflow-hidden rounded-lg border py-0 sm:flex-row",
                isSelected
                  ? "border-surface-tint ring-1 ring-surface-tint"
                  : "border-outline-variant/40",
              )}
            >
              <div className="relative aspect-4/3 w-full shrink-0 sm:w-48 sm:aspect-auto sm:min-h-[160px]">
                {cover ? (
                  <Image
                    src={getImageUrl(cover.image.url)}
                    alt={cover.image.altText || space.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="flex h-full min-h-40 items-center justify-center bg-surface-container-low">
                    <Camera className="size-8 text-on-surface-variant/40" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 min-w-0">
                  <h3 className="font-semibold text-on-surface">{space.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
                    {capacity && (
                      <span className="flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        {capacity}
                      </span>
                    )}
                    {area && <span>{area}</span>}
                  </div>
                  {space.description && (
                    <p className="text-sm text-on-surface-variant line-clamp-2">
                      {space.description}
                    </p>
                  )}
                  {/* <p className="text-sm font-semibold text-on-surface">
                    From ${hourlyPrice}/hr
                  </p> */}
                </div>
                <Button
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "shrink-0",
                    isSelected && "bg-surface-tint hover:bg-surface-tint/90",
                  )}
                  onClick={() => onSelectSpace(space.id)}
                >
                  {isSelected ? "Selected" : "Select Space"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
