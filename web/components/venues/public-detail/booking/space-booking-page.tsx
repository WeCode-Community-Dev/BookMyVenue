"use client";

import { useEffect, useMemo, useState } from "react";

import type { Space, VenueDetails } from "@/lib/data/venues";
import type { TimeRangeSelection } from "@/lib/data/public-venue-detail";
import { parseDateParam } from "@/lib/data/public-venue-detail";

import { AvailabilityCalendar } from "./availability-calendar";
import { SpaceAboutSection } from "./space-about-section";
import { SpaceAmenitiesPanel } from "./space-amenities-panel";
import { SpaceBookingBreadcrumbs } from "./space-booking-breadcrumbs";
import { SpaceBookingGallery } from "./space-booking-gallery";
import { SpaceBookingHeader } from "./space-booking-header";
import { SpaceBookingSummary } from "./space-booking-summary";
import { TimeRangePicker } from "./time-slot-picker";
import { getSpaceBlockedPeriods, getSpaceOperatingHours, SpaceBlockedPeriodResponse, SpaceOperatingHourResponse } from "@/services/venueServices";

type SpaceBookingPageProps = {
  venue: VenueDetails;
  space: Space;
  initialDate?: string;
  initialGuests?: string;
  initialPricingType?: string;
};

export function SpaceBookingPage({
  venue,
  space,
  initialDate,
  initialPricingType: _initialPricingType,
}: SpaceBookingPageProps) {
  const defaultDate = useMemo(() => {
    const parsed = parseDateParam(initialDate);
    return parsed ?? new Date();
  }, [initialDate]);

  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [viewYear, setViewYear] = useState(defaultDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(defaultDate.getMonth());
  const [selectedRange, setSelectedRange] = useState<TimeRangeSelection | null>(
    null,
  );

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  }

  function handleMonthChange(year: number, month: number) {
    setViewYear(year);
    setViewMonth(month);
  }
  
  const [operatingHours, setOperatingHours] = useState<SpaceOperatingHourResponse[]>([]);
  const [blockedPeriods, setBlockedPeriods] = useState<SpaceBlockedPeriodResponse[]>([]);
  
  useEffect(() => {
    async function loadData() {
      const hours = await getSpaceOperatingHours(space.id);
      const periods = await getSpaceBlockedPeriods(space.id);
  
      setOperatingHours(hours);
      setBlockedPeriods(periods);
    }
  
    loadData();
  }, [space.id]);


  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8">
      <SpaceBookingBreadcrumbs venue={venue} space={space} />

      <SpaceBookingGallery space={space} venue={venue} />

      <SpaceBookingHeader space={space} />

      <div className="grid gap-8 lg:grid-cols-[1fr_300px_340px] lg:items-start">
        <div className="flex flex-col gap-10 min-w-0">
          <SpaceAboutSection space={space} venue={venue} />

          <section className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-on-surface">
              Check Availability
            </h2>
            <AvailabilityCalendar
              operatingHours={operatingHours}
              blockedPeriods={blockedPeriods}
              selectedDate={selectedDate}
              viewYear={viewYear}
              viewMonth={viewMonth}
              onSelectDate={handleSelectDate}
              onMonthChange={handleMonthChange}
            />
            <TimeRangePicker
              selectedDate={selectedDate}
              operatingHours={operatingHours}
              blockedPeriods={blockedPeriods}
              selectedRange={selectedRange}
              onTimeRangeChange={setSelectedRange}
            />
          </section>
        </div>

        <SpaceAmenitiesPanel space={space} venue={venue} />

        <SpaceBookingSummary
          spaceId={space.id}
          selectedDate={selectedDate}
          selectedRange={selectedRange}
        />
      </div>
    </div>
  );
}
