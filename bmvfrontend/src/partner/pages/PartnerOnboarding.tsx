"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/src/customer/components/Header";
import Footer from "@/src/customer/components/Footer";
import { apiFetch } from "@/src/lib/api";
import { getSession, UserSession } from "@/src/lib/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  MapPin,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Users,
  Maximize,
  Coins,
  Trash2
} from "lucide-react";
import { MyVenue } from "../route";
import { Status } from "../route";

export default function PartnerOnboarding() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [venue, setVenue] = useState<any>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Step state: 1 (Info), 2 (Photos), 3 (Docs), 4 (Submit)
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState("");

  // Step 1: Basic Info Form State
  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [hasParking, setHasParking] = useState(false);
  const [parkingCapacity, setParkingCapacity] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [bookingType, setBookingType] = useState("");

  // Step 2: Photo Upload State
  const [selectedPhotoType, setSelectedPhotoType] = useState("COVER");
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Step 3: Document Upload State
  const [selectedDocType, setSelectedDocType] = useState("AADHAAR");
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [docFile, setDocFile] = useState<File | null>(null);

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession || activeSession.role !== "venue_owner") {
      router.push("/partner/login");
      return;
    }
    setSession(activeSession);
    checkOnboardingProgress();
  }, [router]);

  const checkOnboardingProgress = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch current user's venue
      const myVenue = await MyVenue();
      setVenue(myVenue);

      // Auto fill Step 1 Form if venue exists
      setVenueName(myVenue.venueName || "");
      setVenueType(myVenue.venueType || "");
      setDescription(myVenue.description || "");
      setAddress(myVenue.address || "");
      setCity(myVenue.city || "");
      setDistrict(myVenue.district || "");
      setState(myVenue.state || "");
      setPincode(myVenue.pincode || "");
      setMaxCapacity(myVenue.maxCapacity ? String(myVenue.maxCapacity) : "");
      setSquareFeet(myVenue.squareFeet ? String(myVenue.squareFeet) : "");
      setHasParking(myVenue.hasParking || false);
      setParkingCapacity(myVenue.parkingCapacity ? String(myVenue.parkingCapacity) : "");
      setStartingPrice(myVenue.startingPrice ? String(Math.round(Number(myVenue.startingPrice))) : "");
      setBookingType(myVenue.bookingType || "");

      // Guard: redirect based on current venue status
      if (myVenue.status === "APPROVED") {
        router.push("/partner/dashboard");
        return;
      }
      if (myVenue.status === "PENDING_REVIEW" || myVenue.status === "RESUBMITTED" || myVenue.status === "REJECTED") {
        router.push("/partner/status");
        return;
      }
      // DRAFT and CHANGES_REQUESTED: allow into the wizard

      // 2. Fetch step progress & status from status endpoint
      const status = await Status(myVenue.id)
      setOnboardingStatus(status);

      // 3. Load photos and documents lists
      await loadPhotosAndDocs(myVenue.id);

      // Determine step

      if (!myVenue.stepVenueInfoDone || myVenue.status === "CHANGES_REQUESTED") {
        setStep(1);
      } else if (!myVenue.stepPhotosDone || myVenue.status === "CHANGES_REQUESTED") {
        setStep(2);
      } else if (!myVenue.stepDocumentsDone || myVenue.status === "CHANGES_REQUESTED") {
        setStep(3);
      } else {
        setStep(4);
      }
    } catch (err: any) {
      if (err.message.includes("404") || err.message.includes("not found") || err.message.includes("No venue found")) {
        // Venue does not exist, start at Step 1
        setStep(1);
      } else {
        setError(err.message || "Failed to load onboarding status.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPhotosAndDocs = async (venueId: string) => {
    try {
      const photos = await apiFetch<any[]>(`/venues/${venueId}/images`);
      setUploadedPhotos(photos);
      const docs = await apiFetch<any[]>(`/venues/${venueId}/documents`);
      setUploadedDocs(docs);
    } catch (err) {
      console.error("Failed to load attachments:", err);
    }
  };

  // ─── Step 1: Submit Basic Info ──────────────────────────────────────────────
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError("");
    setIsSubmitting(true);

    const payload = {
      venueName,
      venueType,
      description,
      address,
      city,
      district,
      state,
      pincode,
      maxCapacity: parseInt(maxCapacity, 10),
      squareFeet: parseInt(squareFeet, 10),
      hasParking,
      parkingCapacity: hasParking && parkingCapacity ? parseInt(parkingCapacity, 10) : undefined,
      startingPrice: parseFloat(startingPrice),
      bookingType,
    };

    try {
      let savedVenue: any;
      if (venue) {
        // Update
        savedVenue = await apiFetch(`/venues/${venue.id}/info`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        // Create
        savedVenue = await apiFetch("/venues", {
          method: "POST",
          body: payload,
        });
      }
      setVenue(savedVenue);

      // Sync onboarding status from backend
      const status = await apiFetch<any>(`/venues/${savedVenue.id}/onboarding-status`);
      setOnboardingStatus(status);
      await loadPhotosAndDocs(savedVenue.id);

      setStep(2);
    } catch (err: any) {
      setStepError(err.message || "Failed to save venue details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Step 2: Upload Photo ──────────────────────────────────────────────────
  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile || !venue) return;
    setStepError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", photoFile);
    formData.append("imageType", selectedPhotoType);
    formData.append("displayOrder", String(uploadedPhotos.length + 1));

    try {
      await apiFetch(`/venues/${venue.id}/images`, {
        method: "POST",
        body: formData,
      });

      // Clear input and reload files/onboarding status
      setPhotoFile(null);
      const fileInput = document.getElementById("photo-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      const status = await apiFetch<any>(`/venues/${venue.id}/onboarding-status`);
      setOnboardingStatus(status);
      await loadPhotosAndDocs(venue.id);
    } catch (err: any) {
      setStepError(err.message || "Failed to upload image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextFromPhotos = () => {
    if (!onboardingStatus?.steps?.photos?.done) {
      setStepError("Please upload all required photos before proceeding.");
      return;
    }
    setStepError("");
    setStep(3);
  };

  // ─── Step 3: Upload Document ───────────────────────────────────────────────
  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !venue) return;
    setStepError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", docFile);
    formData.append("documentType", selectedDocType);

    try {
      await apiFetch(`/venues/${venue.id}/documents`, {
        method: "POST",
        body: formData,
      });

      // Clear input and reload files/onboarding status
      setDocFile(null);
      const fileInput = document.getElementById("doc-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      const status = await apiFetch<any>(`/venues/${venue.id}/onboarding-status`);
      setOnboardingStatus(status);
      await loadPhotosAndDocs(venue.id);
    } catch (err: any) {
      setStepError(err.message || "Failed to upload document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextFromDocs = () => {
    if (!onboardingStatus?.steps?.documents?.done) {
      setStepError("Please upload at least one verification document before proceeding.");
      return;
    }
    setStepError("");
    setStep(4);
  };

  // ─── Step 4: Submit Verification ───────────────────────────────────────────
  const handleSubmitVerification = async () => {
    if (!venue) return;
    setStepError("");
    setIsSubmitting(true);

    try {
      await apiFetch(`/venues/${venue.id}/submit`, {
        method: "POST",
      });
      // Redirect to dashboard now that review status is active
      router.push("/partner/dashboard");
    } catch (err: any) {
      setStepError(err.message || "Failed to submit for verification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!venue) return;
    setStepError("");
    setIsSubmitting(true);
    try {
      await apiFetch(`/venues/${venue.id}/images/${photoId}`, {
        method: "DELETE",
      });
      // Refresh status and list
      const status = await apiFetch<any>(`/venues/${venue.id}/onboarding-status`);
      setOnboardingStatus(status);
      await loadPhotosAndDocs(venue.id);
    } catch (err: any) {
      setStepError(err.message || "Failed to delete image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!venue) return;
    setStepError("");
    setIsSubmitting(true);
    try {
      await apiFetch(`/venues/${venue.id}/documents/${docId}`, {
        method: "DELETE",
      });
      // Refresh status and list
      const status = await apiFetch<any>(`/venues/${venue.id}/onboarding-status`);
      setOnboardingStatus(status);
      await loadPhotosAndDocs(venue.id);
    } catch (err: any) {
      setStepError(err.message || "Failed to delete document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20 font-sans text-sm text-neutral-muted">
          <Loader2 className="h-6 w-6 animate-spin text-teal-primary mr-2" />
          Loading onboarding state...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] font-sans">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Onboarding Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase font-bold tracking-wider bg-neutral-dark text-white px-2 py-0.5 rounded-md align-middle">
            Partner Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-neutral-dark mt-3">Onboard Your Venue</h1>
          <p className="text-xs text-neutral-muted mt-1">
            Complete the 4-step setup to list your space on BookMyVenue.
          </p>
        </div>

        {/* Admin Feedback Notes */}
        {venue?.status === "CHANGES_REQUESTED" && venue?.reviewNotes && (
          <div className="max-w-2xl mx-auto mb-6 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed shadow-sm">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold block text-orange-950 mb-0.5">Admin Revision Request</span>
              <p className="text-orange-900">{venue.reviewNotes}</p>
            </div>
          </div>
        )}

        {/* Wizard Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto px-2">
          <div className="flex justify-between text-[10px] font-bold text-neutral-muted uppercase mb-2">
            <span>Step {step} of 4</span>
            <span className="text-teal-primary font-bold">
              {step === 1 ? "Venue Basic Details" : step === 2 ? "Upload Photos" : step === 3 ? "Legal Verification" : "Review & Submit"}
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5 bg-neutral-light" />
        </div>

        <div className="max-w-2xl mx-auto">
          {stepError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs flex gap-2 items-start mb-5 animate-fade-in shadow-xs">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{stepError}</span>
            </div>
          )}

          <Card className="border border-neutral-light shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">

              {/* ──────────────────────────────────────────────────────────────
                  STEP 1: VENUE BASIC INFO
              ────────────────────────────────────────────────────────────── */}
              {step === 1 && (
                <form onSubmit={handleInfoSubmit} className="space-y-5">
                  <div className="border-b border-neutral-light pb-2 mb-3">
                    <h3 className="text-lg font-serif font-bold text-neutral-dark flex items-center gap-1.5">
                      <Building className="h-5 w-5 text-teal-primary" /> Venue Core Details
                    </h3>
                    <p className="text-[10px] text-neutral-muted mt-0.5">Please provide general information and booking rates.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Venue Name</label>
                      <Input
                        required
                        type="text"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        placeholder="Pearl Banquet Hall"
                        className="h-10 border-input rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Venue Type</label>
                      <select
                        required
                        value={venueType}
                        onChange={(e) => setVenueType(e.target.value)}
                        className="w-full h-10 border border-input rounded-xl bg-white text-xs px-3 outline-none font-semibold text-neutral-dark focus:ring-2 focus:ring-teal-primary/20"
                      >
                        <option value="">Select Category</option>
                        <option value="WEDDING_HALL">Wedding Hall</option>
                        <option value="AUDITORIUM">Auditorium</option>
                        <option value="RESORT">Resort</option>
                        <option value="CONVENTION_CENTER">Convention Center</option>
                        <option value="CAFE">Cafe / Restaurant</option>
                        <option value="PARTY_HALL">Party Banquet</option>
                        <option value="MEETUP_SPACE">Meetup / Coworking Space</option>
                        <option value="MALL">Mall Space</option>
                        <option value="HOTEL">Hotel Hall</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Introduce your venue. Describe unique facilities, location highlights, and perfect occasions."
                      className="w-full border border-input rounded-2xl bg-white p-3.5 text-xs outline-none focus:ring-2 focus:ring-teal-primary/20 transition-all resize-none placeholder:text-neutral-muted/70"
                    />
                  </div>

                  <div className="border-b border-neutral-light pb-2 pt-2">
                    <h3 className="text-sm font-bold text-neutral-dark flex items-center gap-1.5">
                      <MapPin className="h-4.5 w-4.5 text-teal-primary" /> Location Details
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Address Line</label>
                    <Input
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Door No., Street Name, Landmark"
                      className="h-10 border-input rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">City</label>
                      <Input
                        required
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Kochi"
                        className="h-10 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">District</label>
                      <Input
                        required
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Ernakulam"
                        className="h-10 border-input rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">State</label>
                      <Input
                        required
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Kerala"
                        className="h-10 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Pincode</label>
                      <Input
                        required
                        maxLength={10}
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="682025"
                        className="h-10 border-input rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="border-b border-neutral-light pb-2 pt-2">
                    <h3 className="text-sm font-bold text-neutral-dark flex items-center gap-1.5">
                      <Users className="h-4.5 w-4.5 text-teal-primary" /> Capacity & Parking
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Max Capacity (Guests)</label>
                      <Input
                        required
                        type="number"
                        min="1"
                        value={maxCapacity}
                        onChange={(e) => setMaxCapacity(e.target.value)}
                        placeholder="500"
                        className="h-10 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Total Area (Sq Ft)</label>
                      <Input
                        required
                        type="number"
                        min="1"
                        value={squareFeet}
                        onChange={(e) => setSquareFeet(e.target.value)}
                        placeholder="4500"
                        className="h-10 border-input rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-light/30 border border-neutral-light rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="hasParkingCheck"
                        checked={hasParking}
                        onChange={(e) => setHasParking(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-input text-teal-primary focus:ring-teal-primary"
                      />
                      <label htmlFor="hasParkingCheck" className="text-xs font-bold text-neutral-dark select-none cursor-pointer">
                        Venue Has Dedicated Parking
                      </label>
                    </div>

                    {hasParking && (
                      <div className="space-y-1.5 animate-fade-in pl-7">
                        <label className="text-xs font-bold text-neutral-muted uppercase">Parking Capacity (Vehicles)</label>
                        <Input
                          required={hasParking}
                          type="number"
                          min="1"
                          value={parkingCapacity}
                          onChange={(e) => setParkingCapacity(e.target.value)}
                          placeholder="e.g. 50"
                          className="h-10 border-input rounded-xl bg-white max-w-xs"
                        />
                      </div>
                    )}
                  </div>

                  <div className="border-b border-neutral-light pb-2 pt-2">
                    <h3 className="text-sm font-bold text-neutral-dark flex items-center gap-1.5">
                      <Coins className="h-4.5 w-4.5 text-teal-primary" /> Pricing & Booking Mode
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Starting Price (₹ / Day)</label>
                      <Input
                        required
                        type="number"
                        min="0"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        placeholder="75000"
                        className="h-10 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Booking Mode</label>
                      <select
                        required
                        value={bookingType}
                        onChange={(e) => setBookingType(e.target.value)}
                        className="w-full h-10 border border-input rounded-xl bg-white text-xs px-3 outline-none font-semibold text-neutral-dark focus:ring-2 focus:ring-teal-primary/20"
                      >
                        <option value="">Select Mode</option>
                        <option value="FULL_DAY">Full Day Unit</option>
                        <option value="TIME_SLOT">Hourly/Time Slots</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-light flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-teal-primary hover:bg-teal-hover text-white rounded-xl h-11 px-8 font-bold shadow-md shadow-teal-primary/20 flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving Details...
                        </>
                      ) : (
                        <>
                          Next Step: Photos <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* ──────────────────────────────────────────────────────────────
                  STEP 2: UPLOAD PHOTOS
              ────────────────────────────────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-light pb-2 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-neutral-dark flex items-center gap-1.5">
                        <Camera className="h-5 w-5 text-teal-primary" /> Venue Gallery Uploads
                      </h3>
                      <p className="text-[10px] text-neutral-muted mt-0.5">Provide high-resolution photos of your venue spaces.</p>
                    </div>
                  </div>

                  {/* Requirements card */}
                  <div className="bg-teal-light/25 border border-teal-primary/20 rounded-2xl p-4 space-y-2.5 text-xs text-[#0a5b5e]">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="h-4.5 w-4.5 text-teal-primary" /> Minimum Requirements:
                    </span>
                    <ul className="space-y-1.5 font-medium pl-6 list-disc">
                      <li className="flex items-center gap-1.5">
                        <span className={uploadedPhotos.some(p => p.imageType === "COVER") ? "text-emerald-600 font-bold" : "opacity-75"}>
                          At least 1 COVER photo {uploadedPhotos.some(p => p.imageType === "COVER") && "✓"}
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className={uploadedPhotos.some(p => p.imageType === "ENTRANCE") ? "text-emerald-600 font-bold" : "opacity-75"}>
                          At least 1 ENTRANCE photo {uploadedPhotos.some(p => p.imageType === "ENTRANCE") && "✓"}
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className={uploadedPhotos.some(p => p.imageType === "HALL") ? "text-emerald-600 font-bold" : "opacity-75"}>
                          At least 1 HALL photo {uploadedPhotos.some(p => p.imageType === "HALL") && "✓"}
                        </span>
                      </li>
                      {hasParking && (
                        <li className="flex items-center gap-1.5">
                          <span className={uploadedPhotos.some(p => p.imageType === "PARKING") ? "text-emerald-600 font-bold" : "opacity-75"}>
                            At least 1 PARKING photo {uploadedPhotos.some(p => p.imageType === "PARKING") && "✓"}
                          </span>
                        </li>
                      )}
                      <li className="flex items-center gap-1.5">
                        <span className={uploadedPhotos.length >= 5 ? "text-emerald-600 font-bold" : "opacity-75"}>
                          Total 5 or more photos (Currently: {uploadedPhotos.length}) {uploadedPhotos.length >= 5 && "✓"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Photo upload form */}
                  <form onSubmit={handlePhotoUpload} className="p-4 border border-neutral-light rounded-2xl bg-neutral-light/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-muted uppercase">Image Category</label>
                        <select
                          value={selectedPhotoType}
                          onChange={(e) => setSelectedPhotoType(e.target.value)}
                          className="w-full h-10 border border-input rounded-xl bg-white text-xs px-3 outline-none font-semibold text-neutral-dark focus:ring-2 focus:ring-teal-primary/20"
                        >
                          <option value="COVER">Main Cover Image</option>
                          <option value="ENTRANCE">Entrance View</option>
                          <option value="HALL">Hall Interior</option>
                          {hasParking && <option value="PARKING">Parking Space</option>}
                          <option value="OTHER">Other Details</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-muted uppercase">Choose Photo File</label>
                        <input
                          id="photo-file-input"
                          required
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs font-semibold text-neutral-dark border border-input bg-white h-10 rounded-xl px-3 py-1.5 outline-none file:mr-2 file:py-0.5 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-teal-light file:text-teal-primary cursor-pointer"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !photoFile}
                      className="bg-teal-primary hover:bg-teal-hover text-white rounded-xl h-10 w-full font-bold shadow-md shadow-teal-primary/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Uploading Image...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" /> Upload Image
                        </>
                      )}
                    </Button>
                  </form>

                  {/* List of uploaded photos - No delete/patch buttons as requested for onboarding */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-neutral-muted uppercase">Uploaded Photos ({uploadedPhotos.length})</h4>

                    {uploadedPhotos.length === 0 ? (
                      <p className="text-xs text-neutral-muted italic py-2">No photos uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {uploadedPhotos.map((photo) => (
                          <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-video border border-neutral-light bg-neutral-light shadow-xs">
                            <Image
                              src={photo.imageUrl}
                              alt={photo.imageType}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black/60 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs uppercase border border-white/10">
                              {photo.imageType}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-md"
                              title="Delete Photo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-light flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-input hover:bg-neutral-light font-bold rounded-xl h-11 px-6 text-sm"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNextFromPhotos}
                      className="bg-teal-primary hover:bg-teal-hover text-white rounded-xl h-11 px-8 font-bold shadow-md shadow-teal-primary/20 flex items-center gap-1.5"
                    >
                      Next Step: Legal Verification <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────────────
                  STEP 3: UPLOAD DOCUMENTS
              ────────────────────────────────────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-light pb-2">
                    <h3 className="text-lg font-serif font-bold text-neutral-dark flex items-center gap-1.5">
                      <FileText className="h-5 w-5 text-teal-primary" /> Legal Verification Proofs
                    </h3>
                    <p className="text-[10px] text-neutral-muted mt-0.5">Provide official business licensing or property deeds.</p>
                  </div>

                  <div className="bg-teal-light/25 border border-teal-primary/20 rounded-2xl p-4 text-xs text-[#0a5b5e] leading-relaxed">
                    <span className="font-bold block mb-1">Why do we need this?</span>
                    We physically audit and cross-verify business registration papers to protect customers from booking scams. Please upload at least one valid legal ID or document proof.
                  </div>

                  {/* Document upload form */}
                  <form onSubmit={handleDocUpload} className="p-4 border border-neutral-light rounded-2xl bg-neutral-light/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-muted uppercase">Document Category</label>
                        <select
                          value={selectedDocType}
                          onChange={(e) => setSelectedDocType(e.target.value)}
                          className="w-full h-10 border border-input rounded-xl bg-white text-xs px-3 outline-none font-semibold text-neutral-dark focus:ring-2 focus:ring-teal-primary/20"
                        >
                          <option value="BUSINESS_LICENSE">Business License (GST/Trade Certificate)</option>
                          <option value="PROPERTY_PROOF">Land Ownership Proof (Tax receipt/Deed)</option>
                          <option value="RENTAL_AGREEMENT">Rental/Lease Agreement</option>
                          <option value="AADHAAR">Owner's Aadhaar Card</option>
                          <option value="PAN">Owner's PAN Card</option>
                          <option value="OTHER">Other Proofs</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-muted uppercase">Choose Document File (PDF/Image)</label>
                        <input
                          id="doc-file-input"
                          required
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs font-semibold text-neutral-dark border border-input bg-white h-10 rounded-xl px-3 py-1.5 outline-none file:mr-2 file:py-0.5 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-teal-light file:text-teal-primary cursor-pointer"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !docFile}
                      className="bg-teal-primary hover:bg-teal-hover text-white rounded-xl h-10 w-full font-bold shadow-md shadow-teal-primary/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Uploading Document...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" /> Upload Document
                        </>
                      )}
                    </Button>
                  </form>

                  {/* List of uploaded documents - No delete/patch buttons as requested for onboarding */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-neutral-muted uppercase">Uploaded Proofs ({uploadedDocs.length})</h4>

                    {uploadedDocs.length === 0 ? (
                      <p className="text-xs text-neutral-muted italic py-2">No verification documents uploaded yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {uploadedDocs.map((doc) => (
                          <div key={doc.id} className="flex justify-between items-center p-3 border border-neutral-light rounded-xl hover:border-teal-primary/10 transition-all">
                            <div className="flex items-center gap-2 text-xs">
                              <FileText className="h-4.5 w-4.5 text-teal-primary" />
                              <div>
                                <span className="font-bold text-neutral-dark block capitalize">{doc.documentType.replace(/_/g, " ")}</span>
                                <span className="text-[10px] text-neutral-muted">Proof Ref: {doc.id.substring(0, 8)}...</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-md">
                                Successfully Uploaded
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-light flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="border-input hover:bg-neutral-light font-bold rounded-xl h-11 px-6 text-sm"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNextFromDocs}
                      className="bg-teal-primary hover:bg-teal-hover text-white rounded-xl h-11 px-8 font-bold shadow-md shadow-teal-primary/20 flex items-center gap-1.5"
                    >
                      Next Step: Review & Submit <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────────────
                  STEP 4: REVIEW & SUBMIT
              ────────────────────────────────────────────────────────────── */}
              {step === 4 && onboardingStatus && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-light pb-2 text-center">
                    <h3 className="text-lg font-serif font-bold text-neutral-dark">Final Profile Verification Review</h3>
                    <p className="text-[10px] text-neutral-muted mt-0.5">Please review your setup status checklist before submitting for audit.</p>
                  </div>

                  {/* Setup Checklist Summary */}
                  <div className="bg-white border border-neutral-light rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-neutral-muted uppercase">Setup Checklist</h4>

                    <div className="space-y-3">
                      {/* Step 1 basic info */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-dark font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Step 1: Core details configuration
                        </span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-md text-[10px]">
                          Complete
                        </span>
                      </div>

                      {/* Step 2 photos */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-dark font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Step 2: Media uploads ({onboardingStatus.steps.photos.uploaded} photos)
                        </span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-md text-[10px]">
                          Complete
                        </span>
                      </div>

                      {/* Step 3 documents */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-dark font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Step 3: Verification documents ({onboardingStatus.steps.documents.count} docs)
                        </span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-md text-[10px]">
                          Complete
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submission prompt */}
                  <div className="bg-teal-light/20 border border-teal-primary/30 p-5 rounded-2xl flex gap-3 text-xs text-[#0a5b5e] leading-relaxed">
                    <ShieldCheck className="h-6 w-6 text-teal-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Verification Timeline</span>
                      Once submitted, our administrators will verify the property details and legal uploads.
                      Verification review typically takes <strong>24 to 48 hours</strong>.
                      You will not be able to edit venue basic details or pricing while it is in the <code>PENDING_REVIEW</code> state.
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-light flex justify-between gap-3">
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => setStep(3)}
                      className="border-input hover:bg-neutral-light font-bold rounded-xl h-11 px-6 text-sm"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitVerification}
                      disabled={isSubmitting || !onboardingStatus.canSubmit}
                      className="bg-amber-cta text-white hover:bg-amber-hover rounded-xl h-11 px-8 font-bold shadow-md shadow-amber-cta/20 flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Submitting Venue...
                        </>
                      ) : (
                        "Submit Venue for Verification"
                      )}
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
