"use client";

import { Loader2 } from "lucide-react";

import { useFetch } from "@/hooks/useFetch";
import { VENUE_DETAIL_TABS, type VenueDetailTab } from "@/lib/data/venue-detail";
import { getVenue } from "@/services/venueServices";
import { useState } from "react";

import { VenueDetailHeader } from "./venue-detail-header";
import { VenueDetailTabs, VenueTabPlaceholder } from "./venue-detail-tabs";
import { VenueSpacesTab } from "./venue-spaces-tab";

type VenueDetailPageProps = {
  venueId: string;
};

export function VenueDetailPage({ venueId }: VenueDetailPageProps) {
  const [activeTab, setActiveTab] = useState<VenueDetailTab>("spaces");
  const { data: venue, isLoading, error } = useFetch(() => getVenue(venueId));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-10 animate-spin text-surface-tint" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">
          {error?.message ?? "Failed to load venue details."}
        </p>
      </div>
    );
  }

  const activeTabLabel =
    VENUE_DETAIL_TABS.find((tab) => tab.id === activeTab)?.label ?? activeTab;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <VenueDetailHeader venue={venue} />
      <VenueDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "spaces" ? (
        <VenueSpacesTab venue={venue} />
      ) : (
        <VenueTabPlaceholder tabLabel={activeTabLabel} />
      )}
    </div>
  );
}
