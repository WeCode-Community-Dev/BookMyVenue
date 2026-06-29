"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Search,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  UserCheck,
  UserX,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/src/admin/components/StatusBadge";
import { EmptyState } from "@/src/admin/components/EmptyState";
import { Pagination } from "@/src/admin/components/Pagination";
import { ConfirmDialog } from "@/src/admin/components/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomers, getVenueOwners, updateUser } from "@/src/admin/route";

const PAGE_SIZE = 10;

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  role?: string;
}

export default function ManageUsersPage() {
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [owners, setOwners] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "active" | "inactive">("ALL");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("customers");

  // Action state
  const [actionTarget, setActionTarget] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, o] = await Promise.allSettled([getCustomers(), getVenueOwners()]);
      if (c.status === "fulfilled") setCustomers(c.value as AdminUser[]);
      if (o.status === "fulfilled") setOwners(o.value as AdminUser[]);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Clear toast after 3s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const getFiltered = (users: AdminUser[]) => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone?.includes(q);
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "active" ? u.isActive : !u.isActive);
      return matchSearch && matchStatus;
    });
  };

  const filteredCustomers = useMemo(() => getFiltered(customers), [customers, search, statusFilter]);
  const filteredOwners = useMemo(() => getFiltered(owners), [owners, search, statusFilter]);

  const currentList = activeTab === "customers" ? filteredCustomers : filteredOwners;
  const totalPages = Math.ceil(currentList.length / PAGE_SIZE);
  const paginated = currentList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAction = async () => {
    if (!actionTarget || !actionType) return;
    setSubmitting(true);
    try {
      await updateUser(actionTarget.id, { isActive: actionType === "activate" });
      // Optimistically update local state
      const updater = (list: AdminUser[]) =>
        list.map((u) =>
          u.id === actionTarget.id
            ? { ...u, isActive: actionType === "activate" }
            : u
        );
      setCustomers(updater);
      setOwners(updater);
      setToast({ msg: `User ${actionType === "activate" ? "activated" : "suspended"} successfully.`, type: "success" });
    } catch (e: any) {
      setToast({ msg: e.message ?? "Action failed.", type: "error" });
    } finally {
      setSubmitting(false);
      setActionTarget(null);
      setActionType(null);
    }
  };

  const UserTable = ({ users }: { users: AdminUser[] }) => (
    loading ? (
      <div className="divide-y divide-[#E2E2DE]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    ) : users.length === 0 ? (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="No users found"
        description="Try adjusting your search or filters."
        className="py-16"
      />
    ) : (
      <>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F0F0EC] border-b border-[#E2E2DE] text-[#70706e] font-bold uppercase text-[10px] tracking-wide">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E2DE]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#E6F1F1] text-[#0D7377] flex items-center justify-center text-xs font-bold shrink-0">
                        {user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1A1A19] text-sm truncate max-w-[160px]">{user.name}</p>
                        <p className="text-[11px] text-[#70706e] truncate max-w-[200px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#70706e]">{user.phone ?? "—"}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={user.isActive ? "active" : "inactive"} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button size="sm" variant="outline" className="h-7 px-3 text-[11px] rounded-lg border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] gap-1">
                          View <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                      {user.isActive ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-[11px] rounded-lg border-red-200 text-red-600 hover:bg-red-50 gap-1"
                          onClick={() => { setActionTarget(user); setActionType("suspend"); }}
                        >
                          <UserX className="h-3 w-3" /> Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-7 px-3 text-[11px] rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white gap-1"
                          onClick={() => { setActionTarget(user); setActionType("activate"); }}
                        >
                          <UserCheck className="h-3 w-3" /> Activate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#E2E2DE]">
          {users.map((user) => (
            <div key={user.id} className="px-4 py-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-[#E6F1F1] text-[#0D7377] flex items-center justify-center text-sm font-bold shrink-0">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1A1A19] text-sm">{user.name}</p>
                <p className="text-[11px] text-[#70706e] truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={user.isActive ? "active" : "inactive"} />
                  <Link href={`/admin/users/${user.id}`}>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-[#0D7377] hover:bg-[#E6F1F1]">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
              {user.isActive ? (
                <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 shrink-0"
                  onClick={() => { setActionTarget(user); setActionType("suspend"); }}>
                  <UserX className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="sm" className="h-7 px-2 text-[11px] bg-emerald-500 text-white hover:bg-emerald-600 shrink-0"
                  onClick={() => { setActionTarget(user); setActionType("activate"); }}>
                  <UserCheck className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </>
    )
  );

  return (
    <div className="space-y-5 animate-staggered-entrance">

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A19]">Manage Users</h1>
          <p className="text-xs text-[#70706e] mt-0.5">
            {customers.length} customers · {owners.length} venue owners
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}
          className="border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl gap-1.5">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-medium ${
          toast.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {toast.type === "success" ? <UserCheck className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#70706e]" />
          <Input placeholder="Search by name, email, phone…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 rounded-xl border-[#E2E2DE] bg-white text-sm h-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#70706e] shrink-0" />
          {(["ALL", "active", "inactive"] as const).map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === s ? "bg-[#0D7377] text-white" : "bg-[#F0F0EC] text-[#70706e] hover:bg-[#E2E2DE]"
              }`}>
              {s === "ALL" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1); }}>
        <TabsList className="bg-[#F0F0EC] rounded-xl p-1 gap-1">
          <TabsTrigger value="customers"
            className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:text-[#0D7377] data-[state=active]:font-semibold data-[state=active]:shadow-sm gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Customers
            <span className="bg-[#0D7377]/10 text-[#0D7377] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {filteredCustomers.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="owners"
            className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:text-[#0D7377] data-[state=active]:font-semibold data-[state=active]:shadow-sm gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Venue Owners
            <span className="bg-[#0D7377]/10 text-[#0D7377] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {filteredOwners.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden mt-4">
          <TabsContent value="customers" className="m-0">
            <UserTable users={paginated} />
          </TabsContent>
          <TabsContent value="owners" className="m-0">
            <UserTable users={paginated} />
          </TabsContent>
        </div>
      </Tabs>

      {!loading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="pt-2" />
      )}

      {/* Confirm suspend/activate */}
      <ConfirmDialog
        isOpen={!!actionTarget && !!actionType}
        title={actionType === "suspend" ? "Suspend this user?" : "Activate this user?"}
        description={
          actionType === "suspend"
            ? `${actionTarget?.name} will lose access to the platform until reactivated.`
            : `${actionTarget?.name} will regain full access to the platform.`
        }
        confirmLabel={actionType === "suspend" ? "Suspend" : "Activate"}
        variant={actionType === "suspend" ? "destructive" : "info"}
        onConfirm={handleAction}
        onCancel={() => { setActionTarget(null); setActionType(null); }}
        loading={submitting}
      />
    </div>
  );
}
