"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MapPin, Users, ArrowLeft, Plus, Clock, CalendarDays, CheckCircle2,
  ShieldAlert, Loader2, Pencil, History, Timer,
} from "lucide-react";

// ---------------------------------------------------------------------------
// ⚠️ ENDPOINT PATHS
// ---------------------------------------------------------------------------
const API_BASE = "http://localhost:8080/api/owner";

// GET single venue / PUT to update it (confirm PUT path + payload shape with backend)
const venueDetailUrl = (venueId: string) => `${API_BASE}/venue/${venueId}`;

// Availability rules — matches VenueAvailabilityRulesController
const rulesBase = (venueId: string) => `${API_BASE}/venue/${venueId}/availability-rules`;
const activeRuleUrl = (venueId: string) => `${rulesBase(venueId)}/active`;
const upcomingRuleUrl = (venueId: string) => `${rulesBase(venueId)}/upcoming`;
const historyRuleUrl = (venueId: string) => `${rulesBase(venueId)}/history`;
const createRuleUrl = (venueId: string) => rulesBase(venueId);
const updateRuleUrl = (venueId: string, ruleId: number) => `${rulesBase(venueId)}/${ruleId}`;

// Exceptions — matches VenueAvailabilityExceptionController
const exceptionsBase = (venueId: string) => `${API_BASE}/venue/${venueId}/exceptions`;
const createExceptionUrl = (venueId: string) => exceptionsBase(venueId);
const listExceptionsUrl = (venueId: string) => exceptionsBase(venueId);
const cancelExceptionUrl = (venueId: string, exceptionId: number) =>
  `${exceptionsBase(venueId)}/${exceptionId}/cancel`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AvailabilityRule {
  id: number;
  venueId: number;

  durationType: "HOURLY" | "HALF_DAY" | "FULL_DAY";
  durationHour: number | null;

  weekStartDay: string;
  weekEndDay: string;

  operatingStartTime: string;
  operatingEndTime: string;

  weekdayDayRate: number | null;
  weekdayNightRate: number | null;
  weekendDayRate: number | null;
  weekendNightRate: number | null;

  effectiveFrom: string;
  status: "ACTIVE" | "UPCOMING" | "EXPIRED" | string;
}

interface AvailabilityRuleFormPayload {
  durationType: "HOURLY" | "HALF_DAY" | "FULL_DAY";
  durationHour: number | null;

  weekStartDay: string;
  weekEndDay: string;

  operatingStartTime: string;
  operatingEndTime: string;

  weekdayDayRate: number;
  weekdayNightRate: number;
  weekendDayRate: number;
  weekendNightRate: number;
}

// Assumed shape for VenueAvailabilityExceptionResponse — DTO wasn't shared,
// adjust field names below if they differ on the backend.
interface AvailabilityException {
  id: number;
  venueId: number;
  exceptionDate: string; // "YYYY-MM-DD"
  closed: boolean;
  openingTime: string | null;
  closingTime: string | null;
  reason: string | null;
  status?: string; // e.g. "ACTIVE" | "CANCELLED" — assumed, since there's no delete
}

// Assumed shape for VenueAvailabilityExceptionRequest
interface AvailabilityExceptionFormPayload {
  exceptionDate: string;
  closed: boolean;
  openingTime: string | null;
  closingTime: string | null;
  reason: string;
}

interface VenueDetail {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  imageFiles: string[] | null;
  venueAvailabiltyRulesResponse: AvailabilityRule | null;
  venueType: string;
  parking: boolean;
  seatingCapacity: number;
  amenities: string[];
}

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
  FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const WEEKDAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

function formatTime(t: string | null) {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${period}`;
}

function formatDate(d?: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

export default function VenueDetailPage() {
  const router = useRouter();
  const params = useParams();
  const venueId = params?.id as string;

  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Edit Venue state ----
  const [isEditVenueOpen, setIsEditVenueOpen] = useState(false);
  const [isSavingVenue, setIsSavingVenue] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editVenueType, setEditVenueType] = useState("");
  const [editSeatingCapacity, setEditSeatingCapacity] = useState("");
  const [editParking, setEditParking] = useState(false);
  const [editAmenities, setEditAmenities] = useState(""); // comma-separated in the UI

  // ---- Availability rules state ----
  const [activeRule, setActiveRule] = useState<AvailabilityRule | null>(null);
  const [upcomingRule, setUpcomingRule] = useState<AvailabilityRule | null>(null);
  const [ruleHistory, setRuleHistory] = useState<AvailabilityRule[]>([]);
  const [rulesLoading, setRulesLoading] = useState(true);

  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isSubmittingRule, setIsSubmittingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null); // null = creating new rule

  // New/edit rule form state
const [durationType, setDurationType] = useState<"HOURLY" | "HALF_DAY" | "FULL_DAY">("HOURLY");
const [durationHour, setDurationHour] = useState("2");

const [weekStartDay, setWeekStartDay] = useState("MONDAY");
const [weekEndDay, setWeekEndDay] = useState("FRIDAY");

const [operatingStartTime, setOperatingStartTime] = useState("09:00");
const [operatingEndTime, setOperatingEndTime] = useState("18:00");

const [weekdayDayRate, setWeekdayDayRate] = useState("");
const [weekdayNightRate, setWeekdayNightRate] = useState("");
const [weekendDayRate, setWeekendDayRate] = useState("");
const [weekendNightRate, setWeekendNightRate] = useState("");

  // ---- Exception rules state ----
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [exceptionsLoading, setExceptionsLoading] = useState(true);
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [isSubmittingException, setIsSubmittingException] = useState(false);
  const [cancellingExceptionId, setCancellingExceptionId] = useState<number | null>(null);

  // New exception form state
  const [exceptionDate, setExceptionDate] = useState("");
  const [exceptionClosed, setExceptionClosed] = useState(true);
  const [exceptionOpeningTime, setExceptionOpeningTime] = useState("09:00");
  const [exceptionClosingTime, setExceptionClosingTime] = useState("18:00");
  const [exceptionReason, setExceptionReason] = useState("");

  useEffect(() => {
    if (!venueId) return;
    fetchVenue();
    fetchAllRules();
    fetchExceptions();
  }, [venueId]);

  function authHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async function fetchVenue() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(venueDetailUrl(venueId), { headers: authHeaders() });
      if (!response.ok) {
        throw new Error(`Failed to load venue (${response.status})`);
      }
      const data = await response.json();
      setVenue(data);
      seedEditFormFromVenue(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load venue");
    } finally {
      setLoading(false);
    }
  }

  function seedEditFormFromVenue(v: VenueDetail) {
    setEditName(v.name ?? "");
    setEditDescription(v.description ?? "");
    setEditAddress(v.address ?? "");
    setEditCity(v.city ?? "");
    setEditVenueType(v.venueType ?? "");
    setEditSeatingCapacity(String(v.seatingCapacity ?? ""));
    setEditParking(!!v.parking);
    setEditAmenities((v.amenities ?? []).join(", "));
  }

  // ---------------------------------------------------------------------
  // Availability rules — active / upcoming / history
  // ---------------------------------------------------------------------
  async function fetchAllRules() {
    setRulesLoading(true);
    await Promise.all([fetchActiveRule(), fetchUpcomingRule(), fetchRuleHistory()]);
    setRulesLoading(false);
  }

  async function fetchActiveRule() {
    try {
      const response = await fetch(activeRuleUrl(venueId), { headers: authHeaders() });
      if (!response.ok) throw new Error(`Failed to load active rule (${response.status})`);
      const data = await response.json();
      setActiveRule(data);
    } catch (err) {
      console.error(err);
      setActiveRule(null);
    }
  }

  async function fetchUpcomingRule() {
    try {
      const response = await fetch(upcomingRuleUrl(venueId), { headers: authHeaders() });
      if (response.status === 204) {
        setUpcomingRule(null);
        return;
      }
      if (!response.ok) throw new Error(`Failed to load upcoming rule (${response.status})`);
      const data = await response.json();
      setUpcomingRule(data);
    } catch (err) {
      console.error(err);
      setUpcomingRule(null);
    }
  }

  async function fetchRuleHistory() {
    try {
      const response = await fetch(historyRuleUrl(venueId), { headers: authHeaders() });
      if (!response.ok) throw new Error(`Failed to load rule history (${response.status})`);
      const data = await response.json();
      setRuleHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRuleHistory([]);
    }
  }

function openCreateRuleDialog() {
  setEditingRuleId(null);

  setDurationType("HOURLY");
  setDurationHour("2");

  setWeekStartDay("MONDAY");
  setWeekEndDay("FRIDAY");

  setOperatingStartTime("09:00");
  setOperatingEndTime("18:00");

  setWeekdayDayRate("");
  setWeekdayNightRate("");
  setWeekendDayRate("");
  setWeekendNightRate("");

  setIsRuleDialogOpen(true);
}

function openEditUpcomingRuleDialog() {
  if (!upcomingRule) return;

  setEditingRuleId(upcomingRule.id);

  setDurationType(upcomingRule.durationType);
  setDurationHour(String(upcomingRule.durationHour ?? ""));

  setWeekStartDay(upcomingRule.weekStartDay);
  setWeekEndDay(upcomingRule.weekEndDay);

  setOperatingStartTime(
    (upcomingRule.operatingStartTime || "09:00:00").slice(0, 5)
  );
  setOperatingEndTime(
    (upcomingRule.operatingEndTime || "18:00:00").slice(0, 5)
  );

  setWeekdayDayRate(String(upcomingRule.weekdayDayRate ?? ""));
  setWeekdayNightRate(String(upcomingRule.weekdayNightRate ?? ""));
  setWeekendDayRate(String(upcomingRule.weekendDayRate ?? ""));
  setWeekendNightRate(String(upcomingRule.weekendNightRate ?? ""));

  setIsRuleDialogOpen(true);
}

  const handleSubmitRule = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setIsSubmittingRule(true);

    const payload: AvailabilityRuleFormPayload = {
      durationType,
      durationHour:
        durationType === "HOURLY" ? Number(durationHour) : null,

      weekStartDay,
      weekEndDay,

      operatingStartTime: `${operatingStartTime}:00`,
      operatingEndTime: `${operatingEndTime}:00`,

      weekdayDayRate: Number(weekdayDayRate),
      weekdayNightRate: Number(weekdayNightRate),
      weekendDayRate: Number(weekendDayRate),
      weekendNightRate: Number(weekendNightRate),
    };

    const isEditing = editingRuleId != null;

    const url = isEditing
      ? updateRuleUrl(venueId, editingRuleId!)
      : createRuleUrl(venueId);

    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        body ||
          `Failed to ${isEditing ? "update" : "create"} rule (${response.status})`
      );
    }

    toast.success(
      isEditing ? "Upcoming rule updated." : "New rule scheduled."
    );

    setIsRuleDialogOpen(false);
    fetchAllRules();
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Couldn't save the rule.");
  } finally {
    setIsSubmittingRule(false);
  }
};

  // ---------------------------------------------------------------------
  // Exception rules
  // ---------------------------------------------------------------------
  async function fetchExceptions() {
    try {
      setExceptionsLoading(true);
      const response = await fetch(listExceptionsUrl(venueId), { headers: authHeaders() });
      if (!response.ok) throw new Error(`Failed to load exceptions (${response.status})`);
      const data = await response.json();
      setExceptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setExceptions([]);
    } finally {
      setExceptionsLoading(false);
    }
  }

  function openCreateExceptionDialog() {
    setExceptionDate("");
    setExceptionClosed(true);
    setExceptionOpeningTime("09:00");
    setExceptionClosingTime("18:00");
    setExceptionReason("");
    setIsExceptionDialogOpen(true);
  }

  const handleSubmitException = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingException(true);

      const payload: AvailabilityExceptionFormPayload = {
        exceptionDate,
        closed: exceptionClosed,
        openingTime: exceptionClosed ? null : `${exceptionOpeningTime}:00`,
        closingTime: exceptionClosed ? null : `${exceptionClosingTime}:00`,
        reason: exceptionReason,
      };

      const response = await fetch(createExceptionUrl(venueId), {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Failed to create exception (${response.status})`);
      }

      toast.success("Exception added.");
      setIsExceptionDialogOpen(false);
      fetchExceptions();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Couldn't add the exception.");
    } finally {
      setIsSubmittingException(false);
    }
  };

  const handleCancelException = async (exceptionId: number) => {
    try {
      setCancellingExceptionId(exceptionId);
      const response = await fetch(cancelExceptionUrl(venueId, exceptionId), {
        method: "PUT",
        headers: authHeaders(),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Failed to cancel exception (${response.status})`);
      }

      // Controller returns plain text, not JSON
      await response.text();

      toast.success("Exception cancelled.");
      fetchExceptions();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Couldn't cancel the exception.");
    } finally {
      setCancellingExceptionId(null);
    }
  };

  // ---------------------------------------------------------------------
  // Venue update
  // ---------------------------------------------------------------------
  const handleUpdateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingVenue(true);

      const payload = {
        name: editName,
        description: editDescription,
        address: editAddress,
        city: editCity,
        venueType: editVenueType,
        seatingCapacity: Number(editSeatingCapacity),
        parking: editParking,
        amenities: editAmenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      };

      const response = await fetch(venueDetailUrl(venueId), {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Failed to update venue (${response.status})`);
      }

      const updated = await response.json();
      setVenue((prev) => (prev ? { ...prev, ...updated } : updated));
      toast.success("Venue details updated.");
      setIsEditVenueOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Couldn't update the venue.");
    } finally {
      setIsSavingVenue(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-12 bg-background min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-background min-h-[60vh]">
        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h3 className="font-extrabold text-xl text-foreground">Couldn't load this venue</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          {error || "This listing may have been removed."}
        </p>
        <Button onClick={() => router.push("/host")} className="mt-6 rounded-xl bg-primary text-primary-foreground font-semibold px-6">
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-muted/20 dark:bg-muted/5 min-h-screen">
      <main className="max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">

        {/* Back link + Edit venue */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/host")}
            className="flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to venues
          </button>

          <Button
            onClick={() => setIsEditVenueOpen(true)}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit Venue
          </Button>
        </div>

        {/* Hero image + header */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-[16/6] w-full bg-muted">
            {venue.imageFiles?.[0] ? (
              <img
                src={`http://localhost:8080/${venue.imageFiles[0]}`}
                alt={venue.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                No image uploaded
              </div>
            )}
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-primary/95 text-primary-foreground">
              {venue.venueType?.toUpperCase()}
            </span>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-foreground">{venue.name}</h1>
                <p className="text-sm text-muted-foreground mt-1 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {venue.address}, {venue.city}
                </p>
              </div>
              <div className="flex items-center text-sm font-bold text-foreground bg-secondary px-3 py-1.5 rounded-xl">
                <Users className="h-4 w-4 mr-1.5 text-primary" />
                Up to {venue.seatingCapacity}
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {venue.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/60">
              {venue.parking && (
                <span className="px-2.5 py-1 rounded-full bg-secondary text-foreground/80 text-xxs font-semibold">
                  Parking available
                </span>
              )}
              {venue.amenities?.map((a) => (
                <span key={a} className="px-2.5 py-1 rounded-full bg-secondary text-foreground/80 text-xxs font-semibold">
                  {a.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Availability rules section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-foreground flex items-center">
                <CalendarDays className="h-4.5 w-4.5 text-primary mr-1.5" />
                Availability Rules
              </h3>
              <p className="text-xxs text-muted-foreground mt-1">
                Only one rule governs bookings at a time. Schedule a new rule to take effect automatically.
              </p>
            </div>
            <Button
              onClick={openCreateRuleDialog}
              size="sm"
              className="rounded-xl bg-primary text-primary-foreground font-semibold px-4"
            >
              <Plus className="h-4 w-4 mr-1" />
              Schedule Rule
            </Button>
          </div>

          {rulesLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active rule */}
              <div>
                <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider block mb-2">
                  Currently Active
                </span>
                {activeRule ? (
                  <RuleCard rule={activeRule} highlight />
                ) : (
                  <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                    No active rule yet. Guests can't book until one is scheduled.
                  </div>
                )}
              </div>

              {/* Upcoming rule */}
              <div>
                <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider block mb-2">
                  Upcoming
                </span>
                {upcomingRule ? (
                  <RuleCard
                    rule={upcomingRule}
                    action={
                      <Button
                        onClick={openEditUpcomingRuleDialog}
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-xxs shrink-0"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                    }
                  />
                ) : (
                  <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                    No upcoming rule scheduled.
                  </div>
                )}
              </div>

              {/* History */}
              <div>
                <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider flex items-center mb-2">
                  <History className="h-3.5 w-3.5 mr-1.5" />
                  Rule History
                </span>
                {ruleHistory.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No past rules yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {ruleHistory.map((rule, idx) => (
                      <RuleCard key={rule.id ?? idx} rule={rule} compact />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Exception rules section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-foreground flex items-center">
                <Timer className="h-4.5 w-4.5 text-primary mr-1.5" />
                Exception Rules
              </h3>
              <p className="text-xxs text-muted-foreground mt-1">
                One-off overrides for specific dates — close for the day or set special hours.
              </p>
            </div>
            <Button
              onClick={openCreateExceptionDialog}
              size="sm"
              className="rounded-xl bg-primary text-primary-foreground font-semibold px-4"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Exception
            </Button>
          </div>

          {exceptionsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : exceptions.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">
              No exceptions yet. Add one to override a specific date.
            </div>
          ) : (
            <div className="space-y-2.5">
              {exceptions.map((exception) => {
                const isCancelled = exception.status === "CANCELLED";
                return (
                  <div
                    key={exception.id}
                    className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${isCancelled ? "border-border bg-muted/30 opacity-60" : "border-border bg-background"
                      }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {formatDate(exception.exceptionDate)}
                        </span>
                        {exception.closed ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full">
                            Closed
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Special hours
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            Cancelled
                          </span>
                        )}
                      </div>
                      {!exception.closed && (
                        <span className="flex items-center text-xxs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(exception.openingTime)} – {formatTime(exception.closingTime)}
                        </span>
                      )}
                      {exception.reason && (
                        <p className="text-xxs text-muted-foreground">{exception.reason}</p>
                      )}
                    </div>

                    {!isCancelled && (
                      <Button
                        onClick={() => handleCancelException(exception.id)}
                        variant="outline"
                        size="sm"
                        disabled={cancellingExceptionId === exception.id}
                        className="rounded-xl text-xxs shrink-0"
                      >
                        {cancellingExceptionId === exception.id ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : null}
                        Cancel
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Edit Venue Dialog */}
      <Dialog open={isEditVenueOpen} onOpenChange={setIsEditVenueOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit venue</DialogTitle>
            <DialogDescription className="text-xs">
              Update the listing details guests see. Availability rules are managed separately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateVenue} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-foreground">Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-xl border-border bg-background" required />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-foreground">Description</Label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Address</Label>
                <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="rounded-xl border-border bg-background" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">City</Label>
                <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="rounded-xl border-border bg-background" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Venue type</Label>
                <Input value={editVenueType} onChange={(e) => setEditVenueType(e.target.value)} className="rounded-xl border-border bg-background" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Seating capacity</Label>
                <Input
                  type="number"
                  min={1}
                  value={editSeatingCapacity}
                  onChange={(e) => setEditSeatingCapacity(e.target.value)}
                  className="rounded-xl border-border bg-background"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-foreground">Amenities (comma-separated)</Label>
              <Input
                value={editAmenities}
                onChange={(e) => setEditAmenities(e.target.value)}
                placeholder="wifi, projector, whiteboard"
                className="rounded-xl border-border bg-background"
              />
            </div>

            <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground">
              <Checkbox checked={editParking} onCheckedChange={(c) => setEditParking(!!c)} className="rounded" />
              <span>Parking available on-site</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditVenueOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingVenue}
                className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs px-5"
              >
                {isSavingVenue ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
                Save changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Rule Dialog */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRuleId != null ? "Edit upcoming rule" : "Schedule availability rule"}</DialogTitle>
            <DialogDescription className="text-xs">
              {editingRuleId != null
                ? "This rule hasn't taken effect yet, so you can still change it."
                : "This rule is scheduled to take effect automatically — effective date is set by the server."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRule} className="space-y-5 pt-2">

  {/* Duration */}
  <div className="grid grid-cols-2 gap-3">
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-foreground">
        Duration Type
      </Label>

      <select
        value={durationType}
        onChange={(e) =>
          setDurationType(e.target.value as "HOURLY" | "HALF_DAY" | "FULL_DAY")
        }
        className="w-full rounded-xl border border-border bg-background h-9 px-3 text-xs"
      >
        <option value="HOURLY">Hourly</option>
        <option value="HALF_DAY">Half Day (4 hrs)</option>
        <option value="FULL_DAY">Full Day (8 hrs)</option>
      </select>
    </div>

    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-foreground">
        Duration (Hours)
      </Label>

      <Input
        type="number"
        min={1}
        value={durationType === "HALF_DAY" ? "4" : durationType === "FULL_DAY" ? "8" : durationHour}
        onChange={(e) => setDurationHour(e.target.value)}
        disabled={durationType !== "HOURLY"}
        className="rounded-xl border-border bg-background"
        required={durationType === "HOURLY"}
      />
    </div>
  </div>

  {/* Operating Days */}
  <div className="grid grid-cols-2 gap-3">
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-foreground">
        Start Day
      </Label>

      <select
        value={weekStartDay}
        onChange={(e) => setWeekStartDay(e.target.value)}
        className="w-full rounded-xl border border-border bg-background h-9 px-3 text-xs"
      >
        {WEEKDAYS.map((d) => (
          <option key={d} value={d}>
            {DAY_LABELS[d]}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-foreground">
        End Day
      </Label>

      <select
        value={weekEndDay}
        onChange={(e) => setWeekEndDay(e.target.value)}
        className="w-full rounded-xl border border-border bg-background h-9 px-3 text-xs"
      >
        {WEEKDAYS.map((d) => (
          <option key={d} value={d}>
            {DAY_LABELS[d]}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Operating Time */}
  <div className="grid grid-cols-2 gap-3">
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-foreground">
        Operating Start
      </Label>

      <Input
        type="time"
        value={operatingStartTime}
        onChange={(e) => setOperatingStartTime(e.target.value)}
        className="rounded-xl border-border bg-background"
        required
      />
    </div>

    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-foreground">
        Operating End
      </Label>

      <Input
        type="time"
        value={operatingEndTime}
        onChange={(e) => setOperatingEndTime(e.target.value)}
        className="rounded-xl border-border bg-background"
        required
      />
    </div>
  </div>

  {/* Weekday Rates */}
  <div className="rounded-xl border border-border p-4 space-y-3">
    <h4 className="text-xs font-bold">Weekday Pricing</h4>

    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold">
          Day Rate
        </Label>

        <Input
          type="number"
          min={0}
          step="0.01"
          value={weekdayDayRate}
          onChange={(e) => setWeekdayDayRate(e.target.value)}
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold">
          Night Rate
        </Label>

        <Input
          type="number"
          min={0}
          step="0.01"
          value={weekdayNightRate}
          onChange={(e) => setWeekdayNightRate(e.target.value)}
          className="rounded-xl"
          required
        />
      </div>
    </div>
  </div>

  {/* Weekend Rates */}
  <div className="rounded-xl border border-border p-4 space-y-3">
    <h4 className="text-xs font-bold">Weekend Pricing</h4>

    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold">
          Day Rate
        </Label>

        <Input
          type="number"
          min={0}
          step="0.01"
          value={weekendDayRate}
          onChange={(e) => setWeekendDayRate(e.target.value)}
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold">
          Night Rate
        </Label>

        <Input
          type="number"
          min={0}
          step="0.01"
          value={weekendNightRate}
          onChange={(e) => setWeekendNightRate(e.target.value)}
          className="rounded-xl"
          required
        />
      </div>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-2 pt-2">
    <Button
      type="button"
      variant="outline"
      onClick={() => setIsRuleDialogOpen(false)}
      className="rounded-xl text-xs"
    >
      Cancel
    </Button>

    <Button
      type="submit"
      disabled={isSubmittingRule}
      className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs px-5"
    >
      {isSubmittingRule && (
        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
      )}

      {editingRuleId != null
        ? "Save Changes"
        : "Schedule Rule"}
    </Button>
  </div>

</form>
        </DialogContent>
      </Dialog>

      {/* Add Exception Dialog */}
      <Dialog open={isExceptionDialogOpen} onOpenChange={setIsExceptionDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add exception</DialogTitle>
            <DialogDescription className="text-xs">
              Override a specific date — close the venue entirely or set different hours just for that day.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitException} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-foreground">Date</Label>
              <Input
                type="date"
                value={exceptionDate}
                onChange={(e) => setExceptionDate(e.target.value)}
                className="rounded-xl border-border bg-background"
                required
              />
            </div>

            <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground">
              <Checkbox checked={exceptionClosed} onCheckedChange={(c) => setExceptionClosed(!!c)} className="rounded" />
              <span>Closed all day</span>
            </label>

            {!exceptionClosed && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-foreground">Opening time</Label>
                  <Input
                    type="time"
                    value={exceptionOpeningTime}
                    onChange={(e) => setExceptionOpeningTime(e.target.value)}
                    className="rounded-xl border-border bg-background"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-foreground">Closing time</Label>
                  <Input
                    type="time"
                    value={exceptionClosingTime}
                    onChange={(e) => setExceptionClosingTime(e.target.value)}
                    className="rounded-xl border-border bg-background"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-foreground">Reason (optional)</Label>
              <Input
                value={exceptionReason}
                onChange={(e) => setExceptionReason(e.target.value)}
                placeholder="Public holiday, private event, maintenance..."
                className="rounded-xl border-border bg-background"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExceptionDialogOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingException}
                className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs px-5"
              >
                {isSubmittingException ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
                Add exception
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helper for a rule row/card
// ---------------------------------------------------------------------------
function RuleCard({
  rule,
  highlight = false,
  compact = false,
  action,
}: {
  rule: AvailabilityRule;
  highlight?: boolean;
  compact?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        highlight
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-background"
      } ${compact ? "py-3" : ""}`}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              {rule.durationType === "HOURLY"
                ? `${rule.durationHour} Hour Booking`
                : "Fixed Duration Booking"}
            </span>

            {rule.status === "ACTIVE" && (
              <span className="flex items-center text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </span>
            )}

            {rule.effectiveFrom && (
              <span className="text-[10px] font-semibold text-muted-foreground">
                Effective from {formatDate(rule.effectiveFrom)}
              </span>
            )}
          </div>

          {/* Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground font-medium">
                Operating Days
              </p>
              <p className="font-semibold">
                {DAY_LABELS[rule.weekStartDay] || rule.weekStartDay} –{" "}
                {DAY_LABELS[rule.weekEndDay] || rule.weekEndDay}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground font-medium">
                Operating Hours
              </p>
              <p className="font-semibold">
                {formatTime(rule.operatingStartTime)} –{" "}
                {formatTime(rule.operatingEndTime)}
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-border p-3">
            <h4 className="text-xs font-bold mb-3">Pricing</h4>

            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <p className="font-semibold text-muted-foreground">
                  Weekday
                </p>

                <div className="flex justify-between">
                  <span>Day</span>
                  <span className="font-semibold">
                    ₹{rule.weekdayDayRate ?? "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Night</span>
                  <span className="font-semibold">
                    ₹{rule.weekdayNightRate ?? "-"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-muted-foreground">
                  Weekend
                </p>

                <div className="flex justify-between">
                  <span>Day</span>
                  <span className="font-semibold">
                    ₹{rule.weekendDayRate ?? "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Night</span>
                  <span className="font-semibold">
                    ₹{rule.weekendNightRate ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {action && (
          <div className="flex items-start lg:items-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
