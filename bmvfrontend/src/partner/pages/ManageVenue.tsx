"use client";

import React, { useState, useEffect } from "react";
import { 
  Building, 
  Image as ImageIcon, 
  FileText, 
  Save, 
  Plus, 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  CheckCircle2,
  Upload
} from "lucide-react";
import { apiFetch } from "@/src/lib/api";
import { MyVenue } from "../route";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface VenueData {
  id: string;
  venueName: string;
  capacity: number;
  startingPrice: string;
  description: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  images: Array<{ id: string; imageUrl: string; imageType: string }>;
  documents: Array<{ id: string; documentUrl: string; documentType: string }>;
}

export default function ManageVenue() {
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "gallery" | "docs">("info");

  // Info Form State
  const [capacity, setCapacity] = useState<number>(0);
  const [startingPrice, setStartingPrice] = useState("");
  const [description, setDescription] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Gallery Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [imageType, setImageType] = useState<string>("GALLERY");
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    loadVenueDetails();
  }, []);

  const loadVenueDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await MyVenue();
      setVenue(data);
      if (data) {
        setCapacity(data.capacity);
        setStartingPrice(data.startingPrice);
        setDescription(data.description);
        setAddressLine1(data.addressLine1);
        setAddressLine2(data.addressLine2 || "");
        setCity(data.city);
        setState(data.state);
        setPincode(data.pincode);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load venue details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue) return;

    setSaveLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/venues/${venue.id}/info`, {
        method: "PATCH",
        body: {
          capacity: Number(capacity),
          startingPrice: Number(startingPrice),
          description: description.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        }
      });

      setSuccess("Venue details updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      loadVenueDetails();
    } catch (err: any) {
      setError(err.message || "Failed to save venue details.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue || !uploadFile) return;

    setUploadLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("imageType", imageType);

    try {
      // Direct raw fetch because multipart upload has custom boundaries
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:5000/api/venues/${venue.id}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      setSuccess("Image uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setUploadFile(null);
      loadVenueDetails();
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!venue) return;
    if (!confirm("Are you sure you want to delete this image?")) return;

    setError("");
    setSuccess("");

    try {
      await apiFetch(`/venues/${venue.id}/images/${imageId}`, {
        method: "DELETE"
      });
      setSuccess("Image deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      loadVenueDetails();
    } catch (err: any) {
      setError(err.message || "Failed to delete image.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-dark">Manage Venue</h1>
        <p className="text-xs text-neutral-muted mt-1">Update venue specs, edit description, upload gallery photos, and view document details.</p>
      </div>

      {success && (
        <div className="bg-[#E6F1F1] border border-teal-primary/20 text-[#0D7377] rounded-xl p-4 text-xs flex gap-2 items-center animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-bold">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-xs flex gap-2 items-center">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0D7377]" />
        </div>
      ) : !venue ? (
        <div className="text-center py-20 bg-white border border-[#E2E2DE] rounded-2xl">
          <Building className="h-10 w-10 text-neutral-muted mx-auto" />
          <p className="text-sm text-neutral-dark font-semibold mt-2">Venue details could not be loaded.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs switch */}
          <div className="flex border-b border-[#E2E2DE]">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 -mb-px transition-all ${
                activeTab === "info"
                  ? "border-[#0D7377] text-[#0D7377] font-bold"
                  : "border-transparent text-neutral-muted hover:text-neutral-dark"
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Venue Info</span>
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 -mb-px transition-all ${
                activeTab === "gallery"
                  ? "border-[#0D7377] text-[#0D7377] font-bold"
                  : "border-transparent text-neutral-muted hover:text-neutral-dark"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Photo Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 -mb-px transition-all ${
                activeTab === "docs"
                  ? "border-[#0D7377] text-[#0D7377] font-bold"
                  : "border-transparent text-neutral-muted hover:text-neutral-dark"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Verification Documents</span>
            </button>
          </div>

          {/* TAB 1: BASIC INFO */}
          {activeTab === "info" && (
            <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl p-6">
              <form onSubmit={handleInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name (Read-Only) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Venue Name (Verified)</label>
                    <Input
                      type="text"
                      disabled
                      value={venue.venueName}
                      className="border-input h-11 rounded-xl bg-neutral-light/30 cursor-not-allowed font-semibold text-neutral-dark"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Verification Status</label>
                    <div className="h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 flex items-center gap-1.5 text-sm font-semibold">
                      <CheckCircle2 className="h-4.5 w-4.5" /> Approved
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Max Capacity (Guests)</label>
                    <Input
                      type="number"
                      required
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="border-input h-11 rounded-xl bg-white"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Starting Price per Event (₹)</label>
                    <Input
                      type="number"
                      required
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      className="border-input h-11 rounded-xl bg-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Venue Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-input rounded-2xl bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-teal-primary/40 focus:border-teal-primary transition-all resize-none"
                  />
                </div>

                <hr className="border-[#E2E2DE]" />

                {/* Location Specs */}
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-sm text-neutral-dark">Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Address Line 1</label>
                      <Input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="border-input h-11 rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Address Line 2</label>
                      <Input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="border-input h-11 rounded-xl bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3 md:col-span-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-muted uppercase">City</label>
                        <Input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="border-input h-11 rounded-xl bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-muted uppercase">State</label>
                        <Input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="border-input h-11 rounded-xl bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-muted uppercase">Pincode</label>
                        <Input
                          type="text"
                          required
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="border-input h-11 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={saveLoading}
                    className="bg-[#0D7377] text-white hover:bg-[#0a5b5e] font-bold rounded-xl h-11 px-6 flex items-center justify-center gap-2 shadow-md shadow-[#0D7377]/10"
                  >
                    {saveLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 2: PHOTO GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              {/* Upload Form */}
              <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl p-6">
                <form onSubmit={handleImageUpload} className="flex flex-col md:flex-row items-end gap-4">
                  <div className="space-y-1.5 flex-grow">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Select Image (JPEG/PNG)</label>
                    <div className="relative border border-dashed border-input rounded-xl bg-[#FAFAF8] p-3 flex items-center gap-2">
                      <Upload className="h-4.5 w-4.5 text-neutral-muted shrink-0" />
                      <input
                        type="file"
                        required
                        accept="image/jpeg,image/png"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="text-xs font-semibold text-neutral-dark cursor-pointer outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 w-full md:w-48">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Image Type</label>
                    <select
                      value={imageType}
                      onChange={(e) => setImageType(e.target.value)}
                      className="w-full h-11 border border-input rounded-xl bg-white px-3 text-xs outline-none focus:border-teal-primary"
                    >
                      <option value="GALLERY">Gallery Item</option>
                      <option value="PRIMARY">Cover Image</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    disabled={uploadLoading || !uploadFile}
                    className="bg-[#0D7377] text-white hover:bg-[#0a5b5e] font-bold rounded-xl h-11 px-5 flex items-center justify-center gap-2 w-full md:w-auto"
                  >
                    {uploadLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>Upload Image</span>
                  </Button>
                </form>
              </Card>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {venue.images.map((img) => (
                  <Card key={img.id} className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl overflow-hidden relative group h-44">
                    <Image
                      src={img.imageUrl}
                      alt="Venue gallery image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-black/60 text-white py-0.5 px-2 rounded-md">
                        {img.imageType}
                      </span>
                    </div>
                    {/* Delete overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === "docs" && (
            <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl p-6">
              <div className="space-y-4">
                <p className="text-xs text-neutral-muted">These documents were uploaded during onboarding and verified by the administration. To change them, please contact partner support.</p>
                <div className="divide-y divide-[#E2E2DE]">
                  {venue.documents.map((doc) => (
                    <div key={doc.id} className="py-4 flex justify-between items-center text-xs font-semibold">
                      <div className="space-y-1">
                        <span className="text-[#1A1A19] font-bold block">{doc.documentType}</span>
                        <span className="text-[10px] text-neutral-muted block">Status: Verified & Secure</span>
                      </div>
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0D7377] hover:underline font-bold"
                      >
                        View Attachment &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
