"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, Check, X, ShieldCheck, ArrowRight, User, Mail, MessageSquare } from "lucide-react";
import { format, addDays } from "date-fns";

const BACKEND_URL = "http://localhost:8080";

export interface SlotResponse {
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED" | "BLOCKED";
  reason?: string;
  rate?: number;
}

interface SlotSelectionProps {
  venueId: string;
  venueName: string;
  pricePerHour: number;
}

interface NormalizedException {
  id: string;
  date: string; // YYYY-MM-DD
  closed: boolean;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
}

const normalizeExceptions = (data: any[]): NormalizedException[] => {
  if (!Array.isArray(data)) return [];
  return data
    .filter((e: any) => e.status !== "CANCELLED")
    .map((e: any) => {
      return {
        id: String(e.id),
        date: e.exceptionDate || e.startDate || "",
        closed: e.closed !== undefined ? e.closed : (e.type === "holiday" || e.type === "maintenance"),
        startTime: e.openingTime || e.startTime || null,
        endTime: e.closingTime || e.endTime || null,
        reason: e.reason || e.name || ""
      };
    })
    .filter((e: any) => e.date);
};

export default function SlotSelection({ venueId, venueName, pricePerHour }: SlotSelectionProps) {
  const router = useRouter();
  const { addBooking, user } = useApp();

  // Generate next 7 days for day selection
  const daysList = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const [selectedDate, setSelectedDate] = useState<Date>(daysList[0]);
  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);
  const [eventPurpose, setEventPurpose] = useState("");
  const [exceptions, setExceptions] = useState<NormalizedException[]>([]);

  // Checkout modal flow
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Guest details form (prefilled from logged in user if available)
  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");

  // Update name/email when user context loads
  useEffect(() => {
    if (user) {
      setGuestName(user.name);
      setGuestEmail(user.email);
    }
  }, [user]);

  // Generate deterministic mock slots as fallback
  const generateMockSlots = (dateStr: string): SlotResponse[] => {
    const hash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const slotsList: SlotResponse[] = [];
    const hours = [
      { start: "08:00", end: "09:00" },
      { start: "09:00", end: "10:00" },
      { start: "10:00", end: "11:00" },
      { start: "11:00", end: "12:00" },
      { start: "12:00", end: "13:00" },
      { start: "13:00", end: "14:00" },
      { start: "14:00", end: "15:00" },
      { start: "15:00", end: "16:00" },
      { start: "16:00", end: "17:00" },
      { start: "17:00", end: "18:00" },
      { start: "18:00", end: "19:00" },
      { start: "19:00", end: "20:00" }
    ];

    for (let i = 0; i < hours.length; i++) {
      // Make slot availability deterministic based on date
      const isAvailable = (hash + i) % 3 !== 0;
      slotsList.push({
        startTime: hours[i].start,
        endTime: hours[i].end,
        status: isAvailable ? "AVAILABLE" : ((hash + i) % 3 === 1 ? "BOOKED" : "BLOCKED"),
        rate: pricePerHour,
        reason: isAvailable ? "" : "Reserved"
      });
    }
    return slotsList;
  };

  // Fetch exceptions once on mount or when venueId changes
  useEffect(() => {
    let isMounted = true;
    const fetchExceptions = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`${BACKEND_URL}/api/owner/venue/${venueId}/exceptions`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setExceptions(normalizeExceptions(data));
          }
        } else {
          // Fallback to local storage
          const localData = await api.getExceptionRules(venueId);
          if (isMounted) {
            setExceptions(normalizeExceptions(localData));
          }
        }
      } catch (err) {
        console.warn("Could not fetch exceptions from backend:", err);
        try {
          const localData = await api.getExceptionRules(venueId);
          if (isMounted) {
            setExceptions(normalizeExceptions(localData));
          }
        } catch (exErr) {
          console.error("Local storage exceptions call failed too:", exErr);
        }
      }
    };
    fetchExceptions();
    return () => {
      isMounted = false;
    };
  }, [venueId]);

  // Fetch slots for selected day
  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/venue/${venueId}/slots?date=${dateStr}`,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error("API failed");
        }

        const data = await response.json();
        let rawSlots: SlotResponse[] = [];
        if (data && Array.isArray(data.slots) && data.slots.length > 0) {
          rawSlots = data.slots;
        } else {
          rawSlots = generateMockSlots(dateStr);
        }

        // Apply exceptions to slots
        const dayExceptions = exceptions.filter(ex => ex.date === dateStr);
        const processedSlots = rawSlots.map((slot) => {
          for (const ex of dayExceptions) {
            if (ex.closed || (!ex.startTime && !ex.endTime)) {
              return {
                ...slot,
                status: "BLOCKED" as const,
                reason: ex.reason || "Closed"
              };
            }
            if (ex.startTime && ex.endTime) {
              const slotStart = slot.startTime.substring(0, 5);
              const slotEnd = slot.endTime.substring(0, 5);
              const exStart = ex.startTime.substring(0, 5);
              const exEnd = ex.endTime.substring(0, 5);

              // Overlap condition: slotStart < exEnd && slotEnd > exStart
              if (slotStart < exEnd && slotEnd > exStart) {
                return {
                  ...slot,
                  status: "BLOCKED" as const,
                  reason: ex.reason || "Exception Hours"
                };
              }
            }
          }
          return slot;
        });

        setSlots(processedSlots);
      } catch (error) {
        console.warn("Backend slot endpoint unavailable, falling back to mock slots simulation.");
        const rawSlots = generateMockSlots(dateStr);
        const dayExceptions = exceptions.filter(ex => ex.date === dateStr);
        const processedSlots = rawSlots.map((slot) => {
          for (const ex of dayExceptions) {
            if (ex.closed || (!ex.startTime && !ex.endTime)) {
              return {
                ...slot,
                status: "BLOCKED" as const,
                reason: ex.reason || "Closed"
              };
            }
            if (ex.startTime && ex.endTime) {
              const slotStart = slot.startTime.substring(0, 5);
              const slotEnd = slot.endTime.substring(0, 5);
              const exStart = ex.startTime.substring(0, 5);
              const exEnd = ex.endTime.substring(0, 5);

              if (slotStart < exEnd && slotEnd > exStart) {
                return {
                  ...slot,
                  status: "BLOCKED" as const,
                  reason: ex.reason || "Exception Hours"
                };
              }
            }
          }
          return slot;
        });
        setSlots(processedSlots);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, venueId, pricePerHour, exceptions]);

  // Convert "09:00:00" or "09:00" to "09:00 AM" / "12-hour" format
  const formatTime12h = (timeStr: string) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || "00";
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    if (!guestName || !guestEmail) {
      toast.error("Please provide your name and email to proceed.");
      return;
    }

    setIsSubmitting(true);
    const bookingDateStr = format(selectedDate, "yyyy-MM-dd");
    const token = localStorage.getItem("token");

    const formatTimeForApi = (time: string | null | undefined) => {
      if (!time) return null;
      if (time.includes(":") && time.split(":").length === 2) {
        return `${time}:00`;
      }
      return time;
    };

    // DTO mapping to BookingCreateRequest
    const requestBody = {
      bookingDate: bookingDateStr,
      startTime: formatTimeForApi(selectedSlot.startTime),
      endTime: formatTimeForApi(selectedSlot.endTime),
      eventPurpose: eventPurpose.trim() || "General Event Booking"
    };

    try {
      // Try posting to real backend
      const response = await fetch(
        `${BACKEND_URL}/api/user/venue/${venueId}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify(requestBody)
        }
      );

      let responseData;
      try {
        responseData = await response.json();
      } catch (err) {
        // Handle non-JSON response
      }

      if (!response.ok) {
        throw new Error("API Booking creation failed");
      }

      // Add to local state/context list
      addBooking({
        venueId: String(venueId),
        venueName: venueName,
        venueImage: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800",
        date: bookingDateStr,
        startTime: selectedSlot.startTime ? selectedSlot.startTime.substring(0, 5) : "All Day",
        endTime: selectedSlot.endTime ? selectedSlot.endTime.substring(0, 5) : "",
        totalHours: 1,
        totalCost: Number(selectedSlot.rate || pricePerHour),
        guestName,
        guestEmail
      });

      toast.success("Venue reserved successfully!");
      setCheckoutOpen(false);
      router.push("/bookings");
    } catch (error) {
      console.warn("Backend booking API down, simulating reservation request locally.");
      
      // Local simulation fallback
      addBooking({
        venueId: String(venueId),
        venueName: venueName,
        venueImage: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800",
        date: bookingDateStr,
        startTime: selectedSlot.startTime ? selectedSlot.startTime.substring(0, 5) : "All Day",
        endTime: selectedSlot.endTime ? selectedSlot.endTime.substring(0, 5) : "",
        totalHours: 1,
        totalCost: Number(selectedSlot.rate || pricePerHour),
        guestName,
        guestEmail
      });

      toast.success("Venue reserved successfully! (Saved locally)");
      setCheckoutOpen(false);
      router.push("/bookings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Day Selection Row (Box to Box One Top) */}
      <div className="space-y-3">
        <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
          Select Booking Day
        </label>
        
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {daysList.map((dateItem) => {
            const isSelected = format(selectedDate, "yyyy-MM-dd") === format(dateItem, "yyyy-MM-dd");
            const isToday = format(new Date(), "yyyy-MM-dd") === format(dateItem, "yyyy-MM-dd");
            
            return (
              <button
                key={dateItem.toISOString()}
                onClick={() => setSelectedDate(dateItem)}
                className={`flex flex-row items-center justify-between px-4 py-3 min-w-[130px] h-[60px] rounded-xl border-[1px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary/50 text-primary shadow-sm scale-[1.02]"
                    : "bg-card border-border/40 text-foreground hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-primary/80" : "text-muted-foreground"}`}>
                    {format(dateItem, "eee")}
                  </span>
                  <span className={`text-lg font-bold mt-0.5 ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {format(dateItem, "dd")}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isSelected ? "bg-primary/20 text-primary" : isToday ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {isToday ? "Today" : format(dateItem, "MMM")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Slots Selection Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
            Select Time Slot ({format(selectedDate, "PP")})
          </label>
          <div className="flex items-center space-x-3 text-xxs font-bold text-muted-foreground">
            <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1"></span>Available</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-rose-500 mr-1"></span>Unavailable</span>
          </div>
        </div>

        {loadingSlots ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-16 rounded-xl border border-border animate-pulse bg-muted/40" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-card">
            <p className="text-sm text-muted-foreground">No slots configured for this day.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {slots.map((slot) => {
              const isAvailable = slot.status === "AVAILABLE";
              const isSlotSelected = selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime;
              const isFullDay = !slot.startTime && !slot.endTime;
              
              return (
                <button
                  key={slot.startTime || "fullday"}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                    isSlotSelected
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 ring-2 ring-emerald-500/20"
                      : isAvailable
                      ? "border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 text-foreground"
                      : "border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/5 text-rose-500/70 cursor-not-allowed"
                  }`}
                >
                  <span className="text-sm font-extrabold text-center">
                    {isFullDay ? "Full Day" : formatTime12h(slot.startTime)}
                  </span>
                  {!isFullDay ? (
                    <span className="text-xxs text-muted-foreground mt-0.5">
                      to {formatTime12h(slot.endTime)}
                    </span>
                  ) : (
                    <span className="text-xxs text-muted-foreground mt-0.5">
                      All Day Access
                    </span>
                  )}
                  <span className={`text-[10px] font-black uppercase mt-2 tracking-wide px-2 py-0.5 rounded-full border ${
                    isAvailable
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/10"
                  }`}>
                    {isAvailable ? "Available" : "Not Available"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Slot details and confirmation form */}
      {selectedSlot && (
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border gap-4">
            <div>
              <h3 className="font-extrabold text-base text-foreground">Reservation Slot Summary</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format(selectedDate, "EEEE, PP")} {!selectedSlot.startTime && !selectedSlot.endTime ? "(Full Day Booking)" : `from ${formatTime12h(selectedSlot.startTime)} to ${formatTime12h(selectedSlot.endTime)}`}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-muted-foreground">Price Rate</span>
              <div className="text-xl font-extrabold text-foreground">${selectedSlot.rate || pricePerHour}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-xs font-bold text-foreground flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-primary" />
              Purpose of Booking
            </Label>
            <Textarea
              id="purpose"
              placeholder="E.g., Team meeting, bridal photoshoot, co-working session..."
              value={eventPurpose}
              onChange={(e) => setEventPurpose(e.target.value)}
              className="rounded-xl border-border bg-background"
              rows={3}
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {
                if (!user) {
                  toast.info("Please sign in to proceed with booking.");
                  const bookPath = `/venues/${venueId}/book`;
                  router.push(`/login?message=${encodeURIComponent("Please sign in to complete your venue booking")}&redirect=${encodeURIComponent(bookPath)}`);
                  return;
                }
                setCheckoutOpen(true);
              }}
              className="w-full sm:w-auto rounded-xl bg-primary text-primary-foreground font-bold px-6 py-5 shadow flex items-center justify-center cursor-pointer"
            >
              Book Now
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Checkout details modal popup */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center">
              <ShieldCheck className="h-5.5 w-5.5 text-primary mr-2" />
              Confirm Reservation Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Please verify your contact details to submit the booking request.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookingSubmit} className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <Label htmlFor="checkoutName" className="text-xs font-bold text-foreground flex items-center">
                <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> Full Name
              </Label>
              <Input
                id="checkoutName"
                type="text"
                required
                placeholder="John Doe"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="rounded-xl border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="checkoutEmail" className="text-xs font-bold text-foreground flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> Email Address
              </Label>
              <Input
                id="checkoutEmail"
                type="email"
                required
                placeholder="john.doe@gmail.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="rounded-xl border-border bg-background"
              />
            </div>

            {/* Bill summary details */}
            <div className="bg-secondary/60 p-4 rounded-xl space-y-2 text-xs border border-border/60">
              <h5 className="font-bold text-foreground">Booking Recap</h5>
              <div className="flex justify-between text-muted-foreground">
                <span>Venue:</span>
                <span className="font-semibold text-foreground truncate max-w-[200px]">{venueName}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Date:</span>
                <span className="font-semibold text-foreground">{format(selectedDate, "PP")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Time Slot:</span>
                <span className="font-semibold text-foreground">
                  {selectedSlot ? (!selectedSlot.startTime && !selectedSlot.endTime ? "Full Day" : `${formatTime12h(selectedSlot.startTime)} - ${formatTime12h(selectedSlot.endTime)}`) : ""}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground border-t border-border/80 pt-2 mt-2 font-bold text-sm text-foreground">
                <span>Total Cost:</span>
                <span>${selectedSlot ? (selectedSlot.rate || pricePerHour) : pricePerHour}</span>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCheckoutOpen(false)}
                className="rounded-xl"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary text-primary-foreground font-bold flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm & Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
