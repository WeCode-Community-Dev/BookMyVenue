import { Building2, CheckCircle2, Clock3, XCircle } from 'lucide-react';

import HealthCard from './HealthCard';
import type { VenueHealthProps } from '@/features/dashboard/types/ownerDashbord.types';

export default function VenueHealth({ data }: VenueHealthProps) {
  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
            Venue Insights
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
        </div>

        <h2 className="text-lg font-bold tracking-tight mt-1 text-black dark:text-white leading-none">
          Venue <span className="text-[#e21a47]">Health</span>
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3.5 mt-6">
        <HealthCard
          title="Total"
          value={data.totalVenues}
          icon={<Building2 className="w-3.5 h-3.5" />}
          color="blue"
        />

        <HealthCard
          title="Active"
          value={data.activeVenues}
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          color="green"
        />

        <HealthCard
          title="Pending"
          value={data.pendingVenues}
          icon={<Clock3 className="w-3.5 h-3.5" />}
          color="amber"
        />

        <HealthCard
          title="Rejected"
          value={data.rejectedVenues}
          icon={<XCircle className="w-3.5 h-3.5" />}
          color="red"
        />
      </div>
    </div>
  );
}
