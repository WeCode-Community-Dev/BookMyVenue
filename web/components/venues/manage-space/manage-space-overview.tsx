import type { Space } from "@/lib/data/venues";

import { ManageSpaceActivity } from "./manage-space-activity";
import { ManageSpaceBasicInfo } from "./manage-space-basic-info";
import { ManageSpaceSidebar } from "./manage-space-sidebar";
import { ManageSpaceStatCards } from "./manage-space-stat-cards";

type ManageSpaceOverviewProps = {
  space: Space;
  venueId: string;
};

export function ManageSpaceOverview({ space, venueId }: ManageSpaceOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <ManageSpaceBasicInfo space={space} venueId={venueId} />
        <ManageSpaceStatCards space={space} />
        {/* <ManageSpaceActivity /> */}
      </div>
      <ManageSpaceSidebar space={space} venueId={venueId} />
    </div>
  );
}
