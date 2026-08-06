export function RevenueTrendChart({ monthlyTrend }) {
  const max = Math.max(...monthlyTrend.map((m) => m.value));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <span className="text-xs text-gray-400">Last 6 months</span>
      </div>

      <div className="flex h-48 items-end gap-4">
        {monthlyTrend.map((m) => {
          const heightPct = (m.value / max) * 100;
          const isLast = m.month === monthlyTrend[monthlyTrend.length - 1].month;
          return (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                ₹{(m.value / 1000).toFixed(0)}K
              </span>
              <div className="flex h-36 w-full items-end">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-md transition-all ${
                    isLast ? "bg-red-600" : "bg-red-200"
                  }`}
                />
              </div>
              <span className="text-xs text-gray-400">{m.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}