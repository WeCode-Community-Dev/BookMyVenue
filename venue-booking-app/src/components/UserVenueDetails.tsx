"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { api, Venue } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, MapPin, Star, Sparkles, Check, Info, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const HOURS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

interface UserVenueDetailsProps {
  venueId: string;
  previewMode?: boolean;
}

export default function UserVenueDetails({ venueId, previewMode = false }: UserVenueDetailsProps) {
  const router = useRouter();
  const { addBooking } = useApp();

  // Find Venue via API
  const [venue, setVenue] = useState<Venue | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking details state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");

  // Dialog and Checkout flow state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"details" | "payment" | "success">("details");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getVenueDetails(venueId)
      .then((data) => {
        if (isMounted) {
          setVenue(data);
          setActiveImage(data.images?.[0] || "");
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load venue details.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [venueId]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-background min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-muted-foreground text-sm">Loading venue specifications...</p>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-background min-h-[400px] border border-dashed border-border rounded-2xl">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <Info className="h-6 w-6" />
        </div>
        <h4 className="font-extrabold text-lg text-foreground">Failed to Load Venue</h4>
        <p className="text-muted-foreground text-sm max-w-sm mt-1">{error || "The venue does not exist."}</p>
      </div>
    );
  }

  // Calculate booking metrics
  const startIdx = HOURS.indexOf(startTime);
  const endIdx = HOURS.indexOf(endTime);
  const totalHours = Math.max(1, endIdx - startIdx);
  const isTimeValid = endIdx > startIdx;

  const basePrice = totalHours * venue.pricePerHour;
  const cleaningFee = Math.round(basePrice * 0.08); // 8% cleaning
  const platformFee = Math.round(basePrice * 0.05); // 5% platform
  const totalCost = basePrice + cleaningFee + platformFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (previewMode) {
      toast.info("This is a preview mode. Booking requests are disabled for owners.");
      setCheckoutStep("success");
      return;
    }

    if (checkoutStep === "details") {
      if (!guestName || !guestEmail) {
        toast.error("Please fill in contact details");
        return;
      }
      setCheckoutStep("payment");
    } else if (checkoutStep === "payment") {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        toast.error("Please complete payment details");
        return;
      }
      // Process mock reservation
      if (!selectedDate) return;
      
      addBooking({
        venueId: venue.id,
        venueName: venue.name,
        venueImage: venue.images?.[0] || "",
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime,
        endTime,
        totalHours,
        totalCost,
        guestName,
        guestEmail
      });

      toast.success("Reservation request sent successfully!");
      setCheckoutStep("success");
    }
  };

  const openCheckout = () => {
    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }
    if (!isTimeValid) {
      toast.error("Start time must be before end time");
      return;
    }
    setCheckoutStep("details");
    setCheckoutOpen(true);
  };

  return (
    <div className="w-full">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2.5 py-1 rounded-lg uppercase">
              {venue.type}
            </span>
            <span className="flex items-center text-sm font-bold text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
              {venue.rating.toFixed(2)}{" "}
              <span className="text-muted-foreground font-medium ml-1">
                ({venue.reviewsCount} reviews)
              </span>
            </span>
            {previewMode && (
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                PREVIEW AS USER
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {venue.name}
          </h1>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 text-primary mr-1.5 shrink-0" />
            <span>{venue.address} &bull; {venue.location}</span>
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <div className="text-sm text-muted-foreground">Starting at</div>
          <div className="flex items-baseline md:justify-end space-x-1 mt-0.5">
            <span className="text-3xl font-extrabold text-foreground">${venue.pricePerHour}</span>
            <span className="text-sm text-muted-foreground">/ hr</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">or ${venue.pricePerDay} per day</div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Main Large Image */}
        <div className="lg:col-span-2 aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted relative">
          <img
            src={activeImage}
            alt={venue.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Thumbnail list */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 h-full">
          {venue.images && venue.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-video lg:h-[110px] w-full rounded-xl overflow-hidden border-2 bg-muted transition-all cursor-pointer ${
                activeImage === img ? "border-primary shadow-sm" : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Details & Booking Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Main Details Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-foreground mb-4">About this space</h2>
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
              {venue.description}
            </p>

            {/* Quick specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-border mt-6 pt-6 text-sm">
              <div className="flex items-center space-x-2.5">
                <Users className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Capacity</div>
                  <div className="font-bold text-foreground">{venue.capacity} guests</div>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="font-bold text-foreground">{venue.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">Setup Type</div>
                  <div className="font-bold text-foreground">Customizable</div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-foreground mb-4">Included Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {venue.amenities && venue.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-muted-foreground font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Static Map Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-foreground mb-4">Location Map</h2>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-slate-100 dark:bg-slate-900/40 relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px] dark:opacity-10 dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px)]" />
              <div className="relative z-10 flex flex-col items-center p-6 bg-card rounded-2xl border border-border shadow max-w-sm text-center">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm text-foreground">{venue.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-normal">{venue.address}</p>
              </div>
            </div>
          </div>

          {/* Mock Reviews Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-foreground">Guest Reviews</h2>
            
            <div className="flex items-center space-x-6 pb-6 border-b border-border">
              <div className="text-center">
                <div className="text-4xl font-black text-foreground">{venue.rating.toFixed(2)}</div>
                <div className="flex justify-center text-amber-400 my-1">★★★★★</div>
                <div className="text-xs text-muted-foreground">Based on {venue.reviewsCount} reviews</div>
              </div>
              
              <div className="flex-1 space-y-1.5 hidden sm:block">
                <div className="flex items-center text-xs text-muted-foreground space-x-2">
                  <span className="w-12">5 stars</span>
                  <div className="flex-grow h-2 bg-secondary rounded overflow-hidden">
                    <div className="bg-amber-400 h-full w-[85%]" />
                  </div>
                  <span className="w-8 text-right">85%</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground space-x-2">
                  <span className="w-12">4 stars</span>
                  <div className="flex-grow h-2 bg-secondary rounded overflow-hidden">
                    <div className="bg-amber-400 h-full w-[12%]" />
                  </div>
                  <span className="w-8 text-right">12%</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground space-x-2">
                  <span className="w-12">3 stars</span>
                  <div className="flex-grow h-2 bg-secondary rounded overflow-hidden">
                    <div className="bg-amber-400 h-full w-[3%]" />
                  </div>
                  <span className="w-8 text-right">3%</span>
                </div>
              </div>
            </div>

            {/* Review List items */}
            <div className="space-y-6">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-foreground">Sarah Jenkins</span>
                  <span className="text-xs text-muted-foreground">June 10, 2026</span>
                </div>
                <div className="text-amber-400 text-xs">★★★★★</div>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  This space was absolutely perfect for our quarterly executive board meeting. The Wi-Fi was fast, the tech setup was seamless, and the host went out of their way to provide premium coffee. Highly recommended!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Widget */}
        <div className="sticky top-24 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-2xl font-extrabold text-foreground">${venue.pricePerHour}</span>
              <span className="text-sm text-muted-foreground font-medium"> / hour</span>
            </div>

            {/* Booking Options form */}
            <div className="space-y-4">
              {/* Date Picker Input */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                  1. Select Date
                </label>
                <div className="border border-border rounded-xl p-2 bg-background flex flex-col items-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                    className="rounded-md border-0"
                  />
                  {selectedDate && (
                    <div className="text-xs font-semibold text-primary mt-2">
                      Selected: {format(selectedDate, "PP")}
                    </div>
                  )}
                </div>
              </div>

              {/* Time selector grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                    Start Time
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    {HOURS.map((hr) => (
                      <option key={hr} value={hr}>
                        {hr}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                    End Time
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    {HOURS.map((hr) => (
                      <option key={hr} value={hr}>
                        {hr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown Calculations */}
            {selectedDate && (
              <div className="space-y-3 pt-4 border-t border-border text-sm">
                {isTimeValid ? (
                  <>
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        ${venue.pricePerHour} x {totalHours} hours
                      </span>
                      <span className="font-bold text-foreground">${basePrice}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Cleaning fee (8%)</span>
                      <span className="font-bold text-foreground">${cleaningFee}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform fee (5%)</span>
                      <span className="font-bold text-foreground">${platformFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-3 border-t border-border/80 text-foreground">
                      <span>Total Cost</span>
                      <span>${totalCost}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg flex items-center">
                    <Info className="h-4 w-4 mr-1.5 shrink-0" />
                    <span>End time must be later than start time.</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA Reservation button */}
            <Button
              onClick={openCheckout}
              disabled={!selectedDate || !isTimeValid}
              className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-6 shadow-md transition-all cursor-pointer"
            >
              {previewMode ? "Test Booking Flow" : "Reserve Space"}
            </Button>

            <div className="text-xxs text-center text-muted-foreground leading-normal px-2">
              {previewMode ? "You are viewing this as an owner. Payment details are fully mocked." : "You won't be charged yet. The host will review and confirm this request first."}
            </div>
          </div>

          {/* Guarantee safety */}
          <div className="border border-border bg-card rounded-2xl p-4 shadow-sm flex items-center space-x-3 text-xs">
            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h5 className="font-bold text-foreground">BookMyVenue Guarantee</h5>
              <p className="text-muted-foreground mt-0.5">Secure payment & verified space layout assured.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Checkout Modal Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-foreground flex items-center">
              <CreditCard className="h-5.5 w-5.5 text-primary mr-2" />
              Complete Reservation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Confirm details to finalize the mock booking request.
            </DialogDescription>
          </DialogHeader>

          {/* Checkout Steps */}
          {checkoutStep !== "success" && (
            <div className="flex items-center justify-center space-x-2 text-xxs font-bold uppercase tracking-wider text-muted-foreground my-2 pb-2 border-b border-border/60">
              <span className={checkoutStep === "details" ? "text-primary" : ""}>1. Guest Info</span>
              <ChevronRight className="h-3 w-3" />
              <span className={checkoutStep === "payment" ? "text-primary" : ""}>2. Payment</span>
            </div>
          )}

          <form onSubmit={handleCheckoutSubmit} className="space-y-4 mt-2">
            {checkoutStep === "details" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="guestName" className="text-xs font-bold text-foreground">Full Name</Label>
                  <Input
                    id="guestName"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="rounded-xl border-border bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guestEmail" className="text-xs font-bold text-foreground">Email Address</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="rounded-xl border-border bg-background"
                  />
                </div>

                <div className="bg-secondary p-4 rounded-xl space-y-2 text-xs">
                  <h5 className="font-bold text-foreground">Booking Recap</h5>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Date:</span>
                    <span className="font-semibold text-foreground">
                      {selectedDate ? format(selectedDate, "PP") : ""}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground border-t border-border/80 pt-2 mt-2 font-bold text-sm text-foreground">
                    <span>Amount Due:</span>
                    <span>${totalCost}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground font-semibold mt-4">
                  Proceed to Payment
                </Button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-xs font-bold text-foreground">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    required
                    maxLength={16}
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                    className="rounded-xl border-border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardExpiry" className="text-xs font-bold text-foreground">Expiry</Label>
                    <Input
                      id="cardExpiry"
                      type="text"
                      required
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="rounded-xl border-border bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardCvc" className="text-xs font-bold text-foreground">CVC</Label>
                    <Input
                      id="cardCvc"
                      type="password"
                      required
                      maxLength={3}
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                      className="rounded-xl border-border bg-background"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground font-semibold mt-4">
                  Submit Reservation Request (${totalCost})
                </Button>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                <div className="h-14 w-14 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="font-extrabold text-lg text-foreground">
                  {previewMode ? "Preview Verification Successful!" : "Booking Request Received!"}
                </h4>
                <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                  {previewMode
                    ? "The booking calculator and checkout rules have been verified successfully. Users will see this checkout flow."
                    : "Your reservation request has been submitted successfully."}
                </p>
                <Button
                  onClick={() => setCheckoutOpen(false)}
                  className="w-full rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Close Preview
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
