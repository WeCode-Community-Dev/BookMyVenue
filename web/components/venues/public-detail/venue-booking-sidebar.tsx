"use client";

import Link from "next/link";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Space } from "@/lib/data/venues";
import {
  computeBookingBreakdown,
  getSpaceHourlyPrice,
  getVenueAverageHourlyPrice,
} from "@/lib/data/public-venue-detail";
import type { VenueDetails } from "@/lib/data/venues";

type VenueBookingSidebarProps = {
  venue: VenueDetails;
  selectedSpace: Space | null;
};

const GUEST_OPTIONS = [5, 10, 25, 50, 100, 150, 250];

export function VenueBookingSidebar({
  venue,
  selectedSpace,
}: VenueBookingSidebarProps) {
  const [date, setDate] = useState("2024-10-05");
  const [guests, setGuests] = useState("10");

  const hourlyRate = selectedSpace
    ? getSpaceHourlyPrice(selectedSpace.id)
    : getVenueAverageHourlyPrice(venue);

  const spaceName = selectedSpace?.name ?? "Selected space";
  const breakdown = computeBookingBreakdown(spaceName, hourlyRate);

  const bookHref = selectedSpace
    ? `/venues/${venue.id}/spaces/${selectedSpace.id}/book?date=${encodeURIComponent(date)}&guests=${guests}`
    : undefined;

  return (
    <Card className="sticky top-24 gap-0 overflow-hidden rounded-xl border border-outline-variant/40 py-0 shadow-elevation-2">
      <CardContent className="flex flex-col gap-5 p-5">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-on-surface">
            ${hourlyRate}
          </span>
          <span className="text-sm text-on-surface-variant">avg/hr</span>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="booking-date">Date</Label>
            <Input
              id="booking-date"
              name="date"
              type="date"
              className="h-10 bg-background"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="booking-time">Time</Label>
            <Input
              id="booking-time"
              type="time"
              className="h-10 bg-background"
              defaultValue="09:00"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Guests</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="h-10 w-full bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GUEST_OPTIONS.map((count) => (
                  <SelectItem key={count} value={String(count)}>
                    {count} Guests
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {bookHref ? (
          <Button
            asChild
            className="h-11 w-full bg-surface-tint hover:bg-surface-tint/90"
          >
            <Link href={bookHref}>Check Availability</Link>
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              disabled
              className="h-11 w-full bg-surface-tint hover:bg-surface-tint/90"
            >
              Check Availability
            </Button>
            <p className="text-xs text-center text-on-surface-variant">
              Select a space below to check availability
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-outline-variant/40 pt-4 text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>{breakdown.spaceLine}</span>
            <span>${breakdown.spaceAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Cleaning fee</span>
            <span>${breakdown.cleaningFee}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Service fee</span>
            <span>${breakdown.serviceFee}</span>
          </div>
          <div className="flex justify-between pt-2 text-base font-bold text-on-surface">
            <span>Total</span>
            <span>${breakdown.total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
