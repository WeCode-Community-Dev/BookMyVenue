"use client";

import { useState } from "react";

import type { OperatingHourRow } from "@/lib/data/space-manage";
import { createDefaultOperatingHours } from "@/lib/data/space-manage";
import type { SpaceBlockedPeriodResponse } from "@/services/venueServices";

import { ManageSpaceAvailabilitySidebar } from "./manage-space-availability-sidebar";
import { ManageSpaceBusinessHours } from "./manage-space-business-hours";
import { ManageSpaceUpcomingBlocks } from "./manage-space-upcoming-blocks";

type ManageSpaceAvailabilityProps = {
  spaceId: string;
};

export function ManageSpaceAvailability({ spaceId }: ManageSpaceAvailabilityProps) {
  const [operatingHours, setOperatingHours] = useState<OperatingHourRow[]>(
    createDefaultOperatingHours(),
  );
  const [blocks, setBlocks] = useState<SpaceBlockedPeriodResponse[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Availability</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Manage when customers can book this space.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <ManageSpaceBusinessHours
            spaceId={spaceId}
            onHoursChange={setOperatingHours}
          />
          <ManageSpaceUpcomingBlocks
            spaceId={spaceId}
            onBlocksChange={setBlocks}
          />
        </div>
        <ManageSpaceAvailabilitySidebar
          operatingHours={operatingHours}
          blocks={blocks}
        />
      </div>
    </div>
  );
}
