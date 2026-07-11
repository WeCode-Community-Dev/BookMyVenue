"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types — mirrored 1:1 from the backend VenueRequest / DTOs          */
/* ------------------------------------------------------------------ */

type VenueType =
  | "CONFERENCE"
  | "WEDDING"
  | "COWORKING"
  | "STUDIO"
  | "ROOFTOP"
  | "GARDEN";

type AmenityType = "AC" | "WIFI" | "PROJECTOR";

type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

// NOTE: backend enum values assumed — confirm against your DurationType enum
type DurationType = "HOURLY" | "DAILY";

interface VenueAvailabilityRulesRequest {
  durationType: DurationType;
  durationHour: number | null;
  weekStartDay: DayOfWeek;
  weekEndDay: DayOfWeek;
  operatingStartTime: string; // "HH:mm"
  operatingEndTime: string; // "HH:mm"
  weekdayDayRate: number | null;
  weekdayNightRate: number | null;
  weekendDayRate: number | null;
  weekendNightRate: number | null;
}

interface CreateVenueRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  venueAvailabilityRulesRequest: VenueAvailabilityRulesRequest;
  venueType: VenueType;
  parking: boolean;
  seatingCapacity: number;
  amenities: AmenityType[];
  pricePerHour: string;
  maxAdvanceBookingDays: number;
}

const VENUE_TYPES: VenueType[] = [
  "CONFERENCE",
  "WEDDING",
  "COWORKING",
  "STUDIO",
  "ROOFTOP",
  "GARDEN",
];

const AMENITY_OPTIONS: AmenityType[] = ["AC", "WIFI", "PROJECTOR"];

const DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DURATION_TYPES: DurationType[] = ["HOURLY", "DAILY"];

const selectClass =
  "w-full rounded-xl border border-border bg-background text-xs px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary";

/* ------------------------------------------------------------------ */

interface AddVenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a venue is successfully created, so the parent can refetch the list */
  onCreated: () => void;
}

export function AddVenueDialog({ open, onOpenChange, onCreated }: AddVenueDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("San Francisco");
  const [venueType, setVenueType] = useState<VenueType>("CONFERENCE");
  const [seatingCapacity, setSeatingCapacity] = useState("20");
  const [parking, setParking] = useState(false);
  const [amenities, setAmenities] = useState<AmenityType[]>(["AC", "WIFI"]);
  const [pricePerHour, setPricePerHour] = useState("80");
  const [maxAdvanceBookingDays, setMaxAdvanceBookingDays] = useState("30");

  // Availability rule fields
  const [durationType, setDurationType] = useState<DurationType>("HOURLY");
  const [durationHour, setDurationHour] = useState("1");
  const [weekStartDay, setWeekStartDay] = useState<DayOfWeek>("MONDAY");
  const [weekEndDay, setWeekEndDay] = useState<DayOfWeek>("SUNDAY");
  const [operatingStartTime, setOperatingStartTime] = useState("09:00");
  const [operatingEndTime, setOperatingEndTime] = useState("21:00");
  const [weekdayDayRate, setWeekdayDayRate] = useState("80");
  const [weekdayNightRate, setWeekdayNightRate] = useState("100");
  const [weekendDayRate, setWeekendDayRate] = useState("120");
  const [weekendNightRate, setWeekendNightRate] = useState("150");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setAddress("");
    setCity("San Francisco");
    setVenueType("CONFERENCE");
    setSeatingCapacity("20");
    setParking(false);
    setAmenities(["AC", "WIFI"]);
    setPricePerHour("80");
    setMaxAdvanceBookingDays("30");
    setDurationType("HOURLY");
    setDurationHour("1");
    setWeekStartDay("MONDAY");
    setWeekEndDay("SUNDAY");
    setOperatingStartTime("09:00");
    setOperatingEndTime("21:00");
    setWeekdayDayRate("80");
    setWeekdayNightRate("100");
    setWeekendDayRate("120");
    setWeekendNightRate("150");
    setImageFiles([]);
  };

  const toggleAmenity = (a: AmenityType) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files;
  if (!selected || selected.length === 0) return;

  const newFiles = Array.from(selected);
  console.log("Selected files:", newFiles); // TEMP: confirm this logs your file(s)

  setImageFiles((prev) => [...prev, ...newFiles]);
  e.currentTarget.value = ""; // reset AFTER reading, using currentTarget not target
};

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !address || !city) {
      toast.error("Please fill in all required venue details.");
      return;
    }
    if (imageFiles.length === 0) {
      toast.error("Please attach at least one image.");
      return;
    }

    const request: CreateVenueRequest = {
      name,
      description,
      address,
      city,
      venueAvailabilityRulesRequest: {
        durationType,
        durationHour: durationHour ? Number(durationHour) : null,
        weekStartDay,
        weekEndDay,
        operatingStartTime,
        operatingEndTime,
        weekdayDayRate: weekdayDayRate ? Number(weekdayDayRate) : null,
        weekdayNightRate: weekdayNightRate ? Number(weekdayNightRate) : null,
        weekendDayRate: weekendDayRate ? Number(weekendDayRate) : null,
        weekendNightRate: weekendNightRate ? Number(weekendNightRate) : null,
      },
      venueType,
      parking,
      seatingCapacity: Number(seatingCapacity),
      amenities,
      pricePerHour,
      maxAdvanceBookingDays: Number(maxAdvanceBookingDays),
    };

    try {
      setIsCreating(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(request)], { type: "application/json" })
      );
      imageFiles.forEach((file) => formData.append("images", file));

      const response = await fetch("http://localhost:8080/api/owner/venue", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || "Failed to create venue");
      }

      toast.success("Venue created successfully");
      resetForm();
      onOpenChange(false);
      onCreated();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-black text-xl">List a New Space</DialogTitle>
          <DialogDescription className="text-xs">
            Fill in the details below to publish a new venue listing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Basic details */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              Basic Details
            </h3>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-foreground">Venue Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border-border bg-background" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-foreground">Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-xl border-border bg-background" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">City</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} className="rounded-xl border-border bg-background" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Venue Type</Label>
                <select value={venueType} onChange={(e) => setVenueType(e.target.value as VenueType)} className={selectClass}>
                  {VENUE_TYPES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Seating Capacity</Label>
                <Input type="number" min={1} value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)} className="rounded-xl border-border bg-background" required />
              </div>
            </div>

            <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground w-fit">
              <Checkbox checked={parking} onCheckedChange={(c) => setParking(!!c)} />
              <span>Parking available on-site</span>
            </label>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-foreground">Amenities</Label>
              <div className="flex flex-wrap gap-4">
                {AMENITY_OPTIONS.map((a) => (
                  <label key={a} className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground">
                    <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Price / Hour ($)</Label>
                <Input value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Max Advance Booking (days)</Label>
                <Input type="number" min={0} value={maxAdvanceBookingDays} onChange={(e) => setMaxAdvanceBookingDays(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
            </div>
          </div>

          {/* Availability rules */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              Availability &amp; Rates
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Booking Duration Type</Label>
                <select value={durationType} onChange={(e) => setDurationType(e.target.value as DurationType)} className={selectClass}>
                  {DURATION_TYPES.map((d) => (
                    <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Min Duration (hrs)</Label>
                <Input type="number" min={1} value={durationHour} onChange={(e) => setDurationHour(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Week Start Day</Label>
                <select value={weekStartDay} onChange={(e) => setWeekStartDay(e.target.value as DayOfWeek)} className={selectClass}>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Week End Day</Label>
                <select value={weekEndDay} onChange={(e) => setWeekEndDay(e.target.value as DayOfWeek)} className={selectClass}>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Opening Time</Label>
                <Input type="time" value={operatingStartTime} onChange={(e) => setOperatingStartTime(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Closing Time</Label>
                <Input type="time" value={operatingEndTime} onChange={(e) => setOperatingEndTime(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Weekday Day Rate ($)</Label>
                <Input type="number" step="0.01" min={0} value={weekdayDayRate} onChange={(e) => setWeekdayDayRate(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Weekday Night Rate ($)</Label>
                <Input type="number" step="0.01" min={0} value={weekdayNightRate} onChange={(e) => setWeekdayNightRate(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Weekend Day Rate ($)</Label>
                <Input type="number" step="0.01" min={0} value={weekendDayRate} onChange={(e) => setWeekendDayRate(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-foreground">Weekend Night Rate ($)</Label>
                <Input type="number" step="0.01" min={0} value={weekendNightRate} onChange={(e) => setWeekendNightRate(e.target.value)} className="rounded-xl border-border bg-background" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
  <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
    Photos
  </h3>

  <input
    id="venue-image-input"
    type="file"
    accept="image/*"
    multiple
    onChange={handleFilesSelected}
    className="block w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
  />

  {imageFiles.length > 0 && (
    <div className="grid grid-cols-4 gap-3">
      {imageFiles.map((file, i) => (
        <div key={`${file.name}-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
          <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => removeImage(i)}
            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>

          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-card">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className="rounded-xl bg-primary text-primary-foreground font-semibold px-6">
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Publishing...
                </>
              ) : (
                "Publish Venue"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
