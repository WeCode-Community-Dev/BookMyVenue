"use client";

import { useState } from "react";
import { Calendar, Clock, Info, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TimeRangeSelection } from "@/lib/data/public-venue-detail";
import {
  computeSpaceBookingTotal,
  formatDisplayDate,
  formatTimeRangeLabel,
  getSpaceHourlyPrice,
} from "@/lib/data/public-venue-detail";
import {
  getVenueRating,
  getVenueReviewCount,
} from "@/lib/data/venue-detail";
import {
  buildBookingIsoRange,
  createBooking,
} from "@/services/bookingServices";

type SpaceBookingSummaryProps = {
  spaceId: string;
  selectedDate: Date;
  selectedRange: TimeRangeSelection | null;
  onBookingCreated?: () => void | Promise<void>;
};

export function SpaceBookingSummary({
  spaceId,
  selectedDate,
  selectedRange,
  onBookingCreated,
}: SpaceBookingSummaryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hourlyRate = getSpaceHourlyPrice(spaceId);
  const rating = getVenueRating();
  const reviewCount = getVenueReviewCount();
  const breakdown = selectedRange
    ? computeSpaceBookingTotal(hourlyRate, selectedRange.hours)
    : null;

  async function handleContinueBooking() {
    if (!selectedRange) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { startAt, endAt } = buildBookingIsoRange(selectedDate, selectedRange);
      const result = await createBooking({
        spaceId,
        startAt,
        endAt,
        pricingType: "HOURLY",
      });

      const statusMessage =
        result.data.status === "CONFIRMED"
          ? "confirmed"
          : "submitted for approval";

      toast.success(`Booking ${result.data.bookingNumber} ${statusMessage}`);
      await onBookingCreated?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create booking",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="sticky top-24 gap-0 overflow-hidden rounded-xl border border-outline-variant/40 py-0 shadow-elevation-2">
      <CardContent className="flex flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-on-surface">
              ${hourlyRate}
            </span>
            <span className="text-sm text-on-surface-variant">/ hour</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-on-surface">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {rating} ({reviewCount})
          </span>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
              Selected Date
            </span>
            <span className="flex items-center gap-2 text-sm font-medium text-on-surface">
              <Calendar className="size-4 text-surface-tint" />
              {formatDisplayDate(selectedDate)}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
              Time Slot
            </span>
            <span className="flex items-center gap-2 text-sm font-medium text-on-surface">
              <Clock className="size-4 text-surface-tint" />
              {selectedRange
                ? formatTimeRangeLabel(selectedRange)
                : "Select a time range"}
            </span>
          </div>
        </div>

        {breakdown ? (
          <div className="flex flex-col gap-2 border-t border-outline-variant/40 pt-4 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>{breakdown.subtotalLine}</span>
              <span>${breakdown.subtotal.toFixed(2)}</span>
            </div>
            {/* <div className="flex justify-between text-on-surface-variant">
              <span>Service fee</span>
              <span>${breakdown.serviceFee.toFixed(2)}</span>
            </div> */}
            <div className="flex justify-between pt-2 text-lg font-bold text-on-surface">
              <span>Total</span>
              <span>${breakdown.subtotal.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="border-t border-outline-variant/40 pt-4 text-sm text-on-surface-variant">
            Choose a start and end time to see pricing.
          </p>
        )}

        <Button
          type="button"
          className="h-11 w-full bg-surface-tint hover:bg-surface-tint/90"
          disabled={!selectedRange || isSubmitting}
          onClick={handleContinueBooking}
        >
          {isSubmitting ? "Booking..." : "Continue Booking"}
        </Button>

        <p className="text-center text-xs text-on-surface-variant">
          You won&apos;t be charged yet
        </p>

        <div className="flex gap-3 rounded-lg bg-surface-container-low p-3 text-xs text-on-surface-variant leading-relaxed">
          <Info className="size-4 shrink-0 text-surface-tint mt-0.5" />
          <span>
            Free cancellation up to 48 hours before the event start time.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
