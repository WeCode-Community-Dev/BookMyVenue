"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, AvailabilityRule, ExceptionRule } from "@/lib/api";
import { useApp, Venue } from "@/context/AppContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft, Settings, Calendar, Clock, Eye, Sparkles, Check, Trash, Plus,
  MapPin, ShieldAlert, CalendarRange
} from "lucide-react";
import UserVenueDetails from "@/components/UserVenueDetails";

const VENUE_TYPES = [
  { id: "conference", label: "Conference Room" },
  { id: "wedding", label: "Wedding & Ballroom" },
  { id: "coworking", label: "Co-working Space" },
  { id: "studio", label: "Creative Studio" },
  { id: "rooftop", label: "Rooftop Lounge" },
  { id: "garden", label: "Garden Oasis" }
];

const AMENITIES_LIST = [
  "Wi-Fi", "AC", "Sound System", "Projector", "TV Screen", "Whiteboard",
  "Catering Available", "Coffee & Tea", "Parking", "Lounge Area", "Stage", "Dressing Room"
];

const CITIES = ["San Francisco", "New York", "Chicago", "Los Angeles", "Miami", "Austin"];

const HOURS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export default function OwnerVenueDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;

  // Tabs state
  const initialTab = searchParams.get("tab") as "overview" | "rules" | "exceptions" | "preview" | null;
  const [activeTab, setActiveTab] = useState<"overview" | "rules" | "exceptions" | "preview">(initialTab || "overview");

  // Core Data States
  const [venue, setVenue] = useState<any>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<ExceptionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states - Overview Edits
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState<Venue["type"]>("conference");
  const [capacity, setCapacity] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [savingOverview, setSavingOverview] = useState(false);

  // Form states - Create Availability Rule Dialog
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDays, setNewRuleDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [newRuleStart, setNewRuleStart] = useState("09:00");
  const [newRuleEnd, setNewRuleEnd] = useState("17:00");
  const [newRuleActive, setNewRuleActive] = useState(true);
  const [creatingRule, setCreatingRule] = useState(false);

  // Form states - Create Exception Rule Dialog
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExType, setNewExType] = useState<ExceptionRule["type"]>("holiday");
  const [newExStartDate, setNewExStartDate] = useState("");
  const [newExEndDate, setNewExEndDate] = useState("");
  const [newExStart, setNewExStart] = useState("");
  const [newExEnd, setNewExEnd] = useState("");
  const [creatingException, setCreatingException] = useState(false);

  // Sync state parameters from loaded venue
  const populateForm = useCallback((v: any) => {
    setName(v.name || "");
    setDescription(v.description || "");
    setAddress(v.address || "");
    setCity(v.city || v.location || "");
    setType(v.venueType?.toLowerCase() || v.type || "conference");
    setCapacity(String(v.seatingCapacity || v.capacity || ""));
    setPricePerHour(String(v.pricePerHour || ""));
    setPricePerDay(String(v.pricePerDay || ""));
    setImageInput(v.images?.join(", ") || "");
    setSelectedAmenities(v.amenities || []);
  }, []);

  // Fetch venue and all relevant lists
  const fetchVenueData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [vData, rData, eData] = await Promise.all([
        api.getVenueDetails(id),
        api.getAvailabilityRules(id),
        api.getExceptionRules(id)
      ]);
      setVenue(vData);
      setRules(rData);
      setExceptions(eData);
      populateForm(vData);
    } catch (err: any) {
      setError(err.message || "Failed to load venue properties.");
    } finally {
      setLoading(false);
    }
  }, [id, populateForm]);

  useEffect(() => {
    fetchVenueData();
  }, [fetchVenueData]);

  // Sync activeTab if searchParam changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "overview" || tabParam === "rules" || tabParam === "exceptions" || tabParam === "preview") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handler: Overview Submit
  const handleOverviewSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !capacity || !pricePerHour) {
      toast.error("Please fill in all required specifications.");
      return;
    }
    setSavingOverview(true);
    try {
      const finalImages = imageInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Partial<Venue> = {
        name,
        description,
        address,
        location: city,
        type,
        capacity: parseInt(capacity) || 0,
        pricePerHour: parseInt(pricePerHour) || 0,
        pricePerDay: parseInt(pricePerDay) || (parseInt(pricePerHour) || 0) * 8,
        images: finalImages,
        amenities: selectedAmenities
      };

      const updated = await api.updateVenue(id, payload as any);
      setVenue(updated);
      toast.success("Venue specifications updated successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update venue overview.");
    } finally {
      setSavingOverview(false);
    }
  };

  // Handler: Activate Rule Switch
  const handleToggleRuleActive = async (ruleId: string, currentStatus: boolean) => {
    // If turning off an active rule, warn them that bookings require an active rule
    if (currentStatus) {
      toast.warning("To deactivate this rule, please activate another availability rule instead. One rule should remain active.");
      return;
    }

    try {
      const updatedRules = await api.activateAvailabilityRule(id, ruleId);
      setRules(updatedRules);
      toast.success("Availability rule activated successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to activate availability rule.");
    }
  };

  // Handler: Delete Availability Rule
  const handleDeleteRule = async (ruleId: string, ruleName: string, isRuleActive: boolean) => {
    if (isRuleActive && rules.length > 1) {
      toast.error(`"${ruleName}" is currently active. Please activate another rule before deleting this one.`);
      return;
    }
    if (rules.length === 1) {
      toast.error("A venue must have at least one availability rule to remain bookable.");
      return;
    }

    if (confirm(`Are you sure you want to delete "${ruleName}"?`)) {
      try {
        await api.deleteAvailabilityRule(id, ruleId);
        setRules(rules.filter((r) => r.id !== ruleId));
        toast.success("Availability rule deleted.");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete availability rule.");
      }
    }
  };

  // Handler: Create Availability Rule
  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) {
      toast.error("Please provide a rule name.");
      return;
    }
    if (newRuleDays.length === 0) {
      toast.error("Please select at least one operation day.");
      return;
    }

    setCreatingRule(true);
    try {
      const payload = {
        name: newRuleName,
        daysOfWeek: newRuleDays,
        startTime: newRuleStart,
        endTime: newRuleEnd,
        isActive: newRuleActive
      };

      const newRule = await api.createAvailabilityRule(id, payload as any);
      
      // If the new rule is active, it deactivates all others in simulated DB
      if (newRuleActive) {
        // reload rules to get updated active flags
        const refreshed = await api.getAvailabilityRules(id);
        setRules(refreshed);
      } else {
        setRules([...rules, newRule]);
      }

      toast.success("New availability rule registered.");
      setIsRuleModalOpen(false);
      
      // Reset Rule Form
      setNewRuleName("");
      setNewRuleDays([1, 2, 3, 4, 5]);
      setNewRuleStart("09:00");
      setNewRuleEnd("17:00");
      setNewRuleActive(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to create rule.");
    } finally {
      setCreatingRule(false);
    }
  };

  // Handler: Create Exception Rule
  const handleCreateException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim() || !newExStartDate || !newExEndDate) {
      toast.error("Please complete all required exception block details.");
      return;
    }

    setCreatingException(true);
    try {
      const payload = {
        name: newExName,
        type: newExType,
        startDate: newExStartDate,
        endDate: newExEndDate,
        startTime: newExStart || undefined,
        endTime: newExEnd || undefined
      };

      const newException = await api.createExceptionRule(id, payload);
      setExceptions([...exceptions, newException]);
      
      toast.success("Exception block successfully registered.");
      setIsExceptionModalOpen(false);
      
      // Reset Form
      setNewExName("");
      setNewExType("holiday");
      setNewExStartDate("");
      setNewExEndDate("");
      setNewExStart("");
      setNewExEnd("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create exception rule.");
    } finally {
      setCreatingException(false);
    }
  };

  // Handler: Delete Exception Rule
  const handleDeleteException = async (exId: string, exName: string) => {
    if (confirm(`Are you sure you want to remove the exception block "${exName}"?`)) {
      try {
        await api.deleteExceptionRule(id, exId);
        setExceptions(exceptions.filter((e) => e.id !== exId));
        toast.success("Exception block removed.");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete exception block.");
      }
    }
  };

  // Day Toggle Helper
  const toggleNewRuleDay = (day: number) => {
    if (newRuleDays.includes(day)) {
      setNewRuleDays(newRuleDays.filter((d) => d !== day));
    } else {
      setNewRuleDays([...newRuleDays, day].sort());
    }
  };

  if (loading) {
    return (
      <div className="flex-grow bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="flex justify-between items-center">
            <div className="space-y-2 w-1/2">
              <div className="h-8 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
            <div className="h-10 bg-muted rounded w-24" />
          </div>
          <div className="h-12 bg-muted rounded w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-muted rounded-2xl" />
            <div className="h-96 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex-grow flex items-center justify-center p-12 bg-background">
        <Card className="max-w-md w-full border-dashed border-border text-center p-8 rounded-2xl shadow-sm bg-card">
          <CardHeader className="flex flex-col items-center">
            <div className="h-12 w-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <CardTitle className="font-extrabold text-foreground">Venue Dashboard Error</CardTitle>
            <CardDescription className="text-sm mt-1">{error || "This space could not be located."}</CardDescription>
          </CardHeader>
            <Link
              href="/owner/venues"
              className={cn(buttonVariants({ variant: "default" }), "rounded-xl mt-2 cursor-pointer")}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Space Listings
            </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link and Navigation */}
        <div>
          <Link
            href="/owner/venues"
            className="inline-flex items-center text-sm font-semibold text-primary hover:underline select-none"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Link>
        </div>

        {/* Venue Header Info Console */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{venue.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-lg text-xxs font-extrabold border capitalize select-none ${
                venue.status === "approved"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400"
                  : venue.status === "pending"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400"
              }`}>
                {venue.status}
              </span>
            </div>
            <p className="text-muted-foreground text-xs flex items-center">
              <MapPin className="h-3.5 w-3.5 text-primary mr-1 shrink-0" />
              {venue.address} &bull; {venue.location}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 text-xs font-semibold cursor-pointer"
              onClick={() => {
                // switch to guest view link
                window.open(`/venues/${venue.id}`, "_blank");
              }}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Live Guest View
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs bar */}
        <div className="flex items-center space-x-1.5 border-b border-border overflow-x-auto pb-px select-none scrollbar-thin">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Overview & Specs</span>
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "rules"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Availability Rules</span>
          </button>
          <button
            onClick={() => setActiveTab("exceptions")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "exceptions"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarRange className="h-4 w-4" />
            <span>Exception Blocks</span>
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "preview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Preview As User</span>
          </button>
        </div>

        {/* Tab Viewports */}
        <div className="pt-2">
          
          {/* TAB 1: OVERVIEW & SPECS FORM */}
          {activeTab === "overview" && (
            <Card className="rounded-2xl border border-border bg-card shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg font-extrabold text-foreground flex items-center">
                  <Settings className="h-5 w-5 text-primary mr-1.5" />
                  Venue Information & Details
                </CardTitle>
                <CardDescription className="text-xs">
                  Update your space details, types, seating caps, hourly fees, and included amenities checklist.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleOverviewSave}>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold text-foreground">Venue Title *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="type" className="text-xs font-bold text-foreground">Venue Classification *</Label>
                      <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                      >
                        {VENUE_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs font-bold text-foreground">Marketing Space Description</Label>
                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-bold text-foreground">Location (City) *</Label>
                      <select
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="capacity" className="text-xs font-bold text-foreground">Max Seating Capacity *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="rounded-xl border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pricePerHour" className="text-xs font-bold text-foreground">Rental Rate ($/hour) *</Label>
                      <Input
                        id="pricePerHour"
                        type="number"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        className="rounded-xl border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-xs font-bold text-foreground">Street Address *</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="rounded-xl border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pricePerDay" className="text-xs font-bold text-foreground">Daily Booking Cap Rate ($)</Label>
                      <Input
                        id="pricePerDay"
                        type="number"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                        placeholder="Leave blank to auto-calculate"
                        className="rounded-xl border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="images" className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Venue Image URLs</span>
                      <span className="text-[10px] text-muted-foreground font-medium italic">Separate by comma</span>
                    </Label>
                    <textarea
                      id="images"
                      rows={2}
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1, https://images.unsplash.com/photo-2"
                      className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold text-foreground">Amenities Checklist</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {AMENITIES_LIST.map((amenity) => {
                        const isChecked = selectedAmenities.includes(amenity);
                        return (
                          <label key={amenity} className="flex items-center space-x-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer select-none">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedAmenities([...selectedAmenities, amenity]);
                                } else {
                                  setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                                }
                              }}
                              className="rounded"
                            />
                            <span>{amenity}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-border/60 bg-muted/5 p-4 rounded-b-2xl">
                  <Button
                    type="submit"
                    disabled={savingOverview}
                    className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 flex items-center cursor-pointer"
                  >
                    {savingOverview ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary-foreground mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4.5 w-4.5 mr-1" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 2: AVAILABILITY RULES PANEL */}
          {activeTab === "rules" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-foreground flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-1.5" />
                    Availability Profiles
                  </h3>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Only <span className="font-extrabold text-foreground">one rule can be active</span> at any time. Toggling a rule automatically deactivates other rules for this space.
                  </p>
                </div>
                <Button
                  onClick={() => setIsRuleModalOpen(true)}
                  className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs h-9 cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add New Rule
                </Button>
              </div>

              {rules.length === 0 ? (
                <Card className="border border-dashed border-border p-12 text-center rounded-2xl bg-card">
                  <CardHeader className="flex flex-col items-center">
                    <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                    <CardTitle className="text-base font-extrabold">No rules created yet</CardTitle>
                    <CardDescription className="text-xs">Provide at least one availability rule parameter block.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setIsRuleModalOpen(true)} className="rounded-xl h-8 text-xs cursor-pointer">
                      Create Availability Profile
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {rules.map((rule) => {
                    const daysStr = (rule.daysOfWeek || [])
                      .map((d: any) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d] || "")
                      .join(", ");
                    return (
                      <Card
                        key={rule.id}
                        className={`rounded-2xl border transition-all duration-200 bg-card ${
                          rule.isActive ? "border-primary/40 shadow-sm" : "border-border opacity-85"
                        }`}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-sm font-extrabold text-foreground leading-tight">
                                {rule.name}
                              </CardTitle>
                              <CardDescription className="text-xxs font-bold text-primary mt-0.5 uppercase tracking-wide">
                                {rule.isActive ? "Active Rule" : "Inactive Profile"}
                              </CardDescription>
                            </div>
                            
                            {/* Switch triggers activateAvailabilityRule */}
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={() => handleToggleRuleActive(rule.id, rule.isActive)}
                              aria-label={`Toggle active state for ${rule.name}`}
                              className="cursor-pointer"
                            />
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-foreground">Days:</span>
                            <span className="line-clamp-1">{daysStr}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-foreground">Hours:</span>
                            <span>{rule.startTime} - {rule.endTime}</span>
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0 flex justify-end border-t border-border/40 bg-muted/5 mt-2 rounded-b-2xl">
                          <Button
                            onClick={() => handleDeleteRule(rule.id, rule.name, rule.isActive)}
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-8 px-2 text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xxs font-bold flex items-center cursor-pointer"
                          >
                            <Trash className="h-3.5 w-3.5 mr-1" />
                            Delete Profile
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXCEPTION BLOCKS PANEL */}
          {activeTab === "exceptions" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-foreground flex items-center">
                    <CalendarRange className="h-5 w-5 text-primary mr-1.5" />
                    Block Dates & Exception Rules
                  </h3>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Prevent booking during closures, scheduled maintenance, holidays, or private event locks.
                  </p>
                </div>
                <Button
                  onClick={() => setIsExceptionModalOpen(true)}
                  className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs h-9 cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Block Dates
                </Button>
              </div>

              {exceptions.length === 0 ? (
                <Card className="border border-dashed border-border p-12 text-center rounded-2xl bg-card">
                  <CardHeader className="flex flex-col items-center">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                    <CardTitle className="text-base font-extrabold">No active blocks</CardTitle>
                    <CardDescription className="text-xs">Your calendar is fully open without date range exception rules.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setIsExceptionModalOpen(true)} className="rounded-xl h-8 text-xs cursor-pointer">
                      Register a Closure Block
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {exceptions.map((ex) => (
                    <Card key={ex.id} className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm font-extrabold text-foreground leading-tight">
                              {ex.name}
                            </CardTitle>
                            <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border mt-1 select-none ${
                              ex.type === "holiday"
                                ? "bg-red-50 text-red-700 border-red-150 dark:bg-red-950/20 dark:text-red-400"
                                : ex.type === "maintenance"
                                ? "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/20 dark:text-amber-400"
                                : ex.type === "private_event"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-150 dark:bg-indigo-950/20 dark:text-indigo-400"
                                : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400"
                            }`}>
                              {ex.type.replace("_", " ")}
                            </span>
                          </div>
                          
                          <Button
                            onClick={() => handleDeleteException(ex.id, ex.name)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                            aria-label={`Remove block rule ${ex.name}`}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-foreground">Duration:</span>
                          <span>{ex.startDate} to {ex.endDate}</span>
                        </div>
                        {(ex.startTime || ex.endTime) && (
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-foreground">Time Slot:</span>
                            <span>{ex.startTime || "Start"} - {ex.endTime || "End"}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PREVIEW AS USER (EMBEDDED DETAILS SCREEN) */}
          {activeTab === "preview" && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-6 p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-150 rounded-xl text-xs">
                <Sparkles className="h-5 w-5 text-primary shrink-0 animate-pulse" />
                <div className="text-muted-foreground">
                  <span className="font-extrabold text-foreground">Interactive Simulator:</span> Below is the exact live guest details page representation. You can test the calendar calculator widget and mock out the booking request process.
                </div>
              </div>

              {/* Embedded Guest Facing Component */}
              <UserVenueDetails venueId={id} previewMode={true} />
            </div>
          )}

        </div>
      </div>

      {/* CREATE AVAILABILITY RULE DIALOG MODAL */}
      <Dialog open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center">
              <Plus className="h-5 w-5 text-primary mr-1.5" />
              Add Availability Rule
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a name, active weekdays, and hours for bookings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRule} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="newRuleName" className="text-xs font-bold text-foreground">Rule Name *</Label>
              <Input
                id="newRuleName"
                required
                placeholder="e.g. Weekend Special, Standard Shift"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                className="rounded-xl border-border bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="newRuleStart" className="text-xs font-bold text-foreground">Start Time</Label>
                <select
                  id="newRuleStart"
                  value={newRuleStart}
                  onChange={(e) => setNewRuleStart(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  {HOURS.map((hr) => (
                    <option key={hr} value={hr}>{hr}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newRuleEnd" className="text-xs font-bold text-foreground">End Time</Label>
                <select
                  id="newRuleEnd"
                  value={newRuleEnd}
                  onChange={(e) => setNewRuleEnd(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  {HOURS.map((hr) => (
                    <option key={hr} value={hr}>{hr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Operation Weekdays</Label>
              <div className="flex flex-wrap gap-1.5 pt-0.5 select-none">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => {
                  const isSelected = newRuleDays.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleNewRuleDay(idx)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-background text-muted-foreground border-border hover:bg-secondary"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1 select-none">
              <Checkbox
                id="newRuleActive"
                checked={newRuleActive}
                onCheckedChange={(checked) => setNewRuleActive(!!checked)}
                className="rounded"
              />
              <Label htmlFor="newRuleActive" className="text-xs font-semibold text-foreground cursor-pointer">
                Set as active immediately (deactivates other rules)
              </Label>
            </div>

            <div className="flex justify-end pt-4 border-t border-border gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRuleModalOpen(false)}
                className="rounded-xl h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creatingRule}
                className="rounded-xl bg-primary text-primary-foreground font-semibold h-9 text-xs cursor-pointer"
              >
                {creatingRule ? "Creating..." : "Add Rule"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE EXCEPTION BLOCK DIALOG MODAL */}
      <Dialog open={isExceptionModalOpen} onOpenChange={setIsExceptionModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center">
              <Plus className="h-5 w-5 text-primary mr-1.5" />
              Add Calendar Block / Exception
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define closures, maintenance windows, or private lockups.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateException} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="newExName" className="text-xs font-bold text-foreground">Block Reason *</Label>
              <Input
                id="newExName"
                required
                placeholder="e.g. Christmas Closure, AC Renovation"
                value={newExName}
                onChange={(e) => setNewExName(e.target.value)}
                className="rounded-xl border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newExType" className="text-xs font-bold text-foreground">Block Type *</Label>
              <select
                id="newExType"
                value={newExType}
                onChange={(e) => setNewExType(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
              >
                <option value="holiday">Holiday Shutdown</option>
                <option value="maintenance">Maintenance Block</option>
                <option value="private_event">Private Event Lockout</option>
                <option value="restriction">Restriction Closure</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="newExStartDate" className="text-xs font-bold text-foreground">Start Date *</Label>
                <Input
                  id="newExStartDate"
                  type="date"
                  required
                  value={newExStartDate}
                  onChange={(e) => setNewExStartDate(e.target.value)}
                  className="rounded-xl border-border bg-background text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newExEndDate" className="text-xs font-bold text-foreground">End Date *</Label>
                <Input
                  id="newExEndDate"
                  type="date"
                  required
                  value={newExEndDate}
                  onChange={(e) => setNewExEndDate(e.target.value)}
                  className="rounded-xl border-border bg-background text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="newExStart" className="text-xs font-bold text-foreground">Start Time (Optional)</Label>
                <select
                  id="newExStart"
                  value={newExStart}
                  onChange={(e) => setNewExStart(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="">Full Day Closure</option>
                  {HOURS.map((hr) => (
                    <option key={hr} value={hr}>{hr}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newExEnd" className="text-xs font-bold text-foreground">End Time (Optional)</Label>
                <select
                  id="newExEnd"
                  value={newExEnd}
                  onChange={(e) => setNewExEnd(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="">Full Day Closure</option>
                  {HOURS.map((hr) => (
                    <option key={hr} value={hr}>{hr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExceptionModalOpen(false)}
                className="rounded-xl h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creatingException}
                className="rounded-xl bg-primary text-primary-foreground font-semibold h-9 text-xs cursor-pointer"
              >
                {creatingException ? "Creating..." : "Add Block"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
