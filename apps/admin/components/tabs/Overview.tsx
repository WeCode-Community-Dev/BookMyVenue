"use client";

import {
  IndianRupee, CalendarCheck, Building2, Users,
  TrendingUp, TrendingDown,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import Link from "next/link";
import {
  fmt, REVENUE_DATA, CATEGORY_DATA, DISTRICT_DATA, BOOKINGS,
  BOOKING_STATUS_STYLE, Venue, User,
} from "../data";
import { ChartTooltip } from "../ChartTooltip";
import { VerificationStatus } from "@bookmyvenue/database/enums";

interface OverviewPageProps {
  venues: Venue[];
  users: User[];
  totalRevenue: number;
}

export function OverviewPage({ venues, users, totalRevenue }: OverviewPageProps) {
  const STATS = [
    { label: "Total Revenue", value: fmt(totalRevenue), change: "+18%", up: true, icon: IndianRupee, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Bookings", value: BOOKINGS.length, change: "+12%", up: true, icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
    { label: "Approved Venues", value: venues.filter(v => v.status === VerificationStatus.APPROVED).length, change: "+5%", up: true, icon: Building2, color: "text-primary bg-primary/10" },
    { label: "Registered Users", value: users.length, change: "+23%", up: true, icon: Users, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${up ? "text-emerald-600" : "text-red-500"}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground" >{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-foreground" >Revenue & Bookings</h2>
            <span className="text-xs text-muted-foreground">Jan – Jul 2024</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B1F2E" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#7B1F2E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8790A" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#C8790A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#7B1F2E" strokeWidth={2} fill="url(#revGrad)" name="revenue" />
              <Area type="monotone" dataKey="bookings" stroke="#C8790A" strokeWidth={2} fill="url(#bkGrad)" name="bookings" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-1.5 rounded-full bg-primary inline-block" />Revenue</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-1.5 rounded-full bg-accent inline-block" />Bookings</span>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-foreground mb-4" >By Category</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => (v !== undefined ? `${v}%` : '')} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {CATEGORY_DATA.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  {name}
                </span>
                <span className="font-bold text-foreground">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* District bar chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-foreground mb-5" >Venues by District</h2>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={DISTRICT_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={12} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal vertical={false} />
              <XAxis dataKey="district" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="venues" fill="#7B1F2E" radius={[4, 4, 0, 0]} name="venues" />
              <Bar dataKey="bookings" fill="#C8790A" radius={[4, 4, 0, 0]} name="bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground" >Recent Activity</h2>
            <Link href="/bookings" className="text-xs text-primary font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {BOOKINGS.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {b.client.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{b.client}</p>
                  <p className="text-xs text-muted-foreground truncate">{b.venue} · {b.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground">{fmt(b.amount)}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${BOOKING_STATUS_STYLE[b.status]}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
