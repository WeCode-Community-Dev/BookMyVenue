import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevenueSummary } from "@/hooks/use-analytics";
import type { VenueRevenue } from "@/api/analytics-api";

const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const columns: ColumnDef<VenueRevenue>[] = [
  {
    accessorKey: "venueName",
    header: "Venue",
    cell: ({ row }) => <span className="font-medium">{row.original.venueName}</span>,
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    cell: ({ row }) => row.original.ownerName ?? "—",
  },
  {
    accessorKey: "bookings",
    header: "Bookings",
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => inr(row.original.revenue),
  },
  {
    accessorKey: "commission",
    header: "Commission",
    cell: ({ row }) => (
      <span className="font-medium text-green-600">{inr(row.original.commission)}</span>
    ),
  },
  {
    id: "payout",
    header: "Owner payout",
    cell: ({ row }) => inr(row.original.revenue - row.original.commission),
  },
];

const AdminRevenue = () => {
  const { data: summary, isLoading } = useRevenueSummary();

  const ratePercent = summary ? Math.round(summary.commissionRate * 100) : 0;

  const stats = [
    { label: "Total revenue", value: summary ? inr(summary.totalRevenue) : "—" },
    {
      label: `Platform commission (${ratePercent}%)`,
      value: summary ? inr(summary.platformCommission) : "—",
      highlight: true,
    },
    { label: "Owner payouts", value: summary ? inr(summary.ownerPayout) : "—" },
    { label: "Confirmed bookings", value: summary ? String(summary.totalBookings) : "—" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Revenue</h1>
        <p className="text-sm text-muted-foreground">
          Platform earnings from a {ratePercent}% commission on every confirmed booking.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex flex-col gap-1 py-5">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span
                  className={
                    stat.highlight
                      ? "text-2xl font-semibold text-green-600"
                      : "text-2xl font-semibold"
                  }>
                  {stat.value}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Earnings by venue</h2>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={summary?.venues ?? []}
            emptyMessage="No confirmed bookings yet."
          />
        )}
      </div>
    </div>
  );
};

export default AdminRevenue;
