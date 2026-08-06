import { CATEGORY_COLORS } from "../../utils/ownerPageUtils";

export function CategoryBreakdown({ entries, totalRevenue }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-gray-900">Revenue by Category</h3>
      <div className="space-y-4">
        {entries.map(([category, value], i) => {
          const pct = Math.round((value / totalRevenue) * 100);
          return (
            <div key={category}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="text-gray-400">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-2 rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}