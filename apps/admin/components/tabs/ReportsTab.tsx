"use client";

import { TrendingUp, TrendingDown, Download } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { REVENUE_DATA, CATEGORY_DATA, DISTRICT_DATA } from "../data";
import { ChartTooltip } from "../ChartTooltip";

export function ReportsTab() {
  const totalBookings = DISTRICT_DATA.reduce((s, x) => s + x.bookings, 0);

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Revenue (Jul)", value: "₹4,20,000", change: "+8% vs Jun", up: true },
          { label: "Platform Commission", value: "₹37,800", change: "9% of gross", up: true },
          { label: "Cancellation Rate", value: "12.5%", change: "+2% vs Jun", up: false },
          { label: "Avg Booking Value", value: "₹21,500", change: "+5% vs Jun", up: true },
        ].map(({ label, value, change, up }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-muted-foreground mb-2">{label}</p>
            <p className="text-xl font-bold text-foreground" >{value}</p>
            <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${up ? "text-emerald-600" : "text-red-500"}`}>
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {change}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-foreground" >Monthly Revenue Trend</h2>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-border px-3 py-1.5 rounded-xl hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={REVENUE_DATA}>
            <defs>
              <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7B1F2E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7B1F2E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#7B1F2E" strokeWidth={2.5} fill="url(#rg2)" name="revenue" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* District table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-bold text-foreground" >Performance by District</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {["District", "Venues", "Bookings", "Share"].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DISTRICT_DATA.map(d => {
                const pct = Math.round(d.bookings / totalBookings * 100);
                return (
                  <tr key={d.district} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{d.district}</td>
                    <td className="px-5 py-3 text-foreground/70">{d.venues}</td>
                    <td className="px-5 py-3 text-foreground/70">{d.bookings}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-6 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Category breakdown */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-bold text-foreground" >Bookings by Category</h2>
          </div>
          <div className="p-5 space-y-4">
            {CATEGORY_DATA.map(({ name, value, color }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                    {name}
                  </span>
                  <span className="text-muted-foreground">{value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
