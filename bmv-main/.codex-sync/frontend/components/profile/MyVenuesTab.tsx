"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Trash2, ArrowLeft, Star, MapPin, UploadCloud } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Venue } from "@/types";
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

export default function MyVenuesTab() {
  const { user, venues, addVenue } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("Kochi");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState(COVER_PRESETS[0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Wedding"]);

  // File states
  const [governmentIdUploaded, setGovernmentIdUploaded] = useState(false);
  const [propertyTitleUploaded, setPropertyTitleUploaded] = useState(false);
  const [customCoverPreviewUrl, setCustomCoverPreviewUrl] = useState("");

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName];
      return next.length > 0 ? next : ["Wedding"];
    });
  };

  const hostVenues = venues.filter(
    (v) => v.owner?.name === user.name || v.id === "v1" || v.id === "v2"
  );

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSelectPreset = (url: string) => {
    setCoverUrl(url);
    setCustomCoverPreviewUrl("");
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && address.trim() && capacity && price && description.trim() && selectedCategories.length > 0 && !!(governmentIdUploaded && propertyTitleUploaded)) {
      const finalCover = customCoverPreviewUrl || coverUrl;
      addVenue({
        name: name.trim(),
        category: selectedCategories[0] || "Wedding",
        categories: selectedCategories,
        city,
        address: address.trim(),
        capacity: parseInt(capacity),
        startingPrice: parseInt(price),
        description: description.trim(),
        amenities: selectedAmenities,
        thumbnail: finalCover,
        images: [
          finalCover,
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
        ],
      });
      alert(`"${name}" has been published successfully! It is now live in search directories.`);
      
      // Reset states
      setName("");
      setAddress("");
      setCapacity("");
      setPrice("");
      setDescription("");
      setSelectedAmenities([]);
      setSelectedCategories(["Wedding"]);
      setGovernmentIdUploaded(false);
      setPropertyTitleUploaded(false);
      setCustomCoverPreviewUrl("");
      setIsAdding(false);
    }
  };

  const isFormValid =
    name.trim() &&
    address.trim() &&
    capacity &&
    price &&
    description.trim() &&
    selectedCategories.length > 0 &&
    !!(governmentIdUploaded && propertyTitleUploaded);

  if (isAdding) {
    return (
      <div className="bg-white border border-slate-200/60 shadow-xs rounded-3xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in duration-200">
        
        {/* Form header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 select-none">
          <button
            onClick={() => setIsAdding(false)}
            className="size-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer bg-white"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Venue</h2>
            <p className="text-xs text-slate-400 font-semibold">Enter your space details to register it on BookMyVenue.</p>
          </div>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* Grid inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Venue Name
              </label>
              <Input
                id="name"
                required
                placeholder="e.g. Signature Rose Banquets"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="city" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                City Location
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="address" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Full Physical Address
              </label>
              <Input
                id="address"
                required
                placeholder="e.g. 10/4 Marina Bypass, Sector 3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="capacity" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Maximum Guests Capacity
              </label>
              <Input
                id="capacity"
                type="number"
                required
                placeholder="e.g. 500"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="price" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Starting Price (₹ / event)
              </label>
              <Input
                id="price"
                type="number"
                required
                placeholder="e.g. 45000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="description" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Venue Description
              </label>
              <textarea
                id="description"
                required
                rows={3}
                placeholder="Introduce your space, layout configurations, and accessibility details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 min-h-[90px]"
              />
            </div>

            {/* Categories Checklist */}
            <div className="space-y-2 md:col-span-2 select-none border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Categories (Select multiple if applicable)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer text-xs font-extrabold transition text-left bg-white ${
                        isChecked
                          ? "bg-rose-50 border-rose-200 text-rose-700"
                          : "bg-white border-slate-200 text-slate-650 hover:border-slate-350"
                      }`}
                    >
                      <div className={`size-4 rounded-sm border flex items-center justify-center transition ${
                        isChecked ? "bg-rose-600 border-rose-600 text-white" : "border-slate-300"
                      }`}>
                        {isChecked && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
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
                      className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer text-xs font-extrabold transition text-left ${
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
              <div className="grid grid-cols-5 gap-3 mb-4">
                {COVER_PRESETS.map((url, idx) => {
                  const isSelected = coverUrl === url && !customCoverPreviewUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCoverUrl(url);
                        setCustomCoverPreviewUrl("");
                      }}
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

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Or upload a custom cover photo</span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCustomCoverPreviewUrl("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80")}
                    className="flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer text-xs font-bold hover:bg-slate-50 transition bg-white"
                  >
                    <UploadCloud className="size-4" />
                    <span>{customCoverPreviewUrl ? "Change Custom Photo" : "Upload Custom Photo"}</span>
                  </button>
                  {customCoverPreviewUrl && (
                    <span className="text-xs text-slate-500 font-semibold truncate max-w-xs">
                      custom-cover.jpg (Uploaded)
                    </span>
                  )}
                </div>
                {customCoverPreviewUrl && (
                  <div className="mt-3 relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-slate-200">
                    <Image src={customCoverPreviewUrl} alt="Cover Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Documents Verification Section */}
            <div className="space-y-4 md:col-span-2 select-none border-t border-slate-100 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Document Verification</label>
                <p className="text-[11px] text-slate-450 font-semibold mt-0.5 leading-relaxed">
                  Upload mock verification files for this venue. Clicking the boxes will immediately simulate a successful document upload.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Box 1 */}
                <button
                  type="button"
                  onClick={() => setGovernmentIdUploaded(true)}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition active:scale-99 w-full bg-transparent flex flex-col items-center justify-center ${
                    governmentIdUploaded
                      ? "border-emerald-500 bg-emerald-50/10"
                      : "border-slate-200 hover:border-slate-350"
                  }`}
                >
                  <UploadCloud className={`size-8 ${governmentIdUploaded ? "text-emerald-600" : "text-slate-400"}`} />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider block">1. Government Photo ID</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Aadhar Card, Passport, or License</p>
                  </div>
                  {governmentIdUploaded ? (
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
                  onClick={() => setPropertyTitleUploaded(true)}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition active:scale-99 w-full bg-transparent flex flex-col items-center justify-center ${
                    propertyTitleUploaded
                      ? "border-emerald-500 bg-emerald-50/10"
                      : "border-slate-200 hover:border-slate-350"
                  }`}
                >
                  <UploadCloud className={`size-8 ${propertyTitleUploaded ? "text-emerald-600" : "text-slate-400"}`} />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider block">2. Property Title/Reg Doc</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Utility bill, license, or deed registration</p>
                  </div>
                  {propertyTitleUploaded ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-full select-none">
                      <Check className="size-3 stroke-[3]" />
                      <span>Property Document Uploaded</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-600 hover:text-rose-700">Click to Upload mock file</span>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Action footer */}
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 select-none">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(false)}
              className="border-slate-200 hover:bg-slate-100 text-slate-500 font-bold h-11 px-6 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-8 rounded-xl cursor-pointer shadow-xs active:translate-y-px border-none"
            >
              Publish Venue
            </Button>
          </div>

        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manage Venues
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
            Review, edit, and publish your properties in discovery directories.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsAdding(true)}
          className="self-start sm:self-center flex items-center gap-1.5 bg-slate-900 hover:bg-slate-950 text-white text-xs font-black uppercase tracking-wider h-10 px-4 rounded-xl cursor-pointer shadow-xs transition border-none"
        >
          <Plus className="size-4" />
          <span>Add New Venue</span>
        </Button>
      </div>

      {/* Venues Grid portfolio */}
      {hostVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostVenues.map((venue) => {
            const formattedPrice = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(venue.startingPrice);

            return (
              <div
                key={venue.id}
                className="flex border border-slate-200/60 shadow-xs rounded-2xl overflow-hidden bg-white hover:border-slate-300 transition duration-200"
              >
                {/* Image */}
                <div className="relative w-28 sm:w-36 shrink-0 bg-slate-100">
                  <Image
                    src={venue.thumbnail}
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-grow p-4 text-left flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {venue.categories && venue.categories.length > 0 ? (
                          venue.categories.map((cat) => (
                            <span key={cat} className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100/50 uppercase leading-none shrink-0">
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100/50 uppercase leading-none shrink-0">
                            {venue.category}
                          </span>
                        )}
                      </div>
                      {venue.rating > 0 && (
                        <div className="flex items-center gap-0.5 text-[10px] font-extrabold text-slate-900 shrink-0">
                          <Star className="size-3 text-amber-500 fill-amber-500" />
                          <span>{venue.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/venue/${venue.id}`}
                      className="font-extrabold text-slate-850 text-sm sm:text-base leading-tight hover:text-rose-600 transition block truncate max-w-[160px] sm:max-w-[200px]"
                    >
                      {venue.name}
                    </Link>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <MapPin className="size-3" />
                      <span>{venue.city}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-100/60">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs font-black text-slate-900">{formattedPrice}</span>
                      <span className="text-[9px] text-slate-400 font-bold">/ day</span>
                    </div>
                    
                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <Check className="size-3 text-emerald-500 stroke-[3]" />
                      <span>Active</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-150/50 rounded-2xl py-12 px-6 text-center text-slate-450 font-semibold text-sm max-w-lg mx-auto">
          No venues registered yet. Click &quot;Add New Venue&quot; to publish your first property!
        </div>
      )}

    </div>
  );
}
