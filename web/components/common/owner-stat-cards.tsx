'use client';
import { statCards } from "@/lib/data/dashboard";

import { StatCard } from "./stat-card";
import { OwnerStatsResponse, getOwnerStats } from "@/services/venueServices";
import { useEffect, useState } from "react";

export function OwnerStatCards({isIconVisible = true}: {isIconVisible?: boolean}) {
  const [stats, setStats] = useState<OwnerStatsResponse>({ totalVenues: 0, totalSpaces: 0, totalBookings: 0 });
  useEffect(() => {
    getOwnerStats().then((stats) => {
      setStats(stats);
    });
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard key={stat.id} {...stat} value={stats[stat.id]} isIconVisible={isIconVisible} />
      ))}
    </div>
  );
}
