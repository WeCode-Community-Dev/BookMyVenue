"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, ShieldCheck, DollarSign, CalendarRange, ArrowRight, ArrowLeft, UploadCloud } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["Wedding", "Conference", "Sports", "Cafe", "Resort", "Auditorium", "Birthday", "Party"];
const CITIES = ["Kochi", "Bangalore", "Mumbai", "Delhi"];
const AMENITIES_LIST = ["WiFi", "Air Conditioning", "Catering", "Parking", "Sound System", "Projector", "Stage", "Restrooms"];

const COVER_PRESETS = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
];

interface BecomeOwnerTabProps {
  onSuccessRedirect: (tabName: string) => void;
}

export default function BecomeOwnerTab({ onSuccessRedirect }: BecomeOwnerTabProps) {
  const { updateUser, addVenue } = useAuth();
  const [step, setStep] = useState(1);

  // Business profile states
  const [businessName, setBusinessName] = useState("");
  const [businessBio, setBusinessBio] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessCity, setBusinessCity] = useState("Kochi");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState<Record<string, boolean>>({});

  // Venue states
  const [venueName, setVenueName] = useState("");
  const [venueCategory, setVenueCategory] = useState("Wedding");
  const [venueCity, setVenueCity] = useState("Kochi");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueCapacity, setVenueCapacity] = useState("");
  const [venuePrice, setVenuePrice] = useState("");
  const [venueDescription, setVenueDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [venueCoverUrl, setVenueCoverUrl] = useState(COVER_PRESETS[0]);
  const [venueCustomCover, setVenueCustomCover] = useState("");

  const handleFileUpload = (docType: string) => {
    setFilesUploaded((prev) => ({ ...prev, [docType]: true }));
  };

  const handleNextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSelectPreset = (url: string) => {
    setVenueCoverUrl(url);
    setVenueCustomCover("");
  };

  const handleSubmitApplication = () => {
    if (agreedToTerms) {
      // 1. Upgrade user role
      updateUser({
        role: "Venue Owner",
        phone: businessPhone || undefined,
        city: businessCity || undefined,
      });

      // 2. Add the first venue
      const finalCover = venueCustomCover.trim() || venueCoverUrl;
      addVenue({
        name: venueName.trim(),
        category: venueCategory,
        city: venueCity,
        address: venueAddress.trim(),
        capacity: parseInt(venueCapacity),
        startingPrice: parseInt(venuePrice),
        description: venueDescription.trim(),
        amenities: selectedAmenities,
        thumbnail: finalCover,
        images: [
          finalCover,
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
        ],
      });

      // 3. Alert success
      alert("Congratulations! Your application has been approved. You are now a registered Venue Owner.");

      // 4. Switch tab back to my-venues
      onSuccessRedirect("my-venues");
    }
  };

  const isStep2Valid = businessName.trim() && businessPhone.trim() && businessBio.trim();
  const isStep3Valid = !!(filesUploaded["id"] && filesUploaded["property"]);
  const isStep4Valid = venueName.trim() && venueAddress.trim() && venueCapacity.trim() && venuePrice.trim() && venueDescription.trim();

  return (
    <div className="bg-white border border-slate-200/60 shadow-xs rounded-3xl p-6 sm:p-8 space-y-8 select-none text-left">
      
      {/* Wizard Header Progress */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-905 tracking-tight">
            Register as a Venue Owner
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-450 mt-1">
            Host your spaces on BookMyVenue and start receiving premium bookings.
          </p>
        </div>

        {/* Node Indicators */}
        <div className="flex items-center justify-between max-w-md mx-auto pt-2 pb-4">
          {[1, 2, 3, 4, 5].map((nodeNum) => {
            const isCompleted = step > nodeNum;
            const isActive = step === nodeNum;
            return (
              <React.Fragment key={nodeNum}>
                <div
                  className={`size-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all border ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : isActive
                      ? "bg-rose-50 border-rose-600 text-rose-700 ring-4 ring-rose-500/10"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="size-4 stroke-[3]" /> : nodeNum}
                </div>
                {nodeNum < 5 && (
                  <div
                    className={`flex-grow h-0.5 mx-2 transition-all ${
                      step > nodeNum ? "bg-emerald-500" : "bg-slate-100"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100/80 pt-6">
        {/* Step 1: Benefits Overview */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-slate-905">Step 1: Why host on BookMyVenue?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="border border-slate-200/50 rounded-2xl p-5 space-y-3 bg-slate-50/20">
                <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/50">
                  <DollarSign className="size-5" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800">Earn Extra Income</h4>
                <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
                  Set your own prices and make money renting out banquet halls, cafes, villas, or turfs.
                </p>
              </div>

              <div className="border border-slate-200/50 rounded-2xl p-5 space-y-3 bg-slate-50/20">
                <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/50">
                  <CalendarRange className="size-5" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800">Complete Control</h4>
                <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
                  Accept/decline requests, set reservation dates, timeslots, and venue policies easily.
                </p>
              </div>

              <div className="border border-slate-200/50 rounded-2xl p-5 space-y-3 bg-slate-50/20">
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                  <ShieldCheck className="size-5" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800">Verified Bookings</h4>
                <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
                  All guests undergo identity checks. We offer secure online payouts and support.
                </p>
              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleNextStep}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:translate-y-px border-none"
              >
                <span>Get Started</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Business Info */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-slate-905">Step 2: Tell us about your hosting business</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="businessName" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Business / Host Name
                </label>
                <Input
                  id="businessName"
                  placeholder="e.g. Grand Palace Hospitality"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="businessPhone" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Primary Contact Phone
                </label>
                <Input
                  id="businessPhone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="businessCity" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Operating City
                </label>
                <select
                  id="businessCity"
                  value={businessCity}
                  onChange={(e) => setBusinessCity(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 cursor-pointer"
                >
                  <option value="Kochi">Kochi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="businessBio" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Short Business Description
                </label>
                <textarea
                  id="businessBio"
                  rows={3}
                  placeholder="Write a brief overview of your venues and hospitality guidelines..."
                  value={businessBio}
                  onChange={(e) => setBusinessBio(e.target.value)}
                  className="flex w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 min-h-[80px]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-slate-200 hover:bg-slate-100 text-slate-500 font-bold h-11 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!isStep2Valid}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:translate-y-px border-none"
              >
                <span>Continue</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Property Documents Verification */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-slate-905">Step 3: Document Verification</h3>
            <p className="text-xs text-slate-450 font-semibold leading-relaxed">
              Upload mock files to pass identity verification. Clicking the boxes will immediately simulate a successful document upload.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1 */}
              <button
                type="button"
                onClick={() => handleFileUpload("id")}
                className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition active:scale-99 w-full bg-transparent flex flex-col items-center ${
                  filesUploaded["id"]
                    ? "border-emerald-500 bg-emerald-50/10"
                    : "border-slate-200 hover:border-slate-350"
                }`}
              >
                <UploadCloud className={`size-8 ${filesUploaded["id"] ? "text-emerald-600" : "text-slate-400"}`} />
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider block">1. Government Photo ID</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Aadhar Card, Passport, or License</p>
                </div>
                {filesUploaded["id"] ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-full select-none">
                    <Check className="size-3 stroke-[3]" />
                    <span>Identity Document Uploaded</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-600 hover:text-rose-700">Click to Upload mock file</span>
                )}
              </button>

              {/* Box 2 */}
              <button
                type="button"
                onClick={() => handleFileUpload("property")}
                className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition active:scale-99 w-full bg-transparent flex flex-col items-center ${
                  filesUploaded["property"]
                    ? "border-emerald-500 bg-emerald-50/10"
                    : "border-slate-200 hover:border-slate-350"
                }`}
              >
                <UploadCloud className={`size-8 ${filesUploaded["property"] ? "text-emerald-600" : "text-slate-400"}`} />
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider block">2. Property Title/Reg Doc</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Utility bill, license, or deed registration</p>
                </div>
                {filesUploaded["property"] ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-full select-none">
                    <Check className="size-3 stroke-[3]" />
                    <span>Property Document Uploaded</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-600 hover:text-rose-700">Click to Upload mock file</span>
                )}
              </button>
            </div>

            <div className="pt-4 flex justify-between">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-slate-200 hover:bg-slate-100 text-slate-500 font-bold h-11 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!isStep3Valid}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:translate-y-px border-none"
              >
                <span>Continue</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Add First Venue details */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-black text-slate-905">Step 4: Add your first venue</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Provide details to publish your first venue listing immediately.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="venueName" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Venue Name
                </label>
                <Input
                  id="venueName"
                  placeholder="e.g. Grand Ballroom at Palace"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="venueCategory" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Category
                </label>
                <select
                  id="venueCategory"
                  value={venueCategory}
                  onChange={(e) => setVenueCategory(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="venueCity" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  City Location
                </label>
                <select
                  id="venueCity"
                  value={venueCity}
                  onChange={(e) => setVenueCity(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 cursor-pointer"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="venueAddress" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Full Physical Address
                </label>
                <Input
                  id="venueAddress"
                  placeholder="e.g. 12/2 Riverside Lane, MG Road"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="venueCapacity" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Maximum Guests Capacity
                </label>
                <Input
                  id="venueCapacity"
                  type="number"
                  placeholder="e.g. 350"
                  value={venueCapacity}
                  onChange={(e) => setVenueCapacity(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="venuePrice" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Starting Price (₹ / event)
                </label>
                <Input
                  id="venuePrice"
                  type="number"
                  placeholder="e.g. 25000"
                  value={venuePrice}
                  onChange={(e) => setVenuePrice(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="venueDescription" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Venue Description
                </label>
                <textarea
                  id="venueDescription"
                  rows={3}
                  placeholder="Describe layout configs, access rules, event suitability, etc..."
                  value={venueDescription}
                  onChange={(e) => setVenueDescription(e.target.value)}
                  className="flex w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 min-h-[80px]"
                />
              </div>

              {/* Amenities Checklist */}
              <div className="space-y-2 md:col-span-2 select-none border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Amenities Offered</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AMENITIES_LIST.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer text-xs font-extrabold transition text-left bg-white ${
                          isChecked
                            ? "bg-rose-50 border-rose-200 text-rose-700"
                            : "bg-white border-slate-200 text-slate-650 hover:border-slate-350"
                        }`}
                      >
                        <div className={`size-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? "bg-rose-600 border-rose-600 text-white" : "border-slate-300"
                        }`}>
                          {isChecked && <Check className="size-2.5 stroke-[3.5]" />}
                        </div>
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cover photo presets */}
              <div className="space-y-3.5 md:col-span-2 select-none border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cover Photo</label>
                <div className="grid grid-cols-5 gap-3">
                  {COVER_PRESETS.map((url, idx) => {
                    const isSelected = venueCoverUrl === url && !venueCustomCover;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(url)}
                        className={`relative aspect-video w-full rounded-lg overflow-hidden cursor-pointer active:scale-95 transition border-2 ${
                          isSelected ? "border-rose-600 ring-2 ring-rose-500/10" : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        <Image src={url} alt={`Cover Preset ${idx + 1}`} fill className="object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-rose-600/20 flex items-center justify-center">
                            <Check className="size-4 text-white stroke-[3.5]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Or custom cover image url</span>
                  <Input
                    placeholder="https://example.com/custom-photo.jpg"
                    value={venueCustomCover}
                    onChange={(e) => setVenueCustomCover(e.target.value)}
                    className="text-xs h-10"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-slate-200 hover:bg-slate-100 text-slate-500 font-bold h-11 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!isStep4Valid}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:translate-y-px border-none"
              >
                <span>Continue</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Agreements and Submit */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-slate-905">Step 5: Authorizations & Agreements</h3>
            
            <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-5 space-y-4 text-xs font-medium text-slate-650 leading-relaxed max-h-[220px] overflow-y-auto">
              <p className="font-extrabold text-slate-800">By submitting this onboarding request, you verify that:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>You are the legitimate owner, lessee, or manager of the properties you list on this service.</li>
                <li>All details, capacities, starting prices, and photographs provided during venue listings are accurate and true.</li>
                <li>You will adhere to local safety, zone registration, taxation, and business codes for hosting events.</li>
                <li>You authorize BookMyVenue to collect deposits and online booking payments on your behalf.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 select-none">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="size-4 border border-slate-300 rounded text-rose-600 focus:ring-rose-500/20 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs font-extrabold text-slate-700 cursor-pointer">
                I agree to the BookMyVenue Host Guidelines and Hosting Agreement.
              </label>
            </div>

            <div className="pt-4 flex justify-between">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="border-slate-200 hover:bg-slate-100 text-slate-500 font-bold h-11 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={!agreedToTerms}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold h-11 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:translate-y-px border-none"
              >
                <span>Complete Registration</span>
                <Check className="size-4 stroke-[3]" />
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

