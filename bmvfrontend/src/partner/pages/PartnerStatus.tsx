"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, clearSession, UserSession } from "@/src/lib/authStore";
import { apiFetch } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  LogOut,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Building2,
  MapPin,
  Users,
  Camera,
  FileText,
  Coins,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Edit3,
  Shield,
  Sparkles,
  BadgeCheck,
  Info,
} from "lucide-react";
import { LogoTicket } from "@/components/Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

type VenueStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "RESUBMITTED"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "REJECTED";

interface VenueData {
  id: string;
  venueName: string;
  venueType: string;
  description: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  maxCapacity: number;
  squareFeet: number;
  startingPrice: string;
  bookingType: string;
  hasParking: boolean;
  parkingCapacity?: number;
  status: VenueStatus;
  reviewNotes?: string;
  stepVenueInfoDone: boolean;
  stepPhotosDone: boolean;
  stepDocumentsDone: boolean;
  stepFacilitiesDone: boolean;
}

interface OnboardingStatus {
  canSubmit: boolean;
  steps: {
    venueInfo: boolean;
    photos: boolean;
    documents: boolean;
  };
  photosCount?: number;
  documentsCount?: number;
}

// ─── Status Config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  VenueStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    headline: string;
    subtext: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    color: "text-neutral-500",
    bg: "bg-neutral-50",
    border: "border-neutral-200",
    icon: <Edit3 className="h-5 w-5" />,
    headline: "Submission Incomplete",
    subtext: "Please complete your onboarding to submit for review.",
  },
  PENDING_REVIEW: {
    label: "Under Review",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Clock className="h-5 w-5" />,
    headline: "Application Under Review",
    subtext:
      "Our team is carefully reviewing your submission. This typically takes 1–3 business days.",
  },
  RESUBMITTED: {
    label: "Resubmitted",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: <Clock className="h-5 w-5" />,
    headline: "Application Resubmitted",
    subtext:
      "Your updated application has been resubmitted. Our team is reviewing the changes.",
  },
  APPROVED: {
    label: "Approved",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <BadgeCheck className="h-5 w-5" />,
    headline: "Application Approved!",
    subtext: "Your venue has been verified. Welcome to the partner network!",
  },
  CHANGES_REQUESTED: {
    label: "Changes Required",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: <AlertTriangle className="h-5 w-5" />,
    headline: "Changes Requested",
    subtext:
      "Our admin has reviewed your submission and requires some changes before approval.",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <XCircle className="h-5 w-5" />,
    headline: "Application Rejected",
    subtext:
      "Unfortunately your application did not meet our current listing requirements.",
  },
};

// ─── Progress steps definition ─────────────────────────────────────────────────

const PROGRESS_STEPS = [
  { key: "registered", label: "Registered" },
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
];

function getActiveProgressStep(status: VenueStatus): number {
  switch (status) {
    case "DRAFT":
      return 0;
    case "PENDING_REVIEW":
      return 2;
    case "RESUBMITTED":
      return 2;
    case "CHANGES_REQUESTED":
      return 2;
    case "APPROVED":
      return 3;
    case "REJECTED":
      return 2;
    default:
      return 0;
  }
}

// ─── Withdraw Modal ────────────────────────────────────────────────────────────

function WithdrawModal({
  onClose,
  onConfirm,
  isLoading,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-neutral-light animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-neutral-dark text-lg leading-tight">
              Withdraw Submission?
            </h3>
            <p className="text-xs text-neutral-muted">
              This action cannot be undone easily
            </p>
          </div>
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed">
          Withdrawing your submission will move your venue back to{" "}
          <strong>Draft</strong> status. You will need to re-submit for admin
          review. All your entered details will be preserved.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5">
          <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Our admin team will be notified of your withdrawal and the review
            process will be paused.
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-neutral-light text-neutral-dark font-semibold hover:bg-neutral-light/50"
            onClick={onClose}
            disabled={isLoading}
          >
            Keep Submission
          </Button>
          <Button
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Withdrawing…
              </>
            ) : (
              "Yes, Withdraw"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Row ────────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-neutral-light/60 last:border-0">
      <span className="text-xs font-bold text-neutral-muted uppercase tracking-wide w-36 shrink-0">
        {label}
      </span>
      <span className="text-xs text-neutral-dark font-medium text-right flex-1">
        {value ?? <span className="text-neutral-300 italic">Not provided</span>}
      </span>
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-neutral-light bg-neutral-light/20">
        <div className="h-7 w-7 rounded-lg bg-teal-light flex items-center justify-center text-teal-primary">
          {icon}
        </div>
        <span className="font-serif font-bold text-sm text-neutral-dark">
          {title}
        </span>
      </div>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function PartnerStatus() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const myVenue = await apiFetch<VenueData>("/venues/my-venue");
      setVenue(myVenue);

      // If approved → redirect to dashboard
      if (myVenue.status === "APPROVED") {
        router.push("/partner/dashboard");
        return;
      }
      // If draft → redirect to onboarding
      if (myVenue.status === "DRAFT") {
        router.push("/partner/onboarding");
        return;
      }

      // Fetch step progress counts
      try {
        const status = await apiFetch<OnboardingStatus>(
          `/venues/${myVenue.id}/onboarding-status`
        );
        setOnboardingStatus(status);
      } catch {
        // Non-critical, ignore
      }
    } catch (err: any) {
      if (
        err.message?.includes("404") ||
        err.message?.includes("not found") ||
        err.message?.includes("No venue found")
      ) {
        router.push("/partner/onboarding");
        return;
      }
      setFetchError(err.message || "Failed to load your submission details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession || activeSession.role !== "venue_owner") {
      router.push("/partner/login");
      return;
    }
    setSession(activeSession);
    loadData();
  }, [router]);

  // ─── Withdraw handler ────────────────────────────────────────────────────────

  const handleWithdraw = async () => {
    if (!venue) return;
    setWithdrawLoading(true);
    try {
      // Call the withdraw endpoint — sets venue back to DRAFT
      await apiFetch(`/venues/${venue.id}/withdraw`, { method: "POST" });
      setWithdrawSuccess(true);
      setShowWithdraw(false);
      // After a moment redirect to onboarding
      setTimeout(() => router.push("/partner/onboarding"), 1800);
    } catch (err: any) {
      // Graceful fallback — just go to onboarding
      setShowWithdraw(false);
      router.push("/partner/onboarding");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push("/partner/login");
  };

  // ─── Render loading ──────────────────────────────────────────────────────────

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] font-sans">
        <Loader2 className="h-6 w-6 animate-spin text-teal-primary mr-2" />
        <p className="text-neutral-muted text-sm font-semibold">
          Loading your submission…
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] gap-4 font-sans">
        <XCircle className="h-10 w-10 text-red-400" />
        <p className="text-neutral-dark font-semibold">{fetchError}</p>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => loadData()}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  if (!venue) return null;

  const statusCfg = STATUS_CONFIG[venue.status] ?? STATUS_CONFIG["PENDING_REVIEW"];
  const activeStep = getActiveProgressStep(venue.status);
  const isEditable =
    venue.status === "CHANGES_REQUESTED";
  const canWithdraw = venue.status === "PENDING_REVIEW" || venue.status === "RESUBMITTED";

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col font-sans">

      {/* Header */}
      <header className="bg-white border-b border-neutral-light h-16 flex items-center justify-between px-6 shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-block">
            <LogoTicket />
          </Link>
          <span className="text-[9px] uppercase font-bold tracking-wider bg-neutral-dark text-white px-2 py-0.5 rounded-md">
            Partner Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-xs">
            <span className="font-bold text-neutral-dark block">{session.name}</span>
            <span className="text-neutral-muted block">Venue Owner</span>
          </div>
          <div className="h-8 w-px bg-neutral-light" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-neutral-muted hover:text-destructive flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Withdraw success banner */}
      {withdrawSuccess && (
        <div className="bg-teal-primary text-white text-sm font-semibold px-6 py-3 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="h-4 w-4" />
          Submission withdrawn. Redirecting to onboarding…
        </div>
      )}

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-neutral-dark">
              Submission Status
            </h1>
            <p className="text-xs text-neutral-muted mt-0.5">
              Track your venue application through the review process
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            {canWithdraw && (
              <Button
                variant="outline"
                onClick={() => setShowWithdraw(true)}
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs h-9 px-4"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Withdraw Submission
              </Button>
            )}
            {isEditable && (
              <Button
                onClick={() => router.push("/partner/onboarding")}
                className="rounded-xl bg-teal-primary text-white hover:bg-teal-hover font-semibold text-xs h-9 px-4 shadow-md shadow-teal-primary/20"
              >
                <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                Modify & Resubmit
              </Button>
            )}
          </div>
        </div>

        {/* Progress tracker */}
        <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between relative">
              {/* connector line */}
              <div className="absolute top-5 left-[12%] right-[12%] h-0.5 bg-neutral-light z-0" />
              <div
                className="absolute top-5 left-[12%] h-0.5 bg-teal-primary z-0 transition-all duration-700"
                style={{
                  width: `${(activeStep / (PROGRESS_STEPS.length - 1)) * 76}%`,
                }}
              />

              {PROGRESS_STEPS.map((ps, idx) => {
                const done = idx < activeStep;
                const active = idx === activeStep;
                const failed =
                  (venue.status === "REJECTED" || venue.status === "CHANGES_REQUESTED") &&
                  idx === activeStep;

                return (
                  <div
                    key={ps.key}
                    className="flex flex-col items-center gap-2 relative z-10 flex-1"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-xs
                        ${done
                          ? "bg-teal-primary border-teal-primary text-white"
                          : active && venue.status === "REJECTED"
                            ? "bg-red-50 border-red-400 text-red-600"
                            : active && venue.status === "CHANGES_REQUESTED"
                              ? "bg-orange-50 border-orange-400 text-orange-600"
                              : active
                                ? "bg-amber-50 border-amber-400 text-amber-600 ring-4 ring-amber-100"
                                : "bg-white border-neutral-200 text-neutral-400"
                        }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : active && venue.status === "REJECTED" ? (
                        <XCircle className="h-5 w-5" />
                      ) : active && venue.status === "CHANGES_REQUESTED" ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : active ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold text-center uppercase tracking-wide
                        ${done ? "text-teal-primary" : active ? statusCfg.color : "text-neutral-400"}`}
                    >
                      {ps.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status banner */}
        <div
          className={`rounded-2xl border ${statusCfg.border} ${statusCfg.bg} p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center`}
        >
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${statusCfg.color} bg-white border ${statusCfg.border}`}>
            {statusCfg.icon}
          </div>
          <div className="flex-1">
            <span className={`text-[10px] uppercase font-bold tracking-widest ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            <h2 className="font-serif text-xl font-bold text-neutral-dark mt-0.5">
              {statusCfg.headline}
            </h2>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              {statusCfg.subtext}
            </p>
          </div>

          {/* Pulsing dot for pending */}
          {(venue.status === "PENDING_REVIEW" || venue.status === "RESUBMITTED") && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
              <span className="text-xs font-semibold text-amber-600">
                In Progress
              </span>
            </div>
          )}
        </div>

        {/* Admin review notes – for CHANGES_REQUESTED or REJECTED */}
        {(venue.status === "CHANGES_REQUESTED" || venue.status === "REJECTED") &&
          venue.reviewNotes && (
            <div
              className={`rounded-2xl border p-5 space-y-2
                ${venue.status === "REJECTED"
                  ? "bg-red-50 border-red-200"
                  : "bg-orange-50 border-orange-200"
                }`}
            >
              <div className="flex items-center gap-2">
                <Shield
                  className={`h-4 w-4 ${venue.status === "REJECTED"
                    ? "text-red-500"
                    : "text-orange-500"
                    }`}
                />
                <span
                  className={`text-xs font-bold uppercase tracking-wide ${venue.status === "REJECTED"
                    ? "text-red-600"
                    : "text-orange-600"
                    }`}
                >
                  Admin Feedback
                </span>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed pl-6">
                {venue.reviewNotes}
              </p>
            </div>
          )}

        {/* Venue details — read-only grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Venue Info */}
          <SectionCard icon={<Building2 className="h-4 w-4" />} title="Venue Information">
            <DetailRow label="Venue Name" value={venue.venueName} />
            <DetailRow label="Venue Type" value={venue.venueType} />
            <DetailRow label="Description" value={venue.description} />
            <DetailRow label="Booking Type" value={venue.bookingType} />
          </SectionCard>

          {/* Location */}
          <SectionCard icon={<MapPin className="h-4 w-4" />} title="Location">
            <DetailRow label="Address" value={venue.address} />
            <DetailRow label="City" value={venue.city} />
            <DetailRow label="District" value={venue.district} />
            <DetailRow label="State" value={venue.state} />
            <DetailRow label="Pincode" value={venue.pincode} />
          </SectionCard>

          {/* Capacity & Size */}
          <SectionCard icon={<Users className="h-4 w-4" />} title="Capacity & Size">
            <DetailRow
              label="Max Capacity"
              value={venue.maxCapacity ? `${venue.maxCapacity} guests` : undefined}
            />
            <DetailRow
              label="Area"
              value={venue.squareFeet ? `${venue.squareFeet} sq. ft.` : undefined}
            />
            <DetailRow
              label="Parking"
              value={venue.hasParking ? `Yes — ${venue.parkingCapacity ?? "?"} vehicles` : "No Parking"}
            />
          </SectionCard>

          {/* Pricing */}
          <SectionCard icon={<Coins className="h-4 w-4" />} title="Pricing">
            <DetailRow
              label="Starting Price"
              value={
                venue.startingPrice
                  ? `₹${Number(venue.startingPrice).toLocaleString("en-IN")}`
                  : undefined
              }
            />
          </SectionCard>

        </div>

        {/* Media & Documents submission counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-light flex items-center justify-center text-teal-primary shrink-0">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-muted tracking-wide block">
                  Photos Uploaded
                </span>
                <span className="text-2xl font-bold text-neutral-dark font-sans">
                  {onboardingStatus?.photosCount ?? "—"}
                </span>
                <span className="text-[10px] text-neutral-muted block mt-0.5">
                  {venue.stepPhotosDone ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Step Completed
                    </span>
                  ) : (
                    "Step Incomplete"
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-light shadow-xs bg-white rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-light flex items-center justify-center text-amber-cta shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-muted tracking-wide block">
                  Documents Submitted
                </span>
                <span className="text-2xl font-bold text-neutral-dark font-sans">
                  {onboardingStatus?.documentsCount ?? "—"}
                </span>
                <span className="text-[10px] text-neutral-muted block mt-0.5">
                  {venue.stepDocumentsDone ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Step Completed
                    </span>
                  ) : (
                    "Step Incomplete"
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA for CHANGES_REQUESTED */}
        {isEditable && (
          <div className="bg-gradient-to-br from-teal-primary/10 to-amber-cta/10 border border-teal-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-teal-primary flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-serif font-bold text-neutral-dark">
                Ready to make changes?
              </h3>
              <p className="text-xs text-neutral-muted mt-0.5">
                Address the admin feedback above and resubmit. Your previous
                data is pre-filled in the wizard.
              </p>
            </div>
            <Button
              onClick={() => router.push("/partner/onboarding")}
              className="rounded-xl bg-teal-primary text-white hover:bg-teal-hover font-semibold shadow-md shadow-teal-primary/20 flex items-center gap-1.5 shrink-0"
            >
              Open Editor
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Rejected contact */}
        {venue.status === "REJECTED" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2">
            <XCircle className="h-10 w-10 text-red-400 mx-auto" />
            <h3 className="font-serif font-bold text-neutral-dark">
              Application Not Approved
            </h3>
            <p className="text-xs text-neutral-muted">
              If you believe this is an error, please contact our support team
              at{" "}
              <a
                href="mailto:support@bookmyvenue.in"
                className="text-teal-primary underline font-semibold"
              >
                support@bookmyvenue.in
              </a>
            </p>
          </div>
        )}

      </main>

      {/* Withdraw modal */}
      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onConfirm={handleWithdraw}
          isLoading={withdrawLoading}
        />
      )}
    </div>
  );
}
