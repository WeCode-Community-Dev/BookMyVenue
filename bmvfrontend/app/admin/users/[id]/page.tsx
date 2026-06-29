"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/src/admin/components/StatusBadge";
import { ConfirmDialog } from "@/src/admin/components/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCustomerDetails,
  getVenueOwnerDetails,
  updateUser,
} from "@/src/admin/route";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Action state
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [actioning, setActioning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Try customer first, then owner
      try {
        const data = await getCustomerDetails(id);
        setUser(data);
      } catch {
        try {
          const data = await getVenueOwnerDetails(id);
          setUser(data);
        } catch (e: any) {
          setError(e.message ?? "User not found.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (user) {
      setEditName(user.name ?? "");
      setEditPhone(user.phone ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSaveEdit = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateUser(id, { name: editName, phone: editPhone });
      setUser((prev: any) => ({ ...prev, ...updated }));
      setEditing(false);
      setToast("User details updated successfully.");
    } catch (e: any) {
      setSaveError(e.message ?? "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    setActioning(true);
    try {
      await updateUser(id, { isActive: !user.isActive });
      setUser((prev: any) => ({ ...prev, isActive: !prev.isActive }));
      setToast(`User ${user.isActive ? "suspended" : "activated"} successfully.`);
    } catch (e: any) {
      setToast(`Error: ${e.message}`);
    } finally {
      setActioning(false);
      setSuspendOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 rounded-2xl" />
          </div>
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5 text-[#70706e]">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-8 flex flex-col items-center gap-3">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm font-semibold text-red-700">{error ?? "User not found"}</p>
        </div>
      </div>
    );
  }

  const isOwner = user.role === "venue_owner" || !!user.venueDetail;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Back + header */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5 text-[#70706e] hover:text-[#1A1A19] mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#E6F1F1] text-[#0D7377] flex items-center justify-center text-lg font-bold">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A19]">{user.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={isOwner ? "venue_owner" : "customer"} />
              <StatusBadge status={user.isActive ? "active" : "inactive"} />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
              className="border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl gap-1.5 h-9"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </Button>
            {user.isActive ? (
              <Button size="sm" variant="outline"
                onClick={() => setSuspendOpen(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl gap-1.5 h-9">
                <UserX className="h-3.5 w-3.5" /> Suspend
              </Button>
            ) : (
              <Button size="sm"
                onClick={handleToggleActive}
                disabled={actioning}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-1.5 h-9">
                {actioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                Activate
              </Button>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Details + edit */}
        <div className="lg:col-span-2 space-y-5">

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#E2E2DE] flex items-center justify-between">
              <h2 className="font-semibold text-sm text-[#1A1A19]">Basic Information</h2>
            </div>

            {editing ? (
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#70706e] uppercase tracking-wide block mb-1.5">Full Name</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="rounded-xl border-[#E2E2DE] h-10" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#70706e] uppercase tracking-wide block mb-1.5">Phone</label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                    className="rounded-xl border-[#E2E2DE] h-10" />
                </div>
                {saveError && (
                  <div className="text-sm text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> {saveError}
                  </div>
                )}
                <div className="flex gap-3 pt-1">
                  <Button onClick={handleSaveEdit} disabled={saving}
                    className="bg-[#0D7377] hover:bg-[#0a5b5e] text-white rounded-xl gap-1.5">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}
                    className="border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <UserInfoRow icon={<User className="h-4 w-4" />} label="Full Name" value={user.name} />
                <UserInfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                <UserInfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone ?? "—"} />
                <UserInfoRow icon={<Calendar className="h-4 w-4" />} label="User ID" value={user.id?.slice(0, 12) + "…"} />
                <UserInfoRow icon={user.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  label="Account Status" value={user.isActive ? "Active" : "Suspended"} />
                {user.profile && (
                  <UserInfoRow icon={<User className="h-4 w-4" />} label="Profile"
                    value={user.profile.bio ?? "No bio provided"} />
                )}
              </div>
            )}
          </div>

          {/* Venue details (owner only) */}
          {isOwner && user.venueDetail && (
            <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
              <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
                <h2 className="font-semibold text-sm text-[#1A1A19]">Venue Owned</h2>
              </div>
              <div className="p-5">
                <Link href={`/admin/venues/${user.venueDetail.id}`}
                  className="flex items-center gap-3 p-3 bg-[#F0F0EC] rounded-xl hover:bg-[#E6F1F1] transition-colors group">
                  <div className="h-10 w-10 rounded-xl bg-[#E6F1F1] text-[#0D7377] flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1A19] text-sm truncate">
                      {user.venueDetail.venueName}
                    </p>
                    <p className="text-[11px] text-[#70706e]">
                      {user.venueDetail.venueType} · {user.venueDetail.city}
                    </p>
                  </div>
                  <StatusBadge status={user.venueDetail.status} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Account summary */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#1A1A19]">Account Summary</h3>
            <div className="space-y-3">
              <SummaryRow label="Role" value={isOwner ? "Venue Owner" : "Customer"} />
              <SummaryRow label="Status" value={user.isActive ? "Active" : "Suspended"} valueColor={user.isActive ? "text-emerald-600" : "text-red-500"} />
              <SummaryRow label="Profile Complete" value={user.isProfileCompleted ? "Yes" : "No"} valueColor={user.isProfileCompleted ? "text-emerald-600" : "text-amber-600"} />
              <SummaryRow label="User ID" value={user.id?.slice(0, 16) + "…"} mono />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-1">Note</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Booking history and activity logs will be available once the analytics module is connected to the backend.
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={suspendOpen}
        title="Suspend this user?"
        description={`${user.name} will lose access to the platform. You can reactivate their account at any time.`}
        confirmLabel="Suspend"
        variant="destructive"
        onConfirm={handleToggleActive}
        onCancel={() => setSuspendOpen(false)}
        loading={actioning}
      />
    </div>
  );
}

function UserInfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#70706e] uppercase tracking-wide flex items-center gap-1.5 mb-0.5">
        <span className="text-[#0D7377]">{icon}</span>{label}
      </p>
      <p className="text-sm font-semibold text-[#1A1A19]">{value ?? "—"}</p>
    </div>
  );
}

function SummaryRow({ label, value, valueColor = "text-[#1A1A19]", mono = false }: {
  label: string; value: string; valueColor?: string; mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#70706e]">{label}</span>
      <span className={`text-xs font-semibold ${valueColor} ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
