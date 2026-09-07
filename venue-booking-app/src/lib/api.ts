"use client";

// Mock API integration layer for BookMyVenue
// Persists data in localStorage to mimic backend endpoints with simulated delays.

export interface Venue {
  id: string;
  name: string;
  description: string;
  seatingCapacity: number;
  city: string;
  address: string;
  pricePerHour: number;
  pricePerDay: number;
  rating: number;
  reviewsCount: number;
  venueType: "CONFERENCE" | "WEDDING" | "COWORKING" | "STUDIO" | "ROOFTOP" | "GARDEN";
  images: string[];
  amenities: ("AC" | "WIFI" | "PROJECTOR")[];
  ownerId: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  parking: boolean;
  maxAdvanceBookingDays?: number;
}

export interface AvailabilityRule {
  id: string;
  venueId: string;
  name: string;
  isActive: boolean;
  durationType: "HOURLY" | "DAILY";
  durationHour: number;
  weekStartDay: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  weekEndDay: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  operatingStartTime: string; // HH:MM
  operatingEndTime: string; // HH:MM
  weekdayDayRate?: number;
  weekdayNightRate?: number;
  weekendDayRate?: number;
  weekendNightRate?: number;
}

export interface ExceptionRule {
  id: string;
  venueId: string;
  name: string;
  type: "holiday" | "maintenance" | "private_event" | "restriction";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
}

// Initial mock rules data
const DEFAULT_AVAILABILITY_RULES: AvailabilityRule[] = [
  { id: "ar-1", venueId: "v-1", name: "Weekday Standard", isActive: true, durationType: "HOURLY", durationHour: 2, weekStartDay: "MONDAY", weekEndDay: "FRIDAY", operatingStartTime: "08:00", operatingEndTime: "18:00", weekdayDayRate: 75, weekdayNightRate: 90, weekendDayRate: 100, weekendNightRate: 120 },
  { id: "ar-2", venueId: "v-1", name: "Weekend Hours", isActive: false, durationType: "HOURLY", durationHour: 2, weekStartDay: "SATURDAY", weekEndDay: "SUNDAY", operatingStartTime: "10:00", operatingEndTime: "16:00", weekdayDayRate: 75, weekdayNightRate: 90, weekendDayRate: 100, weekendNightRate: 120 },
  { id: "ar-3", venueId: "v-2", name: "Full Week Event Hours", isActive: true, durationType: "HOURLY", durationHour: 4, weekStartDay: "SUNDAY", weekEndDay: "SATURDAY", operatingStartTime: "08:00", operatingEndTime: "22:00", weekdayDayRate: 350, weekdayNightRate: 400, weekendDayRate: 450, weekendNightRate: 500 },
  { id: "ar-4", venueId: "v-3", name: "Standard Coworking Shift", isActive: true, durationType: "HOURLY", durationHour: 1, weekStartDay: "MONDAY", weekEndDay: "FRIDAY", operatingStartTime: "09:00", operatingEndTime: "18:00", weekdayDayRate: 90, weekdayNightRate: 110, weekendDayRate: 120, weekendNightRate: 140 },
  { id: "ar-5", venueId: "v-4", name: "Production Shift", isActive: true, durationType: "HOURLY", durationHour: 2, weekStartDay: "MONDAY", weekEndDay: "SATURDAY", operatingStartTime: "08:00", operatingEndTime: "20:00", weekdayDayRate: 60, weekdayNightRate: 80, weekendDayRate: 90, weekendNightRate: 110 },
  { id: "ar-6", venueId: "v-5", name: "Rooftop Nights Only", isActive: true, durationType: "HOURLY", durationHour: 3, weekStartDay: "THURSDAY", weekEndDay: "SUNDAY", operatingStartTime: "16:00", operatingEndTime: "23:00", weekdayDayRate: 250, weekdayNightRate: 300, weekendDayRate: 350, weekendNightRate: 400 },
  { id: "ar-7", venueId: "v-6", name: "Garden Day Hours", isActive: true, durationType: "HOURLY", durationHour: 2, weekStartDay: "SUNDAY", weekEndDay: "SATURDAY", operatingStartTime: "09:00", operatingEndTime: "17:00", weekdayDayRate: 120, weekdayNightRate: 140, weekendDayRate: 160, weekendNightRate: 180 },
];

const DEFAULT_EXCEPTION_RULES: ExceptionRule[] = [
  { id: "er-1", venueId: "v-1", name: "Christmas Holiday Shutdown", type: "holiday", startDate: "2026-12-24", endDate: "2026-12-26" },
  { id: "er-2", venueId: "v-1", name: "Boardroom Audio System Maintenance", type: "maintenance", startDate: "2026-07-10", endDate: "2026-07-10", startTime: "09:00", endTime: "13:00" },
  { id: "er-3", venueId: "v-2", name: "Annual Gala Private Event", type: "private_event", startDate: "2026-08-15", endDate: "2026-08-15" }
];

// Helper to delay execution to simulate network request delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const getStorageItem = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Retrieve state or initialize
const getVenuesData = (): Venue[] => {
  const currentVenues = getStorageItem<any[]>("venue_booking_venues", []);
  
  // Backwards compatibility check: ensure status field and new fields exist
  let updated = false;
  const venues: Venue[] = currentVenues.map((v) => {
    // If it has old capacity field, map it
    if (v.capacity && !v.seatingCapacity) {
      v.seatingCapacity = v.capacity;
      delete v.capacity;
      updated = true;
    }
    // If it has old location field, map it
    if (v.location && !v.city) {
      v.city = v.location;
      delete v.location;
      updated = true;
    }
    // If it has old type field, map it
    if (v.type && !v.venueType) {
      v.venueType = v.type.toUpperCase();
      delete v.type;
      updated = true;
    }
    // If it has old status labels, map them
    if (v.status && (v.status === "approved" || v.status === "pending" || v.status === "rejected")) {
      v.status = v.status === "approved" ? "VERIFIED" : v.status.toUpperCase();
      updated = true;
    }
    // Map amenities to uppercase set
    if (v.amenities && v.amenities.length > 0 && typeof v.amenities[0] === "string" && v.amenities[0] !== v.amenities[0].toUpperCase()) {
      v.amenities = v.amenities.map((a: string) => {
        const lower = a.toLowerCase();
        if (lower.includes("wifi") || lower.includes("wi-fi")) return "WIFI";
        if (lower.includes("ac")) return "AC";
        if (lower.includes("projector")) return "PROJECTOR";
        return "WIFI"; // fallback
      });
      updated = true;
    }
    
    // ensure ownerId exists
    if (!v.ownerId) {
      v.ownerId = "host-1";
      updated = true;
    }
    return v;
  });

  if (updated && venues.length > 0) {
    setStorageItem("venue_booking_venues", venues);
  }
  
  return venues;
};

const getAvailabilityData = (): AvailabilityRule[] => {
  const rules = getStorageItem<AvailabilityRule[]>("bookmyvenue_availability_rules", []);
  if (rules.length === 0) {
    setStorageItem("bookmyvenue_availability_rules", DEFAULT_AVAILABILITY_RULES);
    return DEFAULT_AVAILABILITY_RULES;
  }
  return rules;
};

const getExceptionData = (): ExceptionRule[] => {
  const exceptions = getStorageItem<ExceptionRule[]>("bookmyvenue_exception_rules", []);
  if (exceptions.length === 0) {
    setStorageItem("bookmyvenue_exception_rules", DEFAULT_EXCEPTION_RULES);
    return DEFAULT_EXCEPTION_RULES;
  }
  return exceptions;
};

// API Services Client
export const api = {
  // Venues CRUD
  async getOwnerVenues(
    ownerId: string,
    options: { search?: string; status?: string; page?: number; limit?: number } = {}
  ): Promise<{ data: Venue[]; total: number; page: number; limit: number }> {
    await delay(350);
    const { search = "", status = "all", page = 1, limit = 9 } = options;
    const allVenues = getVenuesData();

    // Filter by owner
    let filtered = allVenues.filter((v) => v.ownerId === ownerId || v.ownerId === "host-custom");

    // Filter by status (VERIFIED, PENDING, REJECTED)
    if (status !== "all") {
      const matchStatus = status === "approved" ? "VERIFIED" : status.toUpperCase();
      filtered = filtered.filter((v) => v.status === matchStatus);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q)
      );
    }

    // Pagination calculations
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit
    };
  },

  async getVenueDetails(venueId: string): Promise<Venue> {
    await delay(250);
    const venues = getVenuesData();
    const venue = venues.find((v) => v.id === venueId);
    if (!venue) {
      throw new Error(`Venue with ID ${venueId} not found.`);
    }
    return venue;
  },

  async createVenue(
    venueData: Omit<Venue, "id" | "rating" | "reviewsCount" | "ownerId" | "status"> & { status?: "approved" | "pending" | "rejected" },
    initialAvailabilityRule?: Omit<AvailabilityRule, "id" | "venueId" | "isActive"> & { isActive: boolean }
  ): Promise<Venue> {
    await delay(450);
    const venues = getVenuesData();
    const newId = `v-${Math.random().toString(36).substring(2, 9)}`;

    const newVenue: Venue = {
      ...venueData,
      id: newId,
      rating: 5.0,
      reviewsCount: 0,
      ownerId: "host-custom",
      status: (venueData.status === "approved" ? "VERIFIED" : (venueData.status ? venueData.status.toUpperCase() : "PENDING")) as any
    };

    // Save Venue
    venues.unshift(newVenue);
    setStorageItem("venue_booking_venues", venues);

    // Save Initial Rule if provided
    if (initialAvailabilityRule) {
      const rules = getAvailabilityData();
      const newRuleId = `ar-${Math.random().toString(36).substring(2, 9)}`;
      const newRule: AvailabilityRule = {
        ...initialAvailabilityRule,
        id: newRuleId,
        venueId: newId
      };
      rules.push(newRule);
      setStorageItem("bookmyvenue_availability_rules", rules);
    }

    return newVenue;
  },

  async updateVenue(venueId: string, venueData: Partial<Venue>): Promise<Venue> {
    await delay(300);
    const venues = getVenuesData();
    const index = venues.findIndex((v) => v.id === venueId);
    if (index === -1) {
      throw new Error(`Venue with ID ${venueId} not found.`);
    }

    const updatedVenue = {
      ...venues[index],
      ...venueData
    };

    venues[index] = updatedVenue;
    setStorageItem("venue_booking_venues", venues);
    return updatedVenue;
  },

  async deleteVenue(venueId: string): Promise<boolean> {
    await delay(250);
    const venues = getVenuesData();
    const filtered = venues.filter((v) => v.id !== venueId);
    setStorageItem("venue_booking_venues", filtered);

    // Clean up rules & exceptions
    const rules = getAvailabilityData().filter((r) => r.venueId !== venueId);
    setStorageItem("bookmyvenue_availability_rules", rules);

    const exceptions = getExceptionData().filter((e) => e.venueId !== venueId);
    setStorageItem("bookmyvenue_exception_rules", exceptions);

    return true;
  },

  // Availability Rules
  async getAvailabilityRules(venueId: string): Promise<AvailabilityRule[]> {
    await delay(200);
    const rules = getAvailabilityData();
    return rules.filter((r) => r.venueId === venueId);
  },

  async createAvailabilityRule(
    venueId: string,
    rule: Omit<AvailabilityRule, "id" | "venueId">
  ): Promise<AvailabilityRule> {
    await delay(300);
    const rules = getAvailabilityData();
    const newId = `ar-${Math.random().toString(36).substring(2, 9)}`;
    
    // If setting active, deactivate others
    let updatedRules = [...rules];
    if (rule.isActive) {
      updatedRules = updatedRules.map((r) =>
        r.venueId === venueId ? { ...r, isActive: false } : r
      );
    }

    const newRule: AvailabilityRule = {
      ...rule,
      id: newId,
      venueId
    };

    updatedRules.push(newRule);
    setStorageItem("bookmyvenue_availability_rules", updatedRules);
    return newRule;
  },

  async deleteAvailabilityRule(venueId: string, ruleId: string): Promise<boolean> {
    await delay(250);
    const rules = getAvailabilityData();
    const filtered = rules.filter((r) => r.id !== ruleId);
    setStorageItem("bookmyvenue_availability_rules", filtered);
    return true;
  },

  async activateAvailabilityRule(venueId: string, ruleId: string): Promise<AvailabilityRule[]> {
    await delay(300);
    const rules = getAvailabilityData();
    const updated = rules.map((r) => {
      if (r.venueId === venueId) {
        return {
          ...r,
          isActive: r.id === ruleId
        };
      }
      return r;
    });

    setStorageItem("bookmyvenue_availability_rules", updated);
    return updated.filter((r) => r.venueId === venueId);
  },

  // Exception Rules
  async getExceptionRules(venueId: string): Promise<ExceptionRule[]> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`http://localhost:8080/api/owner/venue/${venueId}/exceptions`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        return data.map((e: any) => ({
          id: String(e.id),
          venueId: String(e.venueId),
          name: e.reason || "Closure Block",
          type: (e.exceptionType || "holiday").toLowerCase() as any,
          startDate: e.exceptionDate || "",
          endDate: e.exceptionDate || "",
          startTime: e.startTime ? e.startTime.substring(0, 5) : undefined,
          endTime: e.endTime ? e.endTime.substring(0, 5) : undefined
        })).filter((e: any) => e.startDate);
      }
    } catch (err) {
      console.warn("Backend getExceptionRules failed, falling back to local storage:", err);
    }
    const exceptions = getExceptionData();
    return exceptions.filter((e) => e.venueId === venueId);
  },

  async createExceptionRule(
    venueId: string,
    exception: Omit<ExceptionRule, "id" | "venueId">
  ): Promise<ExceptionRule> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const payload = {
        exceptionDate: exception.startDate,
        startTime: exception.startTime ? (exception.startTime.includes(":") && exception.startTime.split(":").length === 2 ? `${exception.startTime}:00` : exception.startTime) : null,
        endTime: exception.endTime ? (exception.endTime.includes(":") && exception.endTime.split(":").length === 2 ? `${exception.endTime}:00` : exception.endTime) : null,
        exceptionType: (exception.type === "maintenance" ? "MAINTENANCE" : (exception.type === "holiday" ? "HOLIDAY" : "TEMPORARY_UNAVAILABLE")),
        reason: exception.name
      };

      const res = await fetch(`http://localhost:8080/api/owner/venue/${venueId}/exceptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const e = await res.json();
        return {
          id: String(e.id),
          venueId: String(e.venueId),
          name: e.reason || "Closure Block",
          type: (e.exceptionType || "holiday").toLowerCase() as any,
          startDate: e.exceptionDate || "",
          endDate: e.exceptionDate || "",
          startTime: e.startTime ? e.startTime.substring(0, 5) : undefined,
          endTime: e.endTime ? e.endTime.substring(0, 5) : undefined
        };
      }
    } catch (err) {
      console.warn("Backend createExceptionRule failed, falling back to local storage:", err);
    }

    const exceptions = getExceptionData();
    const newId = `er-${Math.random().toString(36).substring(2, 9)}`;

    const newException: ExceptionRule = {
      ...exception,
      id: newId,
      venueId
    };

    exceptions.push(newException);
    setStorageItem("bookmyvenue_exception_rules", exceptions);
    return newException;
  },

  async deleteExceptionRule(venueId: string, exceptionId: string): Promise<boolean> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`http://localhost:8080/api/owner/venue/${venueId}/exceptions/${exceptionId}/cancel`, {
        method: "PUT",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.warn("Backend deleteExceptionRule failed, falling back to local storage:", err);
    }

    const exceptions = getExceptionData();
    const filtered = exceptions.filter((e) => e.id !== exceptionId);
    setStorageItem("bookmyvenue_exception_rules", filtered);
    return true;
  }
};
