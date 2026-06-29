"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart2,
  Activity,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MONTHLY_USERS = [
  { month: "Jan", customers: 42, owners: 8 },
  { month: "Feb", customers: 58, owners: 14 },
  { month: "Mar", customers: 75, owners: 18 },
  { month: "Apr", customers: 91, owners: 22 },
  { month: "May", customers: 120, owners: 30 },
  { month: "Jun", customers: 145, owners: 38 },
];

const VENUE_STATS = { approved: 24, pending: 6, rejected: 6, total: 36 };

const BOOKING_TRENDS = [
  { month: "Jan", bookings: 18 },
  { month: "Feb", bookings: 24 },
  { month: "Mar", bookings: 31 },
  { month: "Apr", bookings: 28 },
  { month: "May", bookings: 44 },
  { month: "Jun", bookings: 52 },
];

const TOP_VENUES = [
  { name: "Grand Pearl Ballroom", bookings: 24, revenue: "₹36.4L" },
  { name: "Whispering Meadows Lawn", bookings: 18, revenue: "₹28.1L" },
  { name: "The Royal Serenity Resort", bookings: 12, revenue: "₹21.6L" },
  { name: "Apex Conference Centre", bookings: 9, revenue: "₹8.1L" },
  { name: "The Palm Banquet Hall", bookings: 7, revenue: "₹5.4L" },
];

type DateRange = "7D" | "30D" | "90D";

// ─── SVG Chart Helpers ────────────────────────────────────────────────────────

function LineChart({ data, keys, colors, height = 120 }: {
  data: any[];
  keys: string[];
  colors: string[];
  height?: number;
}) {
  const maxVal = Math.max(...data.flatMap((d) => keys.map((k) => d[k] ?? 0)));
  const w = 100 / (data.length - 1);

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1="0" y1={t * height} x2="100" y2={t * height}
          stroke="#E2E2DE" strokeWidth="0.5" />
      ))}
      {keys.map((key, ki) => {
        const points = data.map((d, i) => {
          const x = i * w;
          const y = height - ((d[key] ?? 0) / maxVal) * (height - 8) - 4;
          return `${x},${y}`;
        });
        const pathD = `M ${points.join(" L ")}`;
        const fillPoints = [
          `0,${height}`,
          ...data.map((d, i) => {
            const x = i * w;
            const y = height - ((d[key] ?? 0) / maxVal) * (height - 8) - 4;
            return `${x},${y}`;
          }),
          `${(data.length - 1) * w},${height}`,
        ];
        return (
          <g key={key}>
            <path d={`M ${fillPoints.join(" L ")} Z`}
              fill={colors[ki]} fillOpacity={0.08} />
            <path d={pathD} fill="none" stroke={colors[ki]} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
            {data.map((d, i) => (
              <circle key={i} cx={i * w} cy={height - ((d[key] ?? 0) / maxVal) * (height - 8) - 4}
                r="2" fill="white" stroke={colors[ki]} strokeWidth="1.5" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function BarChart({ data, valueKey, color = "#0D7377", height = 100 }: {
  data: any[];
  valueKey: string;
  color?: string;
  height?: number;
}) {
  const maxVal = Math.max(...data.map((d) => d[valueKey] ?? 0));
  const gap = 8;
  const barW = (100 - (data.length - 1) * gap / 10) / data.length;

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = ((d[valueKey] ?? 0) / maxVal) * (height - 4);
        const x = i * (barW + gap / 10);
        return (
          <g key={i}>
            <rect x={x} y={height - barH} width={barW} height={barH}
              rx="2" fill={color} fillOpacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ slices }: {
  slices: { value: number; color: string; label: string }[];
}) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  let angle = -90;
  const r = 38;
  const cx = 50;
  const cy = 50;

  const toXY = (deg: number, radius: number) => ({
    x: cx + radius * Math.cos((deg * Math.PI) / 180),
    y: cy + radius * Math.sin((deg * Math.PI) / 180),
  });

  const arcs = slices.map((slice) => {
    const sweep = (slice.value / total) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    const s = toXY(start, r);
    const e = toXY(end, r);
    const large = sweep > 180 ? 1 : 0;
    return {
      ...slice,
      d: `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`,
    };
  });

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0">
        {arcs.map((arc, i) => (
          <path key={i} d={arc.d} fill={arc.color} fillOpacity="0.9" />
        ))}
        <circle cx={cx} cy={cy} r="24" fill="white" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          fontSize="8" fontWeight="bold" fill="#1A1A19">
          {total}
        </text>
        <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="middle"
          fontSize="4.5" fill="#70706e">
          venues
        </text>
      </svg>
      <div className="space-y-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[#70706e] text-xs">{s.label}</span>
            <span className="font-bold text-[#1A1A19] text-xs ml-1">{s.value}</span>
            <span className="text-[10px] text-[#70706e]">({Math.round((s.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30D");

  const topStats = [
    { label: "Total Users", value: "315", icon: <Users className="h-5 w-5" />, bg: "bg-[#E6F1F1]", color: "text-[#0D7377]", trend: "+14%" },
    { label: "Venue Approval Rate", value: "66.7%", icon: <CheckCircle className="h-5 w-5" />, bg: "bg-emerald-50", color: "text-emerald-600", trend: "+4%" },
    { label: "Total Bookings", value: "197", icon: <Calendar className="h-5 w-5" />, bg: "bg-amber-50", color: "text-amber-600", trend: "+22%" },
    { label: "Rejection Rate", value: "16.7%", icon: <XCircle className="h-5 w-5" />, bg: "bg-red-50", color: "text-red-500", trend: "-3%" },
  ];

  return (
    <div className="space-y-6 animate-staggered-entrance">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A19]">Analytics</h1>
          <p className="text-xs text-[#70706e] mt-0.5 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
            Using mock data — backend analytics endpoints coming soon
          </p>
        </div>
        {/* Date range selector */}
        <div className="flex items-center gap-1 bg-[#F0F0EC] rounded-xl p-1">
          {(["7D", "30D", "90D"] as DateRange[]).map((r) => (
            <button key={r} onClick={() => setDateRange(r)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                dateRange === r ? "bg-white text-[#0D7377] shadow-sm" : "text-[#70706e] hover:text-[#1A1A19]"
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wide text-[#70706e]">{stat.label}</span>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1A1A19]">{stat.value}</p>
            <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${stat.trend.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
              <TrendingUp className="h-3 w-3" />
              {stat.trend} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* User Growth Line Chart */}
        <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm text-[#1A1A19]">User Growth</h3>
              <p className="text-[11px] text-[#70706e]">Monthly new registrations</p>
            </div>
            <Activity className="h-4 w-4 text-[#70706e]" />
          </div>
          <LineChart
            data={MONTHLY_USERS}
            keys={["customers", "owners"]}
            colors={["#0D7377", "#F4A261"]}
            height={100}
          />
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[11px] text-[#70706e]">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#0D7377]" />Customers
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#70706e]">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#F4A261]" />Venue Owners
            </span>
          </div>
          {/* Month labels */}
          <div className="flex justify-between mt-1">
            {MONTHLY_USERS.map((d) => (
              <span key={d.month} className="text-[10px] text-[#70706e]">{d.month}</span>
            ))}
          </div>
        </div>

        {/* Venue Approval Donut */}
        <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm text-[#1A1A19]">Venue Approval Ratio</h3>
              <p className="text-[11px] text-[#70706e]">All-time venue status breakdown</p>
            </div>
            <Building2 className="h-4 w-4 text-[#70706e]" />
          </div>
          <DonutChart
            slices={[
              { value: VENUE_STATS.approved, color: "#10b981", label: "Approved" },
              { value: VENUE_STATS.pending, color: "#f59e0b", label: "Pending" },
              { value: VENUE_STATS.rejected, color: "#ef4444", label: "Rejected" },
            ]}
          />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Booking Trends Bar Chart */}
        <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm text-[#1A1A19]">Booking Trends</h3>
              <p className="text-[11px] text-[#70706e]">Monthly bookings volume</p>
            </div>
            <BarChart2 className="h-4 w-4 text-[#70706e]" />
          </div>
          <BarChart
            data={BOOKING_TRENDS}
            valueKey="bookings"
            color="#0D7377"
            height={100}
          />
          <div className="flex justify-between mt-2">
            {BOOKING_TRENDS.map((d) => (
              <span key={d.month} className="text-[10px] text-[#70706e]">{d.month}</span>
            ))}
          </div>
        </div>

        {/* Top Venues */}
        <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm text-[#1A1A19]">Top Venues</h3>
              <p className="text-[11px] text-[#70706e]">By total bookings</p>
            </div>
          </div>
          <div className="space-y-3">
            {TOP_VENUES.map((venue, i) => {
              const maxBookings = TOP_VENUES[0].bookings;
              const pct = (venue.bookings / maxBookings) * 100;
              return (
                <div key={venue.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-bold text-[#70706e] w-4 shrink-0">#{i + 1}</span>
                      <span className="text-xs font-semibold text-[#1A1A19] truncate">{venue.name}</span>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-xs font-bold text-[#0D7377]">{venue.bookings}</span>
                      <span className="text-[10px] text-[#70706e] ml-1">bookings</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#F0F0EC] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0D7377] rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue trends */}
      <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm text-[#1A1A19]">Revenue Trends</h3>
            <p className="text-[11px] text-[#70706e]">Estimated platform revenue (mock)</p>
          </div>
          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg font-medium">
            Mock data
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Jan–Feb", value: "₹4.2L", change: "+8%" },
            { label: "Mar–Apr", value: "₹7.1L", change: "+14%" },
            { label: "May", value: "₹5.8L", change: "+22%" },
            { label: "Jun (to date)", value: "₹1.3L", change: "—" },
          ].map((row) => (
            <div key={row.label} className="bg-[#FAFAF8] rounded-xl border border-[#E2E2DE] p-3">
              <p className="text-[10px] text-[#70706e] font-bold uppercase">{row.label}</p>
              <p className="text-lg font-bold text-[#1A1A19] mt-1">{row.value}</p>
              {row.change !== "—" && (
                <p className="text-[11px] text-emerald-600 font-semibold">{row.change} vs prev</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
