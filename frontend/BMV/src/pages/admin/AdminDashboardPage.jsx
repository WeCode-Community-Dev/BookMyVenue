import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminService } from "../../modules/admin/services/adminService";
import { AdminCard, AdminLoading, StatTile } from "../../components/admin/AdminForm";

const COLORS = {
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#8b5cf6",
  orange: "#f97316",
  red: "#ef4444",
};

const formatInr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function MonthHeatmap({ activity }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = today.getDate();
  const counts = Object.fromEntries(activity.map((d) => [d.date, d.bookings]));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, bookings: counts[dateStr] || 0, isToday: d === today.getDate() });
  }

  const dotColor = (n) => {
    if (n === 0) return "bg-slate-200";
    if (n <= 2) return "bg-amber-400";
    return "bg-emerald-500";
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) =>
          cell ? (
            <div
              key={i}
              title={`${cell.bookings} booking${cell.bookings !== 1 ? "s" : ""}`}
              className={`flex flex-col items-center py-1.5 rounded-lg ${
                cell.isToday ? "bg-blue-50 ring-1 ring-blue-200" : ""
              }`}
            >
              <span className="text-xs text-slate-600">{cell.day}</span>
              <span className={`w-1.5 h-1.5 rounded-full mt-1 ${dotColor(cell.bookings)}`} />
              {cell.bookings > 0 && (
                <span className="text-[9px] text-slate-400 mt-0.5">{cell.bookings}</span>
              )}
            </div>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
      <div className="flex gap-4 mt-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> 3+ bookings
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> 1–2 bookings
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-200" /> None
        </span>
      </div>
    </div>
  );
}

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const radialData = useMemo(() => {
    if (!stats?.health_metrics) return [];
    const fills = [COLORS.blue, COLORS.green, COLORS.purple];
    return stats.health_metrics.map((m, i) => ({
      name: m.label,
      value: m.percent,
      count: m.value,
      total: m.total,
      fill: fills[i],
    }));
  }, [stats]);

  const venuePie = useMemo(() => {
    if (!stats) return [];
    const { approved, pending, rejected } = stats.venue_breakdown;
    return [
      { name: "Approved", value: approved, fill: COLORS.green },
      { name: "Pending", value: pending, fill: COLORS.orange },
      { name: "Rejected", value: rejected, fill: COLORS.red },
    ];
  }, [stats]);

  if (loading) return <AdminLoading />;
  if (error) return <p className="text-rose-600">{error}</p>;

  const weekTotalBookings = stats.weekly_trend.reduce((s, d) => s + d.bookings, 0);
  const weekTotalRevenue = stats.weekly_trend.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <AdminCard title="Platform overview" subtitle="All-time totals from database">
          <div className="grid grid-cols-2 gap-6">
            <StatTile label="Total users" value={stats.total_users} color="text-blue-600" />
            <StatTile label="Total owners" value={stats.total_owners} color="text-emerald-600" />
            <StatTile label="Total venues" value={stats.total_venues} color="text-violet-600" />
            <StatTile label="Total bookings" value={stats.total_bookings} color="text-orange-500" />
          </div>
        </AdminCard>

        <AdminCard title="Today's snapshot" subtitle={new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}>
          <div className="grid grid-cols-2 gap-6">
            <StatTile label="Bookings today" value={stats.today_bookings} color="text-emerald-600" />
            <StatTile label="Revenue today" value={formatInr(stats.today_revenue)} color="text-blue-600" />
            <StatTile label="Pending venues" value={stats.pending_venues} color="text-orange-500" />
            <StatTile label="All-time revenue" value={formatInr(stats.total_revenue)} color="text-violet-600" />
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <AdminCard
          title="Booking activity"
          subtitle={`${stats.month_activity.reduce((s, d) => s + d.bookings, 0)} bookings this month`}
        >
          <MonthHeatmap activity={stats.month_activity} />
        </AdminCard>

        <AdminCard title="Platform health" subtitle="Live counts from DB">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                barSize={10}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background dataKey="value" cornerRadius={6} />
                <Tooltip formatter={(v, _n, p) => [`${v}% (${p.payload.count}/${p.payload.total})`, ""]} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {radialData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </span>
                <span className="font-medium text-slate-700">
                  {d.count}/{d.total} ({d.value}%)
                </span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="Weekly trend"
          subtitle={`${weekTotalBookings} bookings · ${formatInr(weekTotalRevenue)} revenue`}
        >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stats.weekly_trend} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  allowDecimals={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  formatter={(value, name) =>
                    name === "Revenue (INR)" ? [formatInr(value), name] : [value, name]
                  }
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="bookings" fill={COLORS.blue} radius={[4, 4, 0, 0]} name="Bookings" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.orange}
                  strokeWidth={2}
                  dot={{ r: 3, fill: COLORS.orange }}
                  name="Revenue (INR)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AdminCard title="Venue status" subtitle="Approval breakdown (real counts)">
          <div className="h-52 flex items-center">
            {stats.total_venues > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={venuePie}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
                  >
                    {venuePie.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} venues`, n]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm w-full text-center">No venues in database</p>
            )}
          </div>
        </AdminCard>

        <AdminCard title="Booking status" subtitle={`${stats.total_bookings} total orders`}>
          <div className="space-y-4 pt-2">
            {[
              { key: "booked", label: "Confirmed", color: COLORS.green },
              { key: "pending_payment", label: "Pending payment", color: COLORS.orange },
              { key: "cancelled", label: "Cancelled", color: COLORS.red },
            ].map(({ key, label, color }) => {
              const count = stats.booking_status[key];
              const pct = stats.total_bookings
                ? Math.round((count / stats.total_bookings) * 100)
                : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-medium text-slate-800">
                      {count} <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
