"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Phone,
  Mail,
  Layers,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/src/admin/components/StatusBadge";
import { VerificationTimeline } from "@/src/admin/components/VerificationTimeline";
import { ConfirmDialog } from "@/src/admin/components/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getVenueDetails, acceptVerification, rejectVerification, requestChangesVerification } from "@/src/admin/route";
import type { TimelineStep } from "@/src/admin/components/VerificationTimeline";

// ─── Component ────────────────────────────────────────────────────────────────

export default function VerificationDetailPage({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = use(params);
  const router = useRouter();

  const [venue, setVenue] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review action state
  const [action, setAction] = useState<"approve" | "reject" | "changes" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVenueDetails(venueId);
        console.log(data)
        setVenue(data);
      } catch (e: any) {
        setError(e.message ?? "Venue not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [venueId]);

  const handleActionSubmit = async () => {
    if (!reviewNotes.trim()) {
      setSubmitError("Please enter review notes before submitting.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (action === "approve") {
        await acceptVerification(venueId, reviewNotes);
      } else if (action === "changes") {
        await requestChangesVerification(venueId, reviewNotes);
      } else {
        await rejectVerification(venueId, reviewNotes);
      }
      setSubmitted(true);
      setConfirmOpen(false);
    } catch (e: any) {
      setSubmitError(e.message ?? "Action failed. Please try again.");
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  // Build timeline from available data
  const buildTimeline = (v: any): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        status: "SUBMITTED",
        label: "Venue Submitted",
        timestamp: v?.createdAt
          ? new Date(v.createdAt).toLocaleDateString("en-IN")
          : undefined,
        completed: true,
      },
      {
        status: "UNDER_REVIEW",
        label: "Under Admin Review",
        completed: v?.status !== "PENDING_REVIEW" && v?.status !== "RESUBMITTED",
        active: v?.status === "PENDING_REVIEW" || v?.status === "RESUBMITTED",
      },
    ];

    if (v?.status === "APPROVED") {
      steps.push({
        status: "APPROVED",
        label: "Approved",
        timestamp: v?.updatedAt
          ? new Date(v.updatedAt).toLocaleDateString("en-IN")
          : undefined,
        note: v?.verificationRequests?.[0]?.reviewNotes,
        completed: true,
      });
    } else if (v?.status === "REJECTED") {
      steps.push({
        status: "REJECTED",
        label: "Rejected",
        note: v?.verificationRequests?.[0]?.reviewNotes,
        completed: true,
      });
    } else if (v?.status === "CHANGES_REQUESTED") {
      steps.push({
        status: "CHANGES_REQUESTED",
        label: "Changes Requested",
        note: v?.verificationRequests?.[0]?.reviewNotes,
        completed: true,
      });
    }

    return steps;
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !venue) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1.5 text-[#70706e] hover:text-[#1A1A19]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-8 flex flex-col items-center text-center gap-3">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm font-semibold text-red-700">
            {error ?? "Venue not found"}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/admin/verification")}
            className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
          >
            Return to queue
          </Button>
        </div>
      </div>
    );
  }

  // ── Submitted success ──
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-lg font-bold text-[#1A1A19]">
          {action === "approve" ? "Venue Approved!" : "Review Submitted"}
        </h2>
        <p className="text-sm text-[#70706e] text-center max-w-xs">
          {action === "approve"
            ? `"${venue.venueName}" has been approved and is now visible on the platform.`
            : `Your review notes have been sent to the venue owner.`}
        </p>
        <Button
          onClick={() => router.push("/admin/verification")}
          className="bg-[#0D7377] hover:bg-[#0a5b5e] text-white rounded-xl"
        >
          Back to Queue
        </Button>
      </div>
    );
  }

  const isPending =
    venue.status === "PENDING_REVIEW" || venue.status === "RESUBMITTED" || venue.status === "PENDING";
  const timeline = buildTimeline(venue);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Back + header ── */}
      <div className="flex flex-wrap items-start gap-4 justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-1.5 text-[#70706e] hover:text-[#1A1A19] mb-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Queue
          </Button>
          <h1 className="text-xl font-bold text-[#1A1A19]">{venue.venueName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-3.5 w-3.5 text-[#70706e]" />
            <span className="text-sm text-[#70706e]">
              {venue.city}, {venue.state}
            </span>
            <StatusBadge status={venue.status} size="md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left: venue details ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Images gallery */}
          {venue.images && venue.images.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
                <h3 className="font-semibold text-sm text-[#1A1A19]">Gallery</h3>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {venue.images.slice(0, 6).map((img: any, i: number) => (
                  <div
                    key={i}
                    className="aspect-video rounded-xl bg-[#F0F0EC] overflow-hidden"
                  >
                    <img
                      src={img.imageUrl ?? img.url ?? img}
                      alt={`Venue image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {venue.images.length === 0 && (
                  <div className="aspect-video rounded-xl bg-[#F0F0EC] flex items-center justify-center col-span-3">
                    <span className="text-xs text-[#70706e]">No images uploaded</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Core details */}
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
              <h3 className="font-semibold text-sm text-[#1A1A19]">Venue Details</h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DetailRow icon={<Layers className="h-4 w-4" />} label="Type" value={venue.venueType} />
              <DetailRow icon={<Users className="h-4 w-4" />} label="Max Capacity" value={`${venue.maxCapacity?.toLocaleString()} guests`} />
              <DetailRow icon={<DollarSign className="h-4 w-4" />} label="Starting Price" value={`₹${venue.startingPrice?.toLocaleString("en-IN")}`} />
              <DetailRow icon={<Calendar className="h-4 w-4" />} label="Booking Type" value={venue.bookingType} />
              <DetailRow icon={<Car className="h-4 w-4" />} label="Parking" value={venue.hasParking ? `Yes (${venue.parkingCapacity ?? "??"} slots)` : "No"} />
              <DetailRow icon={<MapPin className="h-4 w-4" />} label="Address" value={`${venue.address}, ${venue.city} - ${venue.pincode}`} />
            </div>
            {venue.description && (
              <div className="px-5 pb-5">
                <p className="text-xs font-bold text-[#70706e] uppercase tracking-wide mb-2">
                  Description
                </p>
                <p className="text-sm text-[#1A1A19] leading-relaxed">
                  {venue.description}
                </p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
              <h3 className="font-semibold text-sm text-[#1A1A19]">Documents</h3>
            </div>
            <div className="p-5">
              {venue.documents && venue.documents.length > 0 ? (
                <div className="space-y-2">
                  {venue.documents.map((doc: any, i: number) => (
                    <a
                      key={i}
                      href={doc.documentUrl ?? doc.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#F0F0EC] rounded-xl hover:bg-[#E6F1F1] transition-colors group"
                    >
                      <FileText className="h-5 w-5 text-[#0D7377] shrink-0" />
                      <span className="text-sm font-medium text-[#1A1A19] flex-1 truncate">
                        {doc.documentType ?? `Document ${i + 1}`}
                      </span>
                      <span className="text-xs text-[#0D7377] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Open ↗
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#70706e] text-center py-4">
                  No documents uploaded yet
                </p>
              )}
            </div>
          </div>

          {/* Onboarding checklist */}
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
              <h3 className="font-semibold text-sm text-[#1A1A19]">Onboarding Checklist</h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Basic Info", done: venue.stepVenueInfoDone },
                { label: "Photos", done: venue.stepPhotosDone },
                { label: "Facilities", done: venue.stepFacilitiesDone },
                { label: "Documents", done: venue.stepDocumentsDone },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4.5 w-4.5 text-[#E2E2DE] shrink-0" />
                  )}
                  <span
                    className={`text-sm ${done ? "text-[#1A1A19] font-medium" : "text-[#70706e]"}`}
                  >
                    {label}
                  </span>
                  {done && (
                    <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Review action panel (only if pending) ── */}
          {isPending && (
            <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
              <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
                <h3 className="font-semibold text-sm text-[#1A1A19]">
                  Admin Review
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Action selector */}
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      value: "approve" as const,
                      label: "Approve",
                      icon: CheckCircle,
                      active:
                        "bg-emerald-500 text-white border-emerald-500",
                      inactive:
                        "border-[#E2E2DE] text-[#70706e] hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300",
                    },
                    {
                      value: "reject" as const,
                      label: "Reject",
                      icon: XCircle,
                      active: "bg-red-500 text-white border-red-500",
                      inactive:
                        "border-[#E2E2DE] text-[#70706e] hover:bg-red-50 hover:text-red-700 hover:border-red-300",
                    },
                    {
                      value: "changes" as const,
                      label: "Request Changes",
                      icon: MessageSquare,
                      active:
                        "bg-blue-500 text-white border-blue-500",
                      inactive:
                        "border-[#E2E2DE] text-[#70706e] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300",
                    },
                  ].map(({ value, label, icon: Icon, active, inactive }) => (
                    <button
                      key={value}
                      onClick={() => setAction(value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${action === value ? active : inactive
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Review notes */}
                {action && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-[#70706e] uppercase tracking-wide block mb-1.5">
                        Review Notes{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder={
                          action === "approve"
                            ? "Optional notes for the venue owner…"
                            : action === "reject"
                              ? "Reason for rejection (visible to owner)…"
                              : "Describe the changes required…"
                        }
                        rows={4}
                        className="w-full rounded-xl border border-[#E2E2DE] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1A1A19] placeholder:text-[#70706e] focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] resize-none transition"
                      />
                    </div>

                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {submitError}
                      </div>
                    )}

                    <Button
                      onClick={handleActionSubmit}
                      disabled={submitting}
                      className={`rounded-xl font-semibold gap-2 ${action === "approve"
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : action === "reject"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                      {submitting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {action === "approve"
                        ? "Submit Approval"
                        : action === "reject"
                          ? "Submit Rejection"
                          : "Send Change Request"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-5">

          {/* Owner info */}
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
              <h3 className="font-semibold text-sm text-[#1A1A19]">Venue Owner</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#E6F1F1] text-[#0D7377] flex items-center justify-center text-sm font-bold shrink-0">
                  {venue.owner?.name?.[0]?.toUpperCase() ?? "O"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#1A1A19] text-sm truncate">
                    {venue.owner?.name ?? "—"}
                  </p>
                  <p className="text-[11px] text-[#70706e]">Venue Owner</p>
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <OwnerRow
                  icon={<Mail className="h-3.5 w-3.5" />}
                  value={venue.owner?.email ?? "—"}
                />
                <OwnerRow
                  icon={<Phone className="h-3.5 w-3.5" />}
                  value={venue.owner?.phone ?? "—"}
                />
                <OwnerRow
                  icon={<User className="h-3.5 w-3.5" />}
                  value={`ID: ${venue.ownerId?.slice(0, 8)}…`}
                />
              </div>
            </div>
          </div>

          {/* Verification timeline */}
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
              <h3 className="font-semibold text-sm text-[#1A1A19]">
                Verification Timeline
              </h3>
            </div>
            <div className="p-5">
              <VerificationTimeline steps={timeline} />
            </div>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title={
          action === "approve"
            ? "Approve this venue?"
            : action === "reject"
              ? "Reject this venue?"
              : "Send change request?"
        }
        description={
          action === "approve"
            ? `"${venue.venueName}" will be made live on the platform. The owner will be notified.`
            : action === "reject"
              ? `The venue will be marked as rejected. The owner will receive your review notes.`
              : `The owner will be notified with your requested changes.`
        }
        confirmLabel={
          action === "approve"
            ? "Yes, Approve"
            : action === "reject"
              ? "Yes, Reject"
              : "Send Request"
        }
        variant={
          action === "reject"
            ? "destructive"
            : action === "changes"
              ? "warning"
              : "info"
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={submitting}
      />
    </div>
  );
}

// ─── Small helper sub-components ─────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#70706e] uppercase tracking-wide flex items-center gap-1.5 mb-0.5">
        <span className="text-[#0D7377]">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-semibold text-[#1A1A19]">{value ?? "—"}</p>
    </div>
  );
}

function OwnerRow({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#70706e]">
      <span className="text-[#0D7377] shrink-0">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}
