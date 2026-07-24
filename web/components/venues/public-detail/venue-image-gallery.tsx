"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { VenueDetails } from "@/lib/data/venues";
import { getImageUrl } from "@/lib/data/venue-detail";
import { cn } from "@/lib/utils";

type VenueImageGalleryProps = {
  venue: VenueDetails;
};

export function VenueImageGallery({ venue }: VenueImageGalleryProps) {
  const images = venue.images;
  const primary = images[0];
  const thumbnails = images.slice(1, 5);

  if (images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-surface-container-low">
        <Camera className="size-10 text-on-surface-variant/40" />
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-[2fr_1fr] sm:grid-rows-2 sm:h-105">
      <div className="relative aspect-4/3 sm:aspect-auto sm:row-span-2 overflow-hidden rounded-xl">
        <Image
          src={getImageUrl(primary.image.url)}
          alt={primary.image.altText || venue.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, 66vw"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:col-start-2 sm:row-span-2">
        {thumbnails.map((img, index) => (
          <div
            key={img.imageId}
            className={cn(
              "relative overflow-hidden rounded-lg",
              index === thumbnails.length - 1 && thumbnails.length === 4 && "relative",
            )}
          >
            <Image
              src={getImageUrl(img.image.url)}
              alt={img.image.altText || venue.name}
              fill
              className="object-cover"
              sizes="200px"
            />
            {index === thumbnails.length - 1 && images.length > 5 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-3 left-3 bg-white/90 hover:bg-white"
                  >
                    View All Photos
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>All Photos</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 sm:grid-cols-2 h-[80vh] overflow-scroll">
                    {images.map((item) => (
                      <div
                        key={item.imageId}
                        className="relative  overflow-hidden rounded-lg"
                      >
                        <Image
                          src={getImageUrl(item.image.url)}
                          alt={item.image.altText || venue.name}
                          fill
                          className="object-cover"
                          sizes="400px"
                        />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ))}
        {thumbnails.length < 4 &&
          Array.from({ length: 4 - thumbnails.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="hidden sm:block rounded-lg bg-surface-container-low"
            />
          ))}
      </div>

      {images.length <= 5 && images.length > 1 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="sm:absolute sm:bottom-6 sm:right-8 sm:z-10 bg-white/90 hover:bg-white"
            >
              View All Photos
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>All Photos</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              {images.map((item) => (
                <div
                  key={item.imageId}
                  className="relative aspect-4/3 overflow-hidden rounded-lg"
                >
                  <Image
                    src={getImageUrl(item.image.url)}
                    alt={item.image.altText || venue.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
