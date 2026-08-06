"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Space, VenueDetails } from "@/lib/data/venues";
import {
  formatPricingAmount,
  getDefaultPricingType,
  getPricingTypeLabel,
  getPricingUnitLabel,
  sortPricingRecordsByPriority,
} from "@/lib/data/public-venue-detail";
import { cn } from "@/lib/utils";
import {
  getSpacePricing,
  type PricingType,
  type SpacePricingResponse,
} from "@/services/venueServices";

type VenueBookingSidebarProps = {
  venue: VenueDetails;
  selectedSpace: Space | null;
};

export function VenueBookingSidebar({
  venue,
  selectedSpace,
}: VenueBookingSidebarProps) {
  const [pricingRecords, setPricingRecords] = useState<SpacePricingResponse[]>(
    [],
  );
  const [selectedPricingType, setSelectedPricingType] =
    useState<PricingType | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSpace) {
      setPricingRecords([]);
      setPricingError(null);
      setSelectedPricingType(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsPricingLoading(true);
      setPricingError(null);
      try {
        const records = await getSpacePricing(selectedSpace.id);
        if (!cancelled) {
          setPricingRecords(records);
          setSelectedPricingType(getDefaultPricingType(records));
        }
      } catch {
        if (!cancelled) setPricingError("Unable to load pricing.");
      } finally {
        if (!cancelled) setIsPricingLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedSpace]);

  const sortedPricingRecords = useMemo(
    () => sortPricingRecordsByPriority(pricingRecords),
    [pricingRecords],
  );

  const selectedPricing = useMemo(
    () =>
      pricingRecords.find(
        (record) => record.pricingType === selectedPricingType,
      ) ?? null,
    [pricingRecords, selectedPricingType],
  );

  const bookHref =
    selectedSpace && selectedPricingType
      ? `/venues/${venue.id}/spaces/${selectedSpace.id}/book?pricingType=${selectedPricingType}`
      : selectedSpace
        ? `/venues/${venue.id}/spaces/${selectedSpace.id}/book`
        : undefined;

  return (
    <Card className="sticky top-24 gap-0 overflow-hidden rounded-xl border border-outline-variant/40 py-0 shadow-elevation-2">
      <CardContent className="flex flex-col gap-5 p-5">
        {selectedSpace && (
          <>
            {isPricingLoading ? (
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Loader2 className="size-4 animate-spin" />
                Loading pricing…
              </div>
            ) : pricingError || sortedPricingRecords.length === 0 ? (
              <p className="text-sm text-on-surface-variant">
                Pricing unavailable
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-1 rounded-lg bg-surface-container-low p-1">
                  {sortedPricingRecords.map((record) => (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() =>
                        setSelectedPricingType(record.pricingType)
                      }
                      className={cn(
                        "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                        selectedPricingType === record.pricingType
                          ? "bg-background text-on-surface shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface",
                      )}
                    >
                      {getPricingTypeLabel(record.pricingType)}
                    </button>
                  ))}
                </div>

                {selectedPricing?.pricingType === "CUSTOM" ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-on-surface">
                      Custom quote
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Contact venue for pricing
                    </p>
                  </div>
                ) : selectedPricing ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-on-surface">
                        {formatPricingAmount(
                          selectedPricing.amount,
                          selectedPricing.currency,
                        )}
                      </span>
                      <span className="text-sm text-on-surface-variant">
                        {getPricingUnitLabel(selectedPricing.pricingType)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {selectedPricing.minBooking && (
                        <span className="text-sm text-on-surface-variant">
                          Minimum booking {selectedPricing.pricingType === "HOURLY" ? "hours" : "days"}: {selectedPricing.minBooking}
                        </span>
                      )}
                      {selectedPricing.maxBooking && (
                        <span className="text-sm text-on-surface-variant">
                          Maximum booking {selectedPricing.pricingType === "HOURLY" ? "hours" : "days"}: {selectedPricing.maxBooking}
                        </span>
                      )}
                    </div>
                  </>
                ) : null}
              </>
            )}
          </>
        )}

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

        {/* {breakdown && selectedPricing && (
          <div className="flex flex-col gap-2 border-t border-outline-variant/40 pt-4 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>{breakdown.spaceLine}</span>
              <span>
                {formatPricingAmount(
                  String(breakdown.spaceAmount),
                  selectedPricing.currency,
                )}
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Cleaning fee</span>
              <span>
                {formatPricingAmount(
                  String(breakdown.cleaningFee),
                  selectedPricing.currency,
                )}
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Service fee</span>
              <span>
                {formatPricingAmount(
                  String(breakdown.serviceFee),
                  selectedPricing.currency,
                )}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold text-on-surface">
              <span>Total</span>
              <span>
                {formatPricingAmount(
                  String(breakdown.total),
                  selectedPricing.currency,
                )}
              </span>
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
