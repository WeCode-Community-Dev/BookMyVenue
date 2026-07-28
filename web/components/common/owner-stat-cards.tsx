'use client';
import { statCards } from "@/lib/data/dashboard";

import { StatCard } from "./stat-card";
import { OwnerStatsResponse, getOwnerStats } from "@/services/venueServices";
import { useFetch } from "@/hooks/useFetch";

export function OwnerStatCards({isIconVisible = true}: {isIconVisible?: boolean}) {

  const { data: stats } = useFetch<OwnerStatsResponse>(()=>getOwnerStats());

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard key={stat.id} {...stat} value={stats?.[stat.id] ?? 0} isIconVisible={isIconVisible} />
      ))}
    </div>
  );
}
