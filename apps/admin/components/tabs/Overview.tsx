"use client";

import { useEffect, useState } from "react";
import {
    IndianRupee,
    CalendarCheck,
    Building2,
    Users,
    TrendingUp,
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
} from "recharts";
import Link from "next/link";
import { ChartTooltip } from "../ChartTooltip";
import {
    fetchAdminDashboard,
    type AdminDashboardResponse,
} from "../../app/actions/dashboard";
import { BOOKING_STATUS_STYLE, fmtAmount } from "../../lib/utils";

const CATEGORY_COLORS = ["#7B1F2E", "#C8790A", "#2563EB", "#059669", "#7C3AED", "#DB2777"];

export function OverviewPage() {
    const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);

    useEffect(() => {
        void fetchAdminDashboard().then(setDashboard);
    }, []);

    if (!dashboard) {
        return null;
    }

    const { stats, revenueData, categoryData, districtData, recentBookings } = dashboard;

    const categoryChartData = categoryData.map((category, index) => ({
        ...category,
        fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));

    const STATS = [
        {
            label: "Total Revenue",
            value: fmtAmount(stats.totalRevenue),
            change: "+18%",
            icon: IndianRupee,
            color: "text-emerald-600 bg-emerald-50",
        },
        {
            label: "Total Bookings",
            value: stats.totalBookings,
            change: "+12%",
            icon: CalendarCheck,
            color: "text-blue-600 bg-blue-50",
        },
        {
            label: "Approved Venues",
            value: stats.approvedVenues,
            change: "+5%",
            icon: Building2,
            color: "text-primary bg-primary/10",
        },
        {
            label: "Registered Users",
            value: stats.totalUsers,
            change: "+23%",
            icon: Users,
            color: "text-purple-600 bg-purple-50",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {STATS.map(({ label, value, change, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="bg-card border-border rounded-2xl border p-5 transition-shadow hover:shadow-md"
                    >
                        <div className="mb-3 flex items-start justify-between">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>

                            <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                                <TrendingUp className="h-3 w-3" />
                                {change}
                            </span>
                        </div>

                        <p className="text-foreground text-2xl font-bold">{value}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{label}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <div className="bg-card border-border rounded-2xl border p-5 lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-foreground font-bold">Revenue & Bookings</h2>
                        <span className="text-muted-foreground text-xs">Jan – Jul</span>
                    </div>

                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart
                            data={revenueData}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
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

                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value: number) =>
                                    value >= 1000 ? `${value / 1000}k` : String(value)
                                }
                            />

                            <Tooltip content={<ChartTooltip />} />

                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#7B1F2E"
                                strokeWidth={2}
                                fill="url(#revGrad)"
                                name="revenue"
                            />

                            <Area
                                type="monotone"
                                dataKey="bookings"
                                stroke="#C8790A"
                                strokeWidth={2}
                                fill="url(#bkGrad)"
                                name="bookings"
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    <div className="mt-3 flex gap-5">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <span className="bg-primary inline-block h-1.5 w-3 rounded-full" />
                            Revenue
                        </span>

                        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <span className="bg-accent inline-block h-1.5 w-3 rounded-full" />
                            Bookings
                        </span>
                    </div>
                </div>

                <div className="bg-card border-border rounded-2xl border p-5">
                    <h2 className="text-foreground mb-4 font-bold">By Category</h2>

                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie
                                data={categoryChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={3}
                                dataKey="value"
                            />

                            <Tooltip
                                formatter={(value) => (value !== undefined ? `${value}%` : "")}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="mt-2 space-y-2">
                        {categoryData.map(({ name, value }, index) => (
                            <div
                                key={name}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <span
                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                        style={{
                                            background:
                                                CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                                        }}
                                    />
                                    {name}
                                </span>

                                <span className="text-foreground font-bold">{value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="bg-card border-border rounded-2xl border p-5">
                    <h2 className="text-foreground mb-5 font-bold">Venues by District</h2>

                    <ResponsiveContainer width="100%" height={190}>
                        <BarChart
                            data={districtData}
                            margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
                            barSize={12}
                            barGap={4}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(0,0,0,0.05)"
                                horizontal
                                vertical={false}
                            />

                            <XAxis
                                dataKey="district"
                                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip content={<ChartTooltip />} />

                            <Bar
                                dataKey="venues"
                                fill="#7B1F2E"
                                radius={[4, 4, 0, 0]}
                                name="venues"
                            />

                            <Bar
                                dataKey="bookings"
                                fill="#C8790A"
                                radius={[4, 4, 0, 0]}
                                name="bookings"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card border-border overflow-hidden rounded-2xl border">
                    <div className="border-border flex items-center justify-between border-b px-5 py-4">
                        <h2 className="text-foreground font-bold">Recent Activity</h2>

                        <Link
                            href="/bookings"
                            className="text-primary text-xs font-semibold hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="divide-border divide-y">
                        {recentBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="hover:bg-muted/40 flex items-center gap-3 px-5 py-3 transition-colors"
                            >
                                <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                                    {booking.user.name?.slice(0, 1).toUpperCase() ?? "U"}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground truncate text-sm font-semibold">
                                        {booking.user.name ?? "Unknown User"}
                                    </p>

                                    <p className="text-muted-foreground truncate text-xs">
                                        {booking.venue.name}
                                        {booking.eventDate &&
                                            ` · ${new Date(booking.eventDate).toLocaleDateString()}`}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-foreground text-sm font-bold">
                                        {fmtAmount(booking.totalAmount)}
                                    </p>

                                    <span
                                        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                                            BOOKING_STATUS_STYLE[booking.status]
                                        }`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}