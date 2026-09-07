"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { api, Venue, AvailabilityRule } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Building, Search, Plus, MapPin, Users, Trash, Eye, Settings2, Sparkles,
  ChevronLeft, ChevronRight, Check, Info, FileText, AlertCircle
} from "lucide-react";

const VENUE_TYPES = [
  { id: "CONFERENCE", label: "Conference Room" },
  { id: "WEDDING", label: "Wedding & Ballroom" },
  { id: "COWORKING", label: "Co-working Space" },
  { id: "STUDIO", label: "Creative Studio" },
  { id: "ROOFTOP", label: "Rooftop Lounge" },
  { id: "GARDEN", label: "Garden Oasis" }
];

const AMENITIES_LIST = ["AC", "WIFI", "PROJECTOR"];

const CITIES = ["San Francisco", "New York", "Chicago", "Los Angeles", "Miami", "Austin"];

const HOURS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// Default images mapping to make creation easy
const DEFAULT_IMAGES: Record<string, string[]> = {
  CONFERENCE: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800"
  ],
  WEDDING: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
  ],
  COWORKING: [
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"
  ],
  STUDIO: [
    "https://images.unsplash.com/photo-1603178455924-ef33372953bb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800"
  ],
  ROOFTOP: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800"
  ],
  GARDEN: [
    "https://images.unsplash.com/photo-1530731141654-5993c3016c77?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=800"
  ]
};

export default function OwnerVenuesPage() {
  const router = useRouter();
  const { user } = useApp();

  // Search & filter states
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;

  // Stepper dialog modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Form states - Step 1: Info
  const [vName, setVName] = useState("");
  const [vDesc, setVDesc] = useState("");
  const [vAddress, setVAddress] = useState("");
  const [vCity, setVCity] = useState("San Francisco");
  const [vType, setVType] = useState<Venue["venueType"]>("CONFERENCE");
  const [vCapacity, setVCapacity] = useState("20");
  const [vParking, setVParking] = useState(false);
  const [vAmenities, setVAmenities] = useState<Venue["amenities"]>(["WIFI", "AC"]);
  const [vPrice, setVPrice] = useState("80");
  const [vImageInput, setVImageInput] = useState("");

  // Form states - Step 2: Rule
  const [ruleName, setRuleName] = useState("Standard Business Hours");
  const [ruleStartTime, setRuleStartTime] = useState("09:00");
  const [ruleEndTime, setRuleEndTime] = useState("17:00");
  const [ruleStartDay, setRuleStartDay] = useState<AvailabilityRule["weekStartDay"]>("MONDAY");
  const [ruleEndDay, setRuleEndDay] = useState<AvailabilityRule["weekEndDay"]>("FRIDAY");
  const [ruleIsActive, setRuleIsActive] = useState(true);

  // Load Owner's Venues
  const loadVenues = useCallback(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    api.getOwnerVenues(user.email, { search, status: statusTab, page, limit })
      .then((res) => {
        setVenues(res.data);
        setTotal(res.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load venues.");
        setLoading(false);
      });
  }, [user, search, statusTab, page]);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Reset page when tab changes
  const handleTabChange = (tab: "all" | "approved" | "pending" | "rejected") => {
    setStatusTab(tab);
    setPage(1);
  };

  // Stepper functions
  const nextStep = () => {
    if (step === 1) {
      if (!vName || !vAddress || !vCapacity || !vPrice) {
        toast.error("Please fill in all required venue information.");
        return;
      }
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Determine images array
      let finalImages = DEFAULT_IMAGES[vType] || DEFAULT_IMAGES.conference;
      if (vImageInput.trim()) {
        finalImages = vImageInput.split(",").map((s) => s.trim()).filter(Boolean);
      }

      const venuePayload = {
        name: vName,
        description: vDesc || `A premium ${vType} space located in ${vCity}.`,
        seatingCapacity: parseInt(vCapacity) || 20,
        city: vCity,
        address: vAddress,
        pricePerHour: parseInt(vPrice) || 80,
        pricePerDay: (parseInt(vPrice) || 80) * 8, // estimate daily
        images: finalImages,
        amenities: vAmenities,
        parking: vParking,
        venueType: vType,
        status: "PENDING" as const
      };

      const rulePayload = {
        name: ruleName,
        isActive: ruleIsActive,
        durationType: "HOURLY" as const,
        durationHour: 2,
        weekStartDay: ruleStartDay,
        weekEndDay: ruleEndDay,
        operatingStartTime: ruleStartTime,
        operatingEndTime: ruleEndTime,
        weekdayDayRate: parseInt(vPrice) || 80,
        weekdayNightRate: Math.round((parseInt(vPrice) || 80) * 1.2),
        weekendDayRate: Math.round((parseInt(vPrice) || 80) * 1.3),
        weekendNightRate: Math.round((parseInt(vPrice) || 80) * 1.5)
      };

      const createdVenue = await api.createVenue(venuePayload as any, rulePayload as any);
      
      toast.success("Venue successfully registered and default rule created!");
      setIsCreateOpen(false);
      
      // Reset form states
      setStep(1);
      setVName("");
      setVDesc("");
      setVAddress("");
      setVCapacity("20");
      setVPrice("80");
      setVImageInput("");
      
      // Refresh list and redirect
      loadVenues();
      router.push(`/owner/venues/${createdVenue.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create venue.");
    }
  };

  // Action: Delete Venue
  const handleDeleteVenue = async (venueId: string, venueName: string) => {
    if (confirm(`Are you sure you want to permanently delete "${venueName}"?`)) {
      try {
        await api.deleteVenue(venueId);
        toast.success("Venue deleted successfully.");
        loadVenues();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete venue.");
      }
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-grow bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Console */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center">
              <Building className="h-6 w-6 text-primary mr-2" />
              My Space Listings
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your venues, schedule availability parameters, and view guest page templates.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl bg-primary text-primary-foreground font-semibold px-5 shrink-0">
            <Plus className="h-5 w-5 mr-1.5" />
            Create Venue
          </Button>
        </div>

        {/* Toolbar Filter Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border bg-card p-4 rounded-2xl shadow-sm text-sm">
          
          {/* Status Tabs generated dynamically */}
          <div className="flex items-center space-x-1 bg-secondary p-1 rounded-xl border border-border text-xs font-semibold">
            {(["all", "approved", "pending", "rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 rounded-lg capitalize transition-all cursor-pointer ${
                  statusTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab} Listings
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search space listings..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 rounded-xl border-border bg-background"
            />
          </div>
        </div>

        {/* Listings Content Viewport */}
        {loading ? (
          // Loading skeletons
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-border p-4 rounded-2xl bg-card space-y-4">
                <div className="h-40 bg-muted rounded-xl animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center p-12 bg-card border border-border rounded-2xl shadow-sm">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-extrabold text-lg text-foreground">Inquiries Failure</h3>
            <p className="text-muted-foreground text-xs mt-1">{error}</p>
            <Button onClick={loadVenues} variant="outline" className="mt-4 rounded-xl">Retry Load</Button>
          </div>
        ) : venues.length === 0 ? (
          // Empty state
          <div className="text-center p-12 bg-card border border-border rounded-2xl shadow-sm">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-extrabold text-lg text-foreground">No Venues Found</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-xs mx-auto">
              You haven't listed any venues matching your current status search filters.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="mt-6 rounded-xl">Create Your First Venue</Button>
          </div>
        ) : (
          // Loaded items list
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <Card key={venue.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={venue.images?.[0] || DEFAULT_IMAGES.CONFERENCE[0]}
                      alt={venue.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                    <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold border capitalize ${
                      venue.status === "VERIFIED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : venue.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                      {venue.status === "VERIFIED" ? "Approved" : venue.status.toLowerCase()}
                    </span>
                  </div>

                  <CardHeader className="p-5 pb-2">
                    <h3 className="font-extrabold text-base text-foreground leading-tight line-clamp-1">{venue.name}</h3>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{venue.venueType?.toLowerCase()}</span>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3 flex-grow">
                    <p className="text-xs text-muted-foreground line-clamp-2">{venue.description}</p>
                    <div className="flex items-center justify-between text-xxs text-muted-foreground pt-2.5 border-t border-border/60">
                      <span className="flex items-center"><MapPin className="h-3 w-3 mr-1 text-primary" />{venue.city}</span>
                      <span className="flex items-center"><Users className="h-3 w-3 mr-1" />Up to {venue.seatingCapacity}</span>
                      <span className="font-extrabold text-foreground">${venue.pricePerHour}/hr</span>
                    </div>
                  </CardContent>

                  <CardFooter className="px-5 pb-5 pt-3 flex items-center justify-between gap-2 border-t border-border/40 bg-muted/10">
                    <div className="grid grid-cols-2 gap-1.5 w-full text-xxs font-bold">
                      <Button onClick={() => router.push(`/owner/venues/${venue.id}`)} variant="outline" size="sm" className="rounded-xl h-8 text-[10px] cursor-pointer flex items-center justify-center">
                        <Settings2 className="h-3.5 w-3.5 mr-1" />
                        Manage
                      </Button>
                      <Button onClick={() => router.push(`/owner/venues/${venue.id}?tab=preview`)} variant="outline" size="sm" className="rounded-xl h-8 text-[10px] cursor-pointer flex items-center justify-center">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Preview
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleDeleteVenue(venue.id, venue.name)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/20 shrink-0 cursor-pointer"
                      aria-label="Delete space"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-4 select-none">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground font-semibold">
                  Page {page} of {totalPages}
                </span>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* stepper dialog modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl rounded-2xl bg-card border border-border p-6 overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-foreground flex items-center">
              <Sparkles className="h-5.5 w-5.5 text-primary mr-2" />
              List a New Space
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Follow the steps to declare your venue details and initial scheduling calendar.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper tracker */}
          <div className="flex items-center justify-center space-x-4 my-2 pb-4 border-b border-border text-xxs font-extrabold uppercase tracking-wider text-muted-foreground select-none">
            <span className={step === 1 ? "text-primary" : ""}>1. Venue Information</span>
            <ChevronRight className="h-3 w-3" />
            <span className={step === 2 ? "text-primary" : ""}>2. Availability Rule</span>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            
            {/* STEP 1: INFO FORM */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="vName" className="text-xs font-bold text-foreground">Venue Name *</Label>
                    <Input id="vName" required placeholder="e.g. Paramount Conference Hall" value={vName} onChange={(e) => setVName(e.target.value)} className="rounded-xl border-border bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vType" className="text-xs font-bold text-foreground">Venue Type *</Label>
                    <select id="vType" value={vType} onChange={(e) => setVType(e.target.value as any)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                      {VENUE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vDesc" className="text-xs font-bold text-foreground">Description</Label>
                  <textarea id="vDesc" rows={3} placeholder="Give a premium overview details about the space specifications..." value={vDesc} onChange={(e) => setVDesc(e.target.value)} className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="vCity" className="text-xs font-bold text-foreground">City *</Label>
                    <select id="vCity" value={vCity} onChange={(e) => setVCity(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vCapacity" className="text-xs font-bold text-foreground">Seating Capacity *</Label>
                    <Input id="vCapacity" type="number" required placeholder="25" value={vCapacity} onChange={(e) => setVCapacity(e.target.value)} className="rounded-xl border-border bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vPrice" className="text-xs font-bold text-foreground">Price/Hr ($) *</Label>
                    <Input id="vPrice" type="number" required placeholder="80" value={vPrice} onChange={(e) => setVPrice(e.target.value)} className="rounded-xl border-border bg-background" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vAddress" className="text-xs font-bold text-foreground">Street Address *</Label>
                  <Input id="vAddress" required placeholder="e.g. 100 Market St Suite A" value={vAddress} onChange={(e) => setVAddress(e.target.value)} className="rounded-xl border-border bg-background" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vImages" className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>Venue Image URLs (Optional)</span>
                    <span className="text-[10px] text-muted-foreground font-medium italic">Separate by comma</span>
                  </Label>
                  <Input id="vImages" placeholder="e.g. https://domain.com/pic1.jpg, https://domain.com/pic2.jpg" value={vImageInput} onChange={(e) => setVImageInput(e.target.value)} className="rounded-xl border-border bg-background text-xs" />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-xs font-bold text-foreground">Amenities & Features</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AMENITIES_LIST.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer select-none">
                        <Checkbox checked={vAmenities.includes(amenity as any)} onCheckedChange={(checked) => {
                          if (checked) setVAmenities([...vAmenities, amenity as any]);
                          else setVAmenities(vAmenities.filter((a) => a !== amenity));
                        }} className="rounded" />
                        <span>{amenity}</span>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer select-none">
                      <Checkbox checked={vParking} onCheckedChange={(checked) => setVParking(!!checked)} className="rounded" />
                      <span>Dedicated Parking</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="button" onClick={nextStep} className="rounded-xl bg-primary text-primary-foreground font-semibold px-6">
                    Next Step: Availability
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: AVAILABILITY FORM */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="p-4 bg-secondary/60 border border-border rounded-xl space-y-2 text-xs">
                  <h4 className="font-extrabold text-foreground flex items-center">
                    <Info className="h-4 w-4 text-primary mr-1.5" />
                    Availability Rule Concept
                  </h4>
                  <p className="text-muted-foreground leading-normal">
                    This rule defines when your venue can be booked by clients. Only one rule can be active at a time.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ruleName" className="text-xs font-bold text-foreground">Rule Name *</Label>
                  <Input id="ruleName" required value={ruleName} onChange={(e) => setRuleName(e.target.value)} className="rounded-xl border-border bg-background" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ruleStart" className="text-xs font-bold text-foreground">Start Time</Label>
                    <select id="ruleStart" value={ruleStartTime} onChange={(e) => setRuleStartTime(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                      {HOURS.map((hr) => <option key={hr} value={hr}>{hr}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ruleEnd" className="text-xs font-bold text-foreground">End Time</Label>
                    <select id="ruleEnd" value={ruleEndTime} onChange={(e) => setRuleEndTime(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                      {HOURS.map((hr) => <option key={hr} value={hr}>{hr}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ruleStartDay" className="text-xs font-bold text-foreground">Week Starts On</Label>
                    <select id="ruleStartDay" value={ruleStartDay} onChange={(e) => setRuleStartDay(e.target.value as any)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                      {["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ruleEndDay" className="text-xs font-bold text-foreground">Week Closes On</Label>
                    <select id="ruleEndDay" value={ruleEndDay} onChange={(e) => setRuleEndDay(e.target.value as any)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none">
                      {["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 select-none">
                  <Checkbox
                    id="ruleActive"
                    checked={ruleIsActive}
                    onCheckedChange={(checked) => setRuleIsActive(!!checked)}
                    className="rounded"
                  />
                  <Label htmlFor="ruleActive" className="text-xs font-semibold text-foreground cursor-pointer">
                    Set as the Active Availability Rule immediately
                  </Label>
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
                  <Button type="button" onClick={prevStep} variant="outline" className="rounded-xl px-5">
                    Back to Info
                  </Button>
                  <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 flex items-center">
                    <Check className="h-4.5 w-4.5 mr-1" />
                    Register Listing
                  </Button>
                </div>
              </div>
            )}

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
