"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { VenueTabPlaceholder } from "@/components/venues/detail/venue-detail-tabs";
import { useFetch } from "@/hooks/useFetch";
import {
  SPACE_MANAGE_TABS,
  type SpaceManageTab,
} from "@/lib/data/space-manage";
import { getSpace } from "@/services/venueServices";

import { ManageSpaceHeader } from "./manage-space-header";
import { ManageSpaceOverview } from "./manage-space-overview";
import { ManageSpaceTabs } from "./manage-space-tabs";
import { ManageSpaceAvailability } from "./manage-space-availability";

type ManageSpacePageProps = {
  venueId: string;
  spaceId: string;
};

export function ManageSpacePage({ venueId, spaceId }: ManageSpacePageProps) {
  const [activeTab, setActiveTab] = useState<SpaceManageTab>("overview");
  const { data: space, isLoading, error } = useFetch(() => getSpace(spaceId));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-10 animate-spin text-surface-tint" />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">
          {error?.message ?? "Failed to load space details."}
        </p>
      </div>
    );
  }

  if (space.venueId !== venueId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">
          This space does not belong to the selected venue.
        </p>
      </div>
    );
  }

  const activeTabLabel =
    SPACE_MANAGE_TABS.find((tab) => tab.id === activeTab)?.label ?? activeTab;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <ManageSpaceHeader space={space} venueId={venueId} />
      <ManageSpaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "overview" ? (
        <ManageSpaceOverview space={space} venueId={venueId} />
      ) : activeTab === "availability" ? (
        <ManageSpaceAvailability spaceId={spaceId} />
      ) : (
        <VenueTabPlaceholder tabLabel={activeTabLabel} />
      )}
    </div>
  );
}
