import {
  CalendarClock,
  CalendarDays,
  Images,
  LayoutGrid,
  Settings,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";

import {
  SPACE_MANAGE_TABS,
  type SpaceManageTab,
  type SpaceManageTabIcon,
} from "@/lib/data/space-manage";
import { cn } from "@/lib/utils";

const tabIcons: Record<SpaceManageTabIcon, LucideIcon> = {
  "layout-grid": LayoutGrid,
  "calendar-clock": CalendarClock,
  tag: Tag,
  sparkles: Sparkles,
  images: Images,
  "calendar-days": CalendarDays,
  settings: Settings,
};

type ManageSpaceTabsProps = {
  activeTab: SpaceManageTab;
  onTabChange: (tab: SpaceManageTab) => void;
};

export function ManageSpaceTabs({ activeTab, onTabChange }: ManageSpaceTabsProps) {
  return (
    <div className="border-b border-outline-variant/40">
      <nav
        className="-mb-px flex gap-1 overflow-x-auto"
        aria-label="Space sections"
      >
        {SPACE_MANAGE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tabIcons[tab.icon];

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-surface-tint text-surface-tint"
                  : "border-transparent text-on-surface-variant hover:border-outline-variant hover:text-on-surface",
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
