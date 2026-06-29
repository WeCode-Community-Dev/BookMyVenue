"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  UserPlus,
  CalendarDays,
  Activity,
  AlertCircle,
} from "lucide-react";
import { StatCard } from "@/src/admin/components/StatCard";
import { StatusBadge } from "@/src/admin/components/StatusBadge";
import { EmptyState } from "@/src/admin/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getCustomers, getVenueOwners, getPendingVenues } from "@/src/admin/route";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalCustomers: number;
  totalOwners: number;
  pendingVerifications: number;
  // mocked since backend doesn't expose these yet
  approvedVenues: number;
  rejectedVenues: number;
  totalRevenue: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

interface PendingVenue {
  id: string;
  venueName: string;
  venueType: string;
  city: string;
  status: string;
  createdAt?: string;
}

// ─── Mock activity feed ───────────────────────────────────────────────────────

const MOCK_ACTIVITY = [
  {
    id: "1",
    icon: CheckCircle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    text: "Venue Grand Pearl Ballroom approved",
    time: "2 hours ago",
  },
  {
    id: "2",
    icon: UserPlus,
    iconBg: "bg-[#E6F1F1]",
    iconColor: "text-[#0D7377]",
    text: "New venue owner registered: Ramesh Nair",
    time: "4 hours ago",
  },
  {
    id: "3",
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    text: "Venue Sky Lounge rejected — missing documents",
    time: "Yesterday",
  },
  {
    id: "4",
    icon: ShieldCheck,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    text: "Review requested for Whispering Meadows",
    time: "Yesterday",
  },
  {
    id: "5",
    icon: Users,
    iconBg: "bg-[#E6F1F1]",
    iconColor: "text-[#0D7377]",
    text: "Customer account suspended: anon_user_42",
    time: "2 days ago",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<RecentUser[]>([]);
  const [pendingVenues, setPendingVenues] = useState<PendingVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [customersData, ownersData, pendingData] = await Promise.allSettled([
        getCustomers(),
        getVenueOwners(),
        getPendingVenues(),
      ]);

      const c =
        customersData.status === "fulfilled" ? customersData.value : [];
      const o = ownersData.status === "fulfilled" ? ownersData.value : [];
      const p = pendingData.status === "fulfilled" ? pendingData.value : [];

      setCustomers((c as RecentUser[]).slice(0, 5));
      setPendingVenues((p as PendingVenue[]).slice(0, 5));
      setStats({
        totalCustomers: (c as any[]).length,
        totalOwners: (o as any[]).length,
        pendingVerifications: (p as any[]).length,
        approvedVenues: 24, // mocked
        rejectedVenues: 6, // mocked
        totalRevenue: "₹18.4L", // mocked
      });
      setLastRefresh(new Date());
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-staggered-entrance">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A19]">Dashboard Overview</h1>
          <p className="text-xs text-[#70706e] mt-0.5">
            Last updated:{" "}
            {lastRefresh.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          loading={loading}
          title="Total Customers"
          value={stats?.totalCustomers ?? 0}
          trend={8}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-[#E6F1F1]"
          iconColor="text-[#0D7377]"
        />
        <StatCard
          loading={loading}
          title="Venue Owners"
          value={stats?.totalOwners ?? 0}
          trend={12}
          icon={<Building2 className="h-5 w-5" />}
          iconBg="bg-amber-50"
          iconColor="text-[#F4A261]"
        />
        <StatCard
          loading={loading}
          title="Pending Verifications"
          value={stats?.pendingVerifications ?? 0}
          subValue="Requires action"
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          loading={loading}
          title="Approved Venues"
          value={stats?.approvedVenues ?? 0}
          trend={5}
          icon={<CheckCircle className="h-5 w-5" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          loading={loading}
          title="Rejected Venues"
          value={stats?.rejectedVenues ?? 0}
          icon={<XCircle className="h-5 w-5" />}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
        <StatCard
          loading={loading}
          title="Platform Revenue"
          value={stats?.totalRevenue ?? "—"}
          subValue="Estimated (mock)"
          trend={24}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBg="bg-[#E6F1F1]"
          iconColor="text-[#0D7377]"
        />
      </div>

      {/* ── Quick action buttons ── */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/verification">
          <Button className="bg-[#0D7377] hover:bg-[#0a5b5e] text-white rounded-xl gap-2 text-sm">
            <ShieldCheck className="h-4 w-4" />
            Review Pending ({stats?.pendingVerifications ?? 0})
          </Button>
        </Link>
        <Link href="/admin/users">
          <Button
            variant="outline"
            className="border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl gap-2 text-sm"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Button>
        </Link>
        <Link href="/admin/analytics">
          <Button
            variant="outline"
            className="border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl gap-2 text-sm"
          >
            <Activity className="h-4 w-4" />
            View Analytics
          </Button>
        </Link>
      </div>

      {/* ── Two column section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent customers */}
        <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E2DE] flex items-center justify-between">
            <h2 className="font-semibold text-sm text-[#1A1A19] flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-[#0D7377]" />
              Recent Customers
            </h2>
            <Link
              href="/admin/users"
              className="text-[10px] text-[#0D7377] font-semibold hover:underline flex items-center gap-0.5"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#E2E2DE]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-48" />
                  </div>
                </div>
              ))
            ) : customers.length === 0 ? (
              <EmptyState
                title="No customers yet"
                description="Customer registrations will appear here."
                className="py-10"
              />
            ) : (
              customers.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAFAF8] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-full bg-[#E6F1F1] text-[#0D7377] flex items-center justify-center text-xs font-bold shrink-0">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-[#1A1A19] block truncate group-hover:text-[#0D7377] transition-colors">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-[#70706e] block truncate">
                      {user.email}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[#70706e] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Pending venues */}
        <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E2DE] flex items-center justify-between">
            <h2 className="font-semibold text-sm text-[#1A1A19] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              Pending Verifications
            </h2>
            <Link
              href="/admin/verification"
              className="text-[10px] text-[#0D7377] font-semibold hover:underline flex items-center gap-0.5"
            >
              Review all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#E2E2DE]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-2.5 w-28" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))
            ) : pendingVenues.length === 0 ? (
              <EmptyState
                title="No pending venues"
                description="All venue verifications are up to date."
                className="py-10"
              />
            ) : (
              pendingVenues.map((venue) => (
                <Link
                  key={venue.id}
                  href={`/admin/verification/${venue.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAFAF8] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-[#1A1A19] block truncate group-hover:text-[#0D7377] transition-colors">
                      {venue.venueName}
                    </span>
                    <span className="text-[11px] text-[#70706e]">
                      {venue.venueType} · {venue.city}
                    </span>
                  </div>
                  <StatusBadge status={venue.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Activity feed ── */}
      <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E2DE] flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#0D7377]" />
          <h2 className="font-semibold text-sm text-[#1A1A19]">Recent Activity</h2>
          <span className="ml-auto text-[10px] text-[#70706e] font-medium bg-[#F0F0EC] px-2 py-0.5 rounded-full">
            Mock data
          </span>
        </div>
        <div className="divide-y divide-[#E2E2DE]">
          {MOCK_ACTIVITY.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 px-5 py-3.5"
              >
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <span className="text-sm text-[#1A1A19] flex-1">{item.text}</span>
                <span className="text-[11px] text-[#70706e] shrink-0 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Progress bars: approval stats ── */}
      <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5">
        <h2 className="font-semibold text-sm text-[#1A1A19] mb-4 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#0D7377]" />
          Venue Approval Summary
        </h2>
        <div className="space-y-4">
          {[
            {
              label: "Approved",
              value: stats?.approvedVenues ?? 24,
              total: 36,
              color: "bg-emerald-500",
            },
            {
              label: "Pending",
              value: stats?.pendingVerifications ?? 6,
              total: 36,
              color: "bg-amber-400",
            },
            {
              label: "Rejected",
              value: stats?.rejectedVenues ?? 6,
              total: 36,
              color: "bg-red-400",
            },
          ].map(({ label, value, total, color }) => {
            const pct = Math.round((value / total) * 100);
            return (
              <div key={label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-[#1A1A19]">
                    {label}
                  </span>
                  <span className="text-xs text-[#70706e]">
                    {value} / {total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-[#F0F0EC] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
