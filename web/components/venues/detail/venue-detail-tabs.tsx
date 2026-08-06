import { Card, CardContent } from "@/components/ui/card";
import { VENUE_DETAIL_TABS, type VenueDetailTab } from "@/lib/data/venue-detail";
import { cn } from "@/lib/utils";

type VenueDetailTabsProps = {
  activeTab: VenueDetailTab;
  onTabChange: (tab: VenueDetailTab) => void;
};

export function VenueDetailTabs({ activeTab, onTabChange }: VenueDetailTabsProps) {
  return (
    <div className="border-b border-outline-variant/40">
      <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Venue sections">
        {VENUE_DETAIL_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-surface-tint text-surface-tint"
                  : "border-transparent text-on-surface-variant hover:border-outline-variant hover:text-on-surface",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function VenueTabPlaceholder({ tabLabel }: { tabLabel: string }) {
  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-lg font-semibold text-on-surface">{tabLabel}</p>
        <p className="text-sm text-on-surface-variant">Coming soon</p>
      </CardContent>
    </Card>
  );
}
