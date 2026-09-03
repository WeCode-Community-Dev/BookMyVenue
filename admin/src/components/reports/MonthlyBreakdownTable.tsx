import type { MonthData } from "@/types/reports.types";

export function MonthlyBreakdownTable({
  isLoading,
  months,
  monthNames,
}: {
  isLoading: boolean;
  months: MonthData[];
  monthNames: Record<string, string>;
}) {
  if (isLoading || months.length === 0) return null;

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <h2 className="text-sm font-semibold text-zinc-700">
          Monthly Breakdown
        </h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Period</th>
            <th className="px-6 py-3 text-right">Bookings</th>
            <th className="px-6 py-3 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {[...months].reverse().map((row) => (
            <tr
              key={`${row.year}-${row.month}`}
              className="hover:bg-zinc-50/50"
            >
              <td className="px-6 py-4 font-medium text-zinc-900">
                {monthNames[row.month] ?? row.month} '{row.year.slice(2)}
              </td>
              <td className="px-6 py-4 text-right text-zinc-600">
                {row.count}
              </td>
              <td className="px-6 py-3 text-right font-semibold text-emerald-600">
                ₹{row.revenue.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
