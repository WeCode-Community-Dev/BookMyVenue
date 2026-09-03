import { useState, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { format, parseISO } from "date-fns";
import {
  Info,
  MapPin,
  User,
  Banknote,
  Clock,
  CheckCircle2,
  Upload,
  ArrowLeft,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateVenue } from "@/services/api/useVenueSettings";
import { useImageUpload } from "@/hooks/useImageUpload";
import type { Venue } from "@/types";

interface VenueSettingsEditProps {
  venue: Venue;
  onCancel: () => void;
}

interface ExtendedVenue extends Venue {
  coverImage?: string;
  galleryImages?: string[];
  bookingType?: string;
  district?: string;
  address?: string;
  pincode?: string;
  capacity?: number;
  amenities?: string[];
  workingDays?: string[];
  spaceAttributes?: string[];
  seatingConfigurations?: string[];
  googleMapsUrl?: string;
  description?: string;
  workingHours?: { open: string; close: string };
  flexibleBooking?: { slotDuration: number; bufferTime: number };
  pricing?: {
    pricingType: "fixedPricing" | "timeBasedPricing";
    basePrice: number;
    pricingRules: { fromTime: string; toTime: string; price: number }[];
  };
  fixedPackages?: {
    slotName: string;
    startTime: string;
    endTime: string;
    price: number;
  }[];
  cancellation?: {
    policy: "refundable" | "nonRefundable";
    refundType?: "fullRefund" | "timeBasedRefund";
    refundRules: { daysBefore: number; refundPercentage: number }[];
  };
  blockedDates?: string[];
  blockedTimes?: { fromTime: string; toTime: string }[];
  __v?: number;
}

const VENUE_TYPES = [
  "Hall",
  "Turf",
  "Swimming Pool",
  "Open Ground",
  "Auditorium",
  "Convention Center",
  "Resort",
  "Party Hall",
  "Conference Space",
  "Other",
];
const SPACE_ATTRIBUTES = [
  "Indoor",
  "Outdoor (Garden/Lawn)",
  "Rooftop",
  "Poolside",
  "Both Indoor & Outdoor",
];
const SEATING_CONFIGS = [
  "Floating",
  "Theatre Seating",
  "Round Table",
  "Banquet Seating",
  "Standing",
];
const AMENITIES_LIST = [
  "Parking",
  "AC",
  "Dining Area",
  "Wifi",
  "Generator",
  "Sound System",
  "Stage",
  "Rooms",
  "Lift",
  "Wheelchair Access",
  "Decoration Space",
  "Catering Area",
];
const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function VenueSettingsEdit({ venue, onCancel }: VenueSettingsEditProps) {
  const data = venue as unknown as ExtendedVenue;
  const { mutateAsync: updateVenue, isPending } = useUpdateVenue();

  const [formData, setFormData] = useState<Record<string, unknown>>({
    name: data.name,
    venueType: data.venueType,
    maxCapacity: data.maxCapacity ?? data.capacity ?? 0,
    bookingType: data.bookingType || "flexibleBooking",
    workingDays: data.workingDays || [],
    spaceAttributes: data.spaceAttributes || [],
    seatingConfigurations: data.seatingConfigurations || [],
    address: data.address || "",
    city: data.city || "",
    district: data.district || "",
    pincode: data.pincode || "",
    contact: { ...(data.contact || { name: "", phone: "", email: "" }) },
    pricing: data.pricing
      ? JSON.parse(JSON.stringify(data.pricing))
      : undefined,
    fixedPackages: data.fixedPackages
      ? JSON.parse(JSON.stringify(data.fixedPackages))
      : [],
    cancellation: data.cancellation
      ? JSON.parse(JSON.stringify(data.cancellation))
      : { policy: "refundable", refundRules: [] },
    amenities: data.amenities || [],
    blockedDates: data.blockedDates || [],
    blockedTimes: data.blockedTimes || [],
    coverImage: data.coverImage || "",
    galleryImages: data.galleryImages || [],
    googleMapsUrl: data.googleMapsUrl || "",
    description: data.description || "",
    workingHours: data.workingHours
      ? JSON.parse(JSON.stringify(data.workingHours))
      : { open: "09:00", close: "17:00" },
    flexibleBooking: data.flexibleBooking
      ? JSON.parse(JSON.stringify(data.flexibleBooking))
      : { slotDuration: 60, bufferTime: 0 },
    expectedVersion: data.__v,
  });

  const [newPackage, setNewPackage] = useState({
    slotName: "",
    startTime: "",
    endTime: "",
    price: 0,
  });
  const [newRule, setNewRule] = useState({
    fromTime: "",
    toTime: "",
    price: 0,
  });
  const [newRefundRule, setNewRefundRule] = useState({
    daysBefore: 0,
    refundPercentage: 0,
  });
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedTime, setNewBlockedTime] = useState("");
  const [newBlockedTimeTo, setNewBlockedTimeTo] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { uploadFile, isUploading: isUploadingImage } = useImageUpload();

  const handleChange = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNestedChange = useCallback(
    (parent: string, field: string, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...((prev[parent] as Record<string, unknown>) || {}),
          [field]: value,
        },
      }));
    },
    [],
  );

  const toggleArrayItem = useCallback((field: string, value: string) => {
    setFormData((prev) => {
      const arr = (prev[field] as string[]) || [];
      const exists = arr.includes(value);
      return {
        ...prev,
        [field]: exists ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }, []);

  const addToArray = useCallback((field: string, value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => {
      const arr = (prev[field] as string[]) || [];
      if (arr.includes(value.trim())) return prev;
      return { ...prev, [field]: [...arr, value.trim()] };
    });
  }, []);

  const removeArrayItem = useCallback((field: string, index: number) => {
    setFormData((prev) => {
      const arr = (prev[field] as string[]) || [];
      return { ...prev, [field]: arr.filter((_, i) => i !== index) };
    });
  }, []);

  const addFixedPackage = useCallback(() => {
    if (!newPackage.slotName || !newPackage.startTime || !newPackage.endTime)
      return;
    setFormData((prev) => ({
      ...prev,
      fixedPackages: [
        ...((prev.fixedPackages as ExtendedVenue["fixedPackages"]) || []),
        { ...newPackage },
      ],
    }));
    setNewPackage({ slotName: "", startTime: "", endTime: "", price: 0 });
  }, [newPackage]);

  const removeFixedPackage = useCallback((index: number) => {
    setFormData((prev) => {
      const pkgs = (prev.fixedPackages as ExtendedVenue["fixedPackages"]) || [];
      return { ...prev, fixedPackages: pkgs.filter((_, i) => i !== index) };
    });
  }, []);

  const addPricingRule = useCallback(() => {
    if (!newRule.fromTime || !newRule.toTime) return;
    setFormData((prev) => {
      const pricing = (prev.pricing as NonNullable<
        ExtendedVenue["pricing"]
      >) || { pricingType: "fixedPricing", basePrice: 0, pricingRules: [] };
      const rules = pricing.pricingRules || [];
      return {
        ...prev,
        pricing: { ...pricing, pricingRules: [...rules, { ...newRule }] },
      };
    });
    setNewRule({ fromTime: "", toTime: "", price: 0 });
  }, [newRule]);

  const removePricingRule = useCallback((index: number) => {
    setFormData((prev) => {
      const pricing = (prev.pricing as NonNullable<
        ExtendedVenue["pricing"]
      >) || { pricingType: "fixedPricing", basePrice: 0, pricingRules: [] };
      const rules = pricing.pricingRules || [];
      return {
        ...prev,
        pricing: {
          ...pricing,
          pricingRules: rules.filter(
            (
              _: { fromTime: string; toTime: string; price: number },
              i: number,
            ) => i !== index,
          ),
        },
      };
    });
  }, []);

  const addRefundRule = useCallback(() => {
    if (!newRefundRule.daysBefore || !newRefundRule.refundPercentage) return;
    setFormData((prev) => {
      const canc =
        (prev.cancellation as {
          refundRules?: { daysBefore: number; refundPercentage: number }[];
        }) || {};
      const rules = [...(canc.refundRules || [])];
      rules.push({ ...newRefundRule });
      return { ...prev, cancellation: { ...canc, refundRules: rules } };
    });
    setNewRefundRule({ daysBefore: 0, refundPercentage: 0 });
  }, [newRefundRule]);

  const handleBlockedDateAdd = useCallback(() => {
    if (!newBlockedDate) return;
    addToArray("blockedDates", newBlockedDate);
    setNewBlockedDate("");
  }, [newBlockedDate, addToArray]);

  const handleBlockedTimeAdd = useCallback(() => {
    if (newBlockedTime.includes("-")) {
      const parts = newBlockedTime.split("-").map((s) => s.trim());
      if (parts.length !== 2 || !parts[0] || !parts[1]) return;
      setFormData((prev) => {
        const arr =
          (prev.blockedTimes as { fromTime: string; toTime: string }[]) || [];
        const value = { fromTime: parts[0], toTime: parts[1] };
        const exists = arr.some(
          (b) => b.fromTime === value.fromTime && b.toTime === value.toTime,
        );
        if (exists) return prev;
        return { ...prev, blockedTimes: [...arr, value] };
      });
    } else {
      setFormData((prev) => {
        const arr =
          (prev.blockedTimes as { fromTime: string; toTime: string }[]) || [];
        const value = { fromTime: newBlockedTime, toTime: newBlockedTimeTo };
        const exists = arr.some(
          (b) => b.fromTime === value.fromTime && b.toTime === value.toTime,
        );
        if (exists || !value.fromTime || !value.toTime) return prev;
        return { ...prev, blockedTimes: [...arr, value] };
      });
    }
    setNewBlockedTime("");
    setNewBlockedTimeTo("");
  }, [newBlockedTime, newBlockedTimeTo]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      handleChange("coverImage", url);
    } catch {
      // handled by hook
    }
    if (e.target) e.target.value = "";
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadFile(f)),
      );
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...((prev.galleryImages as string[]) || []), ...urls],
      }));
    } catch {
      // handled by hook
    }
    if (e.target) e.target.value = "";
  };

  const moveGalleryItem = useCallback((fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const arr = [...((prev.galleryImages as string[]) || [])];
      if (toIndex < 0 || toIndex >= arr.length) return prev;
      [arr[fromIndex], arr[toIndex]] = [arr[toIndex], arr[fromIndex]];
      return { ...prev, galleryImages: arr };
    });
  }, []);

  const allImages = useMemo(() => {
    const cover = formData.coverImage as string;
    const gallery = (formData.galleryImages as string[]) || [];
    return [cover, ...gallery].filter(Boolean) as string[];
  }, [formData.coverImage, formData.galleryImages]);

  const handleSave = async () => {
    const submitData = { ...formData };
    delete submitData.expectedVersion;
    submitData.expectedVersion = (
      formData as Record<string, unknown>
    ).expectedVersion;
    await updateVenue({
      id: venue._id,
      data: submitData as Record<string, unknown>,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  const pricing = formData.pricing as ExtendedVenue["pricing"] | undefined;
  const fixedPackages = formData.fixedPackages as
    | ExtendedVenue["fixedPackages"]
    | undefined;
  const cancellation = formData.cancellation as
    | ExtendedVenue["cancellation"]
    | undefined;

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          Changes to venue name, type, booking type, location, and contact
          information will require admin approval and take effect only after
          review.
        </AlertDescription>
      </Alert>

      {/* Core Details Card */}
      <Card className="p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Core Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name as string}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venueType">Venue Type</Label>
            <Select
              value={formData.venueType as string}
              onValueChange={(v) => handleChange("venueType", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {VENUE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Max Capacity</Label>
            <Input
              id="maxCapacity"
              type="number"
              value={formData.maxCapacity as number}
              onChange={(e) =>
                handleChange("maxCapacity", Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookingType">Booking Type</Label>
            <Select
              value={formData.bookingType as string}
              onValueChange={(v) => handleChange("bookingType", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixedBooking">Fixed Slots</SelectItem>
                <SelectItem value="flexibleBooking">Flexible Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Working Days</Label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const days = (formData.workingDays as string[]) || [];
              const selected = days.includes(day);
              return (
                <Badge
                  key={day}
                  variant={selected ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleArrayItem("workingDays", day)}
                >
                  {day.slice(0, 3)}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Space Attributes</Label>
          <div className="flex flex-wrap gap-2">
            {SPACE_ATTRIBUTES.map((item) => {
              const arr = (formData.spaceAttributes as string[]) || [];
              const selected = arr.includes(item);
              return (
                <Badge
                  key={item}
                  variant={selected ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleArrayItem("spaceAttributes", item)}
                >
                  {item}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Seating Configurations</Label>
          <div className="flex flex-wrap gap-2">
            {SEATING_CONFIGS.map((item) => {
              const arr = (formData.seatingConfigurations as string[]) || [];
              const selected = arr.includes(item);
              return (
                <Badge
                  key={item}
                  variant={selected ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleArrayItem("seatingConfigurations", item)}
                >
                  {item}
                </Badge>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Location Card */}
      <Card className="p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Location</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city as string}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Select
              value={formData.district as string}
              onValueChange={(v) => handleChange("district", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {KERALA_DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={formData.pincode as string}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <textarea
            id="address"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.address as string}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleMapsUrl">Google Maps Link</Label>
          <Input
            id="googleMapsUrl"
            value={formData.googleMapsUrl as string}
            onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
            placeholder="Paste Google Maps link"
          />
        </div>
      </Card>

      {/* Contact Card */}
      <Card className="p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <User className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Name</Label>
            <Input
              id="contactName"
              value={
                ((formData.contact as Record<string, string>) || {}).name || ""
              }
              onChange={(e) =>
                handleNestedChange("contact", "name", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={
                ((formData.contact as Record<string, string>) || {}).phone || ""
              }
              onChange={(e) =>
                handleNestedChange("contact", "phone", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={
                ((formData.contact as Record<string, string>) || {}).email || ""
              }
              onChange={(e) =>
                handleNestedChange("contact", "email", e.target.value)
              }
            />
          </div>
        </div>
      </Card>

      {/* Booking Configuration Card */}
      <Card className="p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Banknote className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Booking Configuration</h3>
        </div>

        {formData.bookingType === "fixedBooking" ? (
          <div className="space-y-3">
            <Label>Fixed Packages</Label>
            <div className="grid grid-cols-5 gap-2 items-end">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Slot Name</Label>
                <Input
                  value={newPackage.slotName}
                  onChange={(e) =>
                    setNewPackage((p) => ({ ...p, slotName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start</Label>
                <Input
                  type="time"
                  value={newPackage.startTime}
                  onChange={(e) =>
                    setNewPackage((p) => ({ ...p, startTime: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End</Label>
                <Input
                  type="time"
                  value={newPackage.endTime}
                  onChange={(e) =>
                    setNewPackage((p) => ({ ...p, endTime: e.target.value }))
                  }
                />
              </div>
              <Button className="mt-auto" onClick={addFixedPackage}>
                Add
              </Button>
            </div>
            {(fixedPackages || []).length > 0 && (
              <div className="space-y-1">
                {(fixedPackages || []).map((pkg, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-secondary/20 rounded-md p-2 text-sm"
                  >
                    <span className="font-medium flex-1">
                      {pkg.slotName || `Slot ${i + 1}`}
                    </span>
                    <span className="text-muted-foreground">
                      {pkg.startTime} - {pkg.endTime}
                    </span>
                    <Badge variant="secondary">₹{pkg.price}</Badge>
                    <button
                      type="button"
                      onClick={() => removeFixedPackage(i)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Working Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whOpen">Open Time</Label>
                <Input
                  id="whOpen"
                  type="time"
                  value={
                    ((formData.workingHours as Record<string, string>) || {})
                      .open || ""
                  }
                  onChange={(e) =>
                    handleNestedChange("workingHours", "open", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whClose">Close Time</Label>
                <Input
                  id="whClose"
                  type="time"
                  value={
                    ((formData.workingHours as Record<string, string>) || {})
                      .close || ""
                  }
                  onChange={(e) =>
                    handleNestedChange("workingHours", "close", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Slot Duration & Buffer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slotDuration">Slot Duration</Label>
                <Select
                  value={String(
                    (
                      (formData.flexibleBooking as Record<string, unknown>) ||
                      {}
                    ).slotDuration || 60,
                  )}
                  onValueChange={(v) =>
                    handleNestedChange(
                      "flexibleBooking",
                      "slotDuration",
                      Number(v),
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 mins</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bufferTime">Buffer Time</Label>
                <Select
                  value={String(
                    (
                      (formData.flexibleBooking as Record<string, unknown>) ||
                      {}
                    ).bufferTime || 0,
                  )}
                  onValueChange={(v) =>
                    handleNestedChange(
                      "flexibleBooking",
                      "bufferTime",
                      Number(v),
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Buffer</SelectItem>
                    <SelectItem value="15">15 mins</SelectItem>
                    <SelectItem value="30">30 mins</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing Type */}
            <div className="space-y-2">
              <Label>Pricing Type</Label>
              <div className="flex gap-3">
                <Badge
                  variant={
                    pricing?.pricingType === "fixedPricing"
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer select-none px-4 py-2"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      pricing: {
                        pricingType: "fixedPricing",
                        basePrice: 0,
                        pricingRules: [],
                      },
                    }));
                  }}
                >
                  Same Price All Day
                </Badge>
                <Badge
                  variant={
                    pricing?.pricingType === "timeBasedPricing"
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer select-none px-4 py-2"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      pricing: {
                        pricingType: "timeBasedPricing",
                        basePrice: 0,
                        pricingRules: [],
                      },
                    }));
                  }}
                >
                  Time Based Pricing
                </Badge>
              </div>
            </div>

            {/* Same Price (fixedPricing) */}
            {pricing?.pricingType === "fixedPricing" && (
              <div className="space-y-2">
                <Label htmlFor="samePrice">Price Per Slot (₹)</Label>
                <Input
                  id="samePrice"
                  type="number"
                  value={pricing.basePrice ?? 0}
                  onChange={(e) =>
                    handleNestedChange(
                      "pricing",
                      "basePrice",
                      Number(e.target.value),
                    )
                  }
                />
              </div>
            )}

            {/* Time Based Pricing */}
            {pricing?.pricingType === "timeBasedPricing" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (₹)</Label>
                  <p className="text-xs text-muted-foreground">
                    This base price applies when time-based pricing is active.
                  </p>
                  <Input
                    id="basePrice"
                    type="number"
                    value={pricing.basePrice ?? 0}
                    onChange={(e) =>
                      handleNestedChange(
                        "pricing",
                        "basePrice",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pricing Rules</Label>
                  <div className="grid grid-cols-4 gap-2 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">From</Label>
                      <Input
                        type="time"
                        value={newRule.fromTime}
                        onChange={(e) =>
                          setNewRule((r) => ({
                            ...r,
                            fromTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">To</Label>
                      <Input
                        type="time"
                        value={newRule.toTime}
                        onChange={(e) =>
                          setNewRule((r) => ({ ...r, toTime: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Price</Label>
                      <Input
                        type="number"
                        value={newRule.price || ""}
                        onChange={(e) =>
                          setNewRule((r) => ({
                            ...r,
                            price: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <Button className="mt-auto" onClick={addPricingRule}>
                      Add
                    </Button>
                  </div>
                  {(pricing?.pricingRules || []).length > 0 && (
                    <div className="space-y-1 mt-2">
                      {(pricing?.pricingRules || []).map((rule, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-secondary/20 rounded-md p-2 text-sm"
                        >
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="flex-1">
                            {rule.fromTime} - {rule.toTime}
                          </span>
                          <Badge variant="secondary">₹{rule.price}</Badge>
                          <button
                            type="button"
                            onClick={() => removePricingRule(i)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Cancellation Policy */}
        <div className="space-y-3 border-t border-border pt-4">
          <Label>Cancellation Policy</Label>
          <div className="flex gap-3">
            <Badge
              variant={
                cancellation?.policy === "refundable" ? "default" : "outline"
              }
              className="cursor-pointer select-none px-4 py-2"
              onClick={() =>
                handleNestedChange("cancellation", "policy", "refundable")
              }
            >
              Refundable
            </Badge>
            <Badge
              variant={
                cancellation?.policy === "nonRefundable" ? "default" : "outline"
              }
              className="cursor-pointer select-none px-4 py-2"
              onClick={() =>
                handleNestedChange("cancellation", "policy", "nonRefundable")
              }
            >
              Non-Refundable
            </Badge>
          </div>
          {cancellation?.policy === "refundable" && (
            <div className="space-y-3 pl-2 border-l-2 border-border/50">
              <div className="space-y-2">
                <Label>Refund Type</Label>
                <Select
                  value={cancellation?.refundType || "fullRefund"}
                  onValueChange={(v) =>
                    handleNestedChange("cancellation", "refundType", v)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullRefund">Full Refund</SelectItem>
                    <SelectItem value="timeBasedRefund">
                      Time Based Refund
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {cancellation?.refundType === "timeBasedRefund" && (
                <div className="space-y-2">
                  <Label>Refund Rules</Label>
                  <p className="text-xs text-muted-foreground">
                    Set refund percentages based on days before the event.
                  </p>
                  {(cancellation?.refundRules || []).map((rule, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-secondary/20 rounded-md p-2 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {rule.daysBefore}+ days before
                      </span>
                      <Badge variant="secondary">
                        {rule.refundPercentage}% refund
                      </Badge>
                      <button
                        type="button"
                        onClick={() => {
                          const rules = [...(cancellation?.refundRules || [])];
                          rules.splice(i, 1);
                          handleNestedChange(
                            "cancellation",
                            "refundRules",
                            rules,
                          );
                        }}
                        className="text-destructive hover:text-destructive/80 ml-auto"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">Days Before</Label>
                      <Input
                        type="number"
                        placeholder="7"
                        className="w-24"
                        value={newRefundRule.daysBefore || ""}
                        onChange={(e) =>
                          setNewRefundRule((r) => ({
                            ...r,
                            daysBefore: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Refund %</Label>
                      <Input
                        type="number"
                        placeholder="50"
                        className="w-24"
                        value={newRefundRule.refundPercentage || ""}
                        onChange={(e) =>
                          setNewRefundRule((r) => ({
                            ...r,
                            refundPercentage: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRefundRule}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="space-y-2 border-t border-border pt-4">
          <Label className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Amenities
          </Label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((item) => {
              const arr = (formData.amenities as string[]) || [];
              const selected = arr.includes(item);
              return (
                <Badge
                  key={item}
                  variant={selected ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleArrayItem("amenities", item)}
                >
                  {item}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Blocked Dates / Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="space-y-2">
            <Label>Blocked Dates</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleBlockedDateAdd}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {((formData.blockedDates as string[]) || []).map((d, i) => {
                const date = d.includes("T")
                  ? parseISO(d)
                  : new Date(d + "T00:00:00");
                return (
                  <Badge key={i} variant="outline" className="gap-1">
                    {format(date, "MMM d, yyyy")}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("blockedDates", i)}
                      className="text-destructive hover:text-destructive/80 leading-none"
                    >
                      &times;
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Blocked Times</Label>
            <div className="flex gap-2 items-end">
              <div className="space-y-1">
                <Label className="text-xs">From</Label>
                <Input
                  type="time"
                  value={newBlockedTime}
                  onChange={(e) => setNewBlockedTime(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">To</Label>
                <Input
                  type="time"
                  value={newBlockedTimeTo}
                  onChange={(e) => setNewBlockedTimeTo(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleBlockedTimeAdd}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {(
                (formData.blockedTimes as {
                  fromTime: string;
                  toTime: string;
                }[]) || []
              ).map((t, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  {t.fromTime}–{t.toTime}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("blockedTimes", i)}
                    className="text-destructive hover:text-destructive/80 leading-none"
                  >
                    &times;
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Media Card */}
      <Card className="p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Media</h3>
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <div className="flex items-center gap-4">
            <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-border bg-secondary/30 shrink-0">
              {formData.coverImage ? (
                <img
                  src={formData.coverImage as string}
                  alt="Cover"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No cover
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleCoverUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingImage}
                onClick={() => coverInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                {isUploadingImage ? "Uploading..." : "Upload Cover"}
              </Button>
              {Boolean(formData.coverImage) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleChange("coverImage", "")}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="space-y-2">
          <Label>Gallery Images</Label>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleGalleryUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploadingImage}
            onClick={() => galleryInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-1" />
            {isUploadingImage ? "Uploading..." : "Add Images"}
          </Button>

          {((formData.galleryImages as string[]) || []).length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {((formData.galleryImages as string[]) || []).map((url, i) => (
                <div
                  key={i}
                  className="relative group rounded-lg overflow-hidden border border-border aspect-[3/2] bg-secondary/20"
                >
                  <img
                    src={url}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(i + 1);
                      setLightboxOpen(true);
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-0.5 p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="p-0.5 text-white hover:text-white/80 disabled:opacity-30"
                      disabled={i === 0}
                      onClick={() => moveGalleryItem(i, i - 1)}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-0.5 text-white hover:text-white/80 disabled:opacity-30"
                      disabled={
                        i ===
                        ((formData.galleryImages as string[]) || []).length - 1
                      }
                      onClick={() => moveGalleryItem(i, i + 1)}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-0.5 text-white hover:text-red-400 ml-2"
                      onClick={() => removeArrayItem("galleryImages", i)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Lightbox */}
      {lightboxOpen &&
        allImages.length > 0 &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <div
              className="flex flex-col items-center justify-center w-full h-full px-4 py-4 sm:py-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex-1 flex items-center justify-center max-w-4xl max-h-[calc(100vh-160px)] w-full">
                <img
                  src={allImages[lightboxIndex]}
                  alt={`Image ${lightboxIndex + 1}`}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>

              <div className="mt-4 text-center text-white text-sm font-semibold">
                {lightboxIndex + 1} / {allImages.length}
              </div>

              <div className="flex items-center gap-4 mt-6 sm:mt-8">
                <button
                  onClick={() => setLightboxIndex((i) => Math.max(0, i - 1))}
                  className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30"
                  disabled={lightboxIndex === 0}
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2 overflow-x-auto max-w-[calc(100vw-200px)] sm:max-w-none px-2 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        idx === lightboxIndex
                          ? "border-white/80 scale-110"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setLightboxIndex((i) =>
                      Math.min(allImages.length - 1, i + 1),
                    )
                  }
                  className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30"
                  disabled={lightboxIndex === allImages.length - 1}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
