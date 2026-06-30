import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "@/api/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: adminApi.overview,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Admin Overview</h1>

      <div className="mb-6 flex gap-4">
        <Link to="/admin">
          <Button variant="ghost" size="sm">Overview</Button>
        </Link>
        <Link to="/admin/approvals">
          <Button variant="ghost" size="sm">Pending Approvals</Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total users" value={stats.total_users} />
          <StatCard label="Total venues" value={stats.total_venues} />
          <StatCard
            label="Pending approvals"
            value={stats.pending_venues}
            highlight={stats.pending_venues > 0}
          />
          <StatCard label="Total bookings" value={stats.total_bookings} />
          <StatCard
            label="Revenue (confirmed)"
            value={formatCurrency(stats.total_revenue)}
          />
        </div>
      ) : null}

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Venue approvals</h3>
          <Link to="/admin/approvals">
            <Button variant="outline" size="sm">
              Review pending
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <Card className={`p-5 ${highlight ? "border-brand-300" : ""}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-600">{value}</p>
    </Card>
  );
}
