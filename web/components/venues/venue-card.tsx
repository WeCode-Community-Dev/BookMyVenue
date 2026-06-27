"use client";

import Image from "next/image";
import { MapPin, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { VenueStatusBadge } from "./venue-status-badge";
import { OwnedVenueResponse } from "@/services/venueServices";

export function VenueCard({ venue }: { venue: OwnedVenueResponse }) {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <div className="relative aspect-4/3 w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_R2_APP_URL}/${venue.images?.[0]?.image?.url}`}
          alt={venue.images?.[0]?.image?.altText || ''}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* <div className="absolute top-3 left-3">
          <VenueStatusBadge status={venue.status} />
        </div> */}
      </div>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-semibold text-on-surface">
            {venue.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                aria-label={`Actions for ${venue.name}`}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{venue.address}</span>
        </div>
        {/* <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/40 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
              Spaces
            </span>
            <span className="text-sm font-medium text-on-surface">
              {venue.spaces} Spaces
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
              Bookings
            </span>
            <span className="text-sm font-medium text-on-surface">
              {venue.bookings} Total
            </span>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
