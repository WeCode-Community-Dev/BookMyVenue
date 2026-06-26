import { statCards } from "@/lib/data/dashboard";

import { StatCard } from "./stat-card";

export function DashboardStatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
