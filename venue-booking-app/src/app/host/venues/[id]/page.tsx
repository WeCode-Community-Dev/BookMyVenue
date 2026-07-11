"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MapPin, Users, ArrowLeft, Plus, Clock, CalendarDays, CheckCircle2,
  Trash, ShieldAlert, Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// ⚠️ ENDPOINT PATHS — placeholders, swap these for your real ones
// ---------------------------------------------------------------------------
const API_BASE = "http://localhost:8080/api/owner";

// GET single venue (already confirmed working shape from /api/owner/venues)
const venueDetailUrl = (venueId: string) => `${API_BASE}/venue/${venueId}`;

// GET list of availability rules for a venue — CONFIRM/REPLACE THIS PATH
const rulesListUrl = (venueId: string) => `${API_BASE}/venue/${venueId}/availability-rules`;

// POST create a new availability rule — CONFIRM/REPLACE THIS PATH
const rulesCreateUrl = (venueId: string) => `${API_BASE}/venue/${venueId}/availability-rule`;

// PATCH/POST set a rule active — CONFIRM/REPLACE THIS PATH (endpoint not yet defined)
const ruleActivateUrl = (venueId: string, ruleId: number) =>
  `${API_BASE}/venue/${venueId}/availability-rule/${ruleId}/activate`;

// ---------------------------------------------------------------------------
// Types — matches the real payload shape you shared
// ---------------------------------------------------------------------------
interface AvailabilityRule {
  id?: number; // present in list endpoint, absent in the single nested object today
  venueId: number;
  weekStartDay: string;
  weekEndDay: string;
  minDuration: number;
  venueOpeningTime: string;
  VenueClosingTime: string | null;
  bookBefore: number;
  currentlyActive: boolean;
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

export default function VenueDetailPage() {
  const router = useRouter();
  const params = useParams();
  const venueId = params?.id as string;

  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [isSubmittingRule, setIsSubmittingRule] = useState(false);
  const [activatingRuleId, setActivatingRuleId] = useState<number | null>(null);

  // New rule form state
  const [weekStartDay, setWeekStartDay] = useState("MONDAY");
  const [weekEndDay, setWeekEndDay] = useState("FRIDAY");
  const [venueOpeningTime, setVenueOpeningTime] = useState("09:00");
  const [venueClosingTime, setVenueClosingTime] = useState("18:00");
  const [minDuration, setMinDuration] = useState("2");
  const [bookBefore, setBookBefore] = useState("24");

  useEffect(() => {
    if (!venueId) return;
    fetchVenue();
    fetchRules();
  }, [venueId]);

  async function fetchVenue() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await fetch(venueDetailUrl(venueId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to load venue (${response.status})`);
      }
      const data = await response.json();
      setVenue(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load venue");
    } finally {
      setLoading(false);
    }
  }

  // NOTE: rulesListUrl is a placeholder path — update once confirmed.
  // Falls back gracefully to the single rule nested on the venue object
  // (venueAvailabiltyRulesResponse) if the list endpoint isn't available yet.
  async function fetchRules() {
    try {
      setRulesLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(rulesListUrl(venueId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Rules list endpoint returned ${response.status}`);
      }
      const data = await response.json();
      setRules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Rules list endpoint not available yet, falling back to single rule:", err);
      // Fallback: use the single nested rule from the venue payload, if present
      setRules(venue?.venueAvailabiltyRulesResponse ? [venue.venueAvailabiltyRulesResponse] : []);
    } finally {
      setRulesLoading(false);
    }
  }

  // Re-derive fallback rules once venue loads, in case fetchRules ran first and failed
  useEffect(() => {
    if (rules.length === 0 && venue?.venueAvailabiltyRulesResponse) {
      setRules([venue.venueAvailabiltyRulesResponse]);
    }
  }, [venue]);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingRule(true);
      const token = localStorage.getItem("token");

      const payload = {
        weekStartDay,
        weekEndDay,
        venueOpeningTime: `${venueOpeningTime}:00`,
        venueClosingTime: `${venueClosingTime}:00`,
        minDuration: Number(minDuration),
        bookBefore: Number(bookBefore),
      };

      const response = await fetch(rulesCreateUrl(venueId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Failed to add rule (${response.status})`);
      }

      toast.success("Availability rule added.");
      setIsAddRuleOpen(false);
      fetchRules();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Couldn't add the rule. Endpoint may need confirming.");
    } finally {
      setIsSubmittingRule(false);
    }
  };

  const handleSetActive = async (rule: AvailabilityRule) => {
    if (rule.currentlyActive || rule.id == null) return;
    try {
      setActivatingRuleId(rule.id);
      const token = localStorage.getItem("token");
      const response = await fetch(ruleActivateUrl(venueId, rule.id), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to set active (${response.status})`);
      }
      toast.success("Active rule updated.");
      fetchRules();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Couldn't switch the active rule. Endpoint may need confirming.");
    } finally {
      setActivatingRuleId(null);
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

        {/* Back link */}
        <button
          onClick={() => router.push("/host")}
          className="flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back to venues
        </button>

        {/* Hero image + header */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-[16/6] w-full bg-muted">
            {venue.imageFiles?.[0] ? (
              <img
                src={venue.imageFiles[0]}
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
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-foreground flex items-center">
                <CalendarDays className="h-4.5 w-4.5 text-primary mr-1.5" />
                Availability Rules
              </h3>
              <p className="text-xxs text-muted-foreground mt-1">
                Only one rule is active at a time. Guests book against the active rule.
              </p>
            </div>
            <Button
              onClick={() => setIsAddRuleOpen(true)}
              size="sm"
              className="rounded-xl bg-primary text-primary-foreground font-semibold px-4"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Rule
            </Button>
          </div>

          {rulesLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">
              No availability rules yet. Add one so guests can start booking.
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div
                  key={rule.id ?? idx}
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors ${
                    rule.currentlyActive
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {DAY_LABELS[rule.weekStartDay] || rule.weekStartDay} – {DAY_LABELS[rule.weekEndDay] || rule.weekEndDay}
                      </span>
                      {rule.currentlyActive && (
                        <span className="flex items-center text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xxs text-muted-foreground gap-4 flex-wrap">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(rule.venueOpeningTime)} – {formatTime(rule.VenueClosingTime)}
                      </span>
                      <span>Min {rule.minDuration}h booking</span>
                      <span>Book at least {rule.bookBefore}h ahead</span>
                    </div>
                  </div>

                  {!rule.currentlyActive && (
                    <Button
                      onClick={() => handleSetActive(rule)}
                      variant="outline"
                      size="sm"
                      disabled={activatingRuleId === rule.id}
                      className="rounded-xl text-xxs shrink-0"
                    >
                      {activatingRuleId === rule.id ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      ) : null}
                      Set as active
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Rule Dialog */}
      <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add availability rule</DialogTitle>
            <DialogDescription className="text-xs">
              Define a new booking window for this venue. You can switch which rule is active anytime.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRule} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Start day</Label>
                <select
                  value={weekStartDay}
                  onChange={(e) => setWeekStartDay(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background h-9 px-3 text-xs"
                >
                  {WEEKDAYS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">End day</Label>
                <select
                  value={weekEndDay}
                  onChange={(e) => setWeekEndDay(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background h-9 px-3 text-xs"
                >
                  {WEEKDAYS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Opening time</Label>
                <Input
                  type="time"
                  value={venueOpeningTime}
                  onChange={(e) => setVenueOpeningTime(e.target.value)}
                  className="rounded-xl border-border bg-background"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Closing time</Label>
                <Input
                  type="time"
                  value={venueClosingTime}
                  onChange={(e) => setVenueClosingTime(e.target.value)}
                  className="rounded-xl border-border bg-background"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Min duration (hrs)</Label>
                <Input
                  type="number"
                  min={1}
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                  className="rounded-xl border-border bg-background"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Book before (hrs)</Label>
                <Input
                  type="number"
                  min={0}
                  value={bookBefore}
                  onChange={(e) => setBookBefore(e.target.value)}
                  className="rounded-xl border-border bg-background"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddRuleOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingRule}
                className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs px-5"
              >
                {isSubmittingRule ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
                Add rule
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}