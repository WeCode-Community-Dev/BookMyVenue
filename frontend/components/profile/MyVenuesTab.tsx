"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, Plus, UploadCloud } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as venueService from "@/services/venue.service";
import { toAbsoluteAssetUrl } from "@/lib/backend-mappers";

const CATEGORIES = ["Wedding", "Conference", "Sports", "Cafe", "Resort", "Auditorium", "Birthday", "Party"];
const CITIES = ["Kochi", "Bangalore", "Mumbai", "Delhi"];
const AMENITIES = ["WiFi", "Air Conditioning", "Catering", "Parking", "Sound System", "Projector", "Stage", "Restrooms"];
const PRESETS = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
];

export default function MyVenuesTab() {
  const { user, venues, addVenue } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("Kochi");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>(["Wedding"]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [presetCover, setPresetCover] = useState(PRESETS[0]);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverStorageUrl, setCoverStorageUrl] = useState("");
  const [govDocUrl, setGovDocUrl] = useState("");
  const [propertyDocUrl, setPropertyDocUrl] = useState("");
  const [govFileName, setGovFileName] = useState("");
  const [propertyFileName, setPropertyFileName] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const govRef = useRef<HTMLInputElement>(null);
  const propertyRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const hostVenues = venues.filter((venue) => venue.owner?.name === user.name || venue.id === "v1" || venue.id === "v2");

  const toggleCategory = (value: string) => setCategories((prev) => prev.includes(value) ? (prev.length > 1 ? prev.filter((item) => item !== value) : prev) : [...prev, value]);
  const toggleAmenity = (value: string) => setAmenities((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);

  const uploadDocument = async (file: File, type: "gov" | "property") => {
    const formData = new FormData();
    formData.append("documents", file);
    const result = await venueService.uploadVenueDocuments(formData);
    const documentUrl = result.documents?.[0]?.documentUrl;
    if (!documentUrl) throw new Error("Document upload did not return a document URL.");
    if (type === "gov") { setGovDocUrl(documentUrl); setGovFileName(file.name); }
    else { setPropertyDocUrl(documentUrl); setPropertyFileName(file.name); }
  };

  const handleCoverUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
    const formData = new FormData();
    formData.append("images", file);
    const result = await venueService.uploadVenueImage(formData);
    const imageUrl = result.images?.[0]?.imageUrl;
    if (!imageUrl) throw new Error("Image upload did not return an image URL.");
    setCoverStorageUrl(imageUrl);
    setCoverPreview(toAbsoluteAssetUrl(imageUrl));
    setCoverFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !capacity || !price || !description.trim() || !govDocUrl || !propertyDocUrl || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addVenue({
        name: name.trim(),
        category: categories[0],
        categories,
        city,
        address: address.trim(),
        capacity: parseInt(capacity, 10),
        startingPrice: parseInt(price, 10),
        description: description.trim(),
        amenities,
        thumbnail: coverPreview || presetCover,
        images: coverStorageUrl ? [coverStorageUrl] : [presetCover],
        documents: [
          { type: "GOVERNMENT_ID", documentUrl: govDocUrl },
          { type: "PROPERTY_DOCUMENT", documentUrl: propertyDocUrl },
        ],
      });
      alert(`"${name}" has been submitted for review.`);
      setIsAdding(false);
      setName(""); setAddress(""); setCapacity(""); setPrice(""); setDescription(""); setAmenities([]); setCategories(["Wedding"]); setPresetCover(PRESETS[0]); setCoverPreview(""); setCoverStorageUrl(""); setGovDocUrl(""); setPropertyDocUrl(""); setGovFileName(""); setPropertyFileName(""); setCoverFileName("");
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to submit venue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdding) return (
    <div className="bg-white border border-slate-200/60 shadow-xs rounded-3xl p-6 sm:p-8 space-y-6 text-left">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <button onClick={() => setIsAdding(false)} className="size-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer bg-white"><ArrowLeft className="size-4" /></button>
        <div><h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Venue</h2><p className="text-xs text-slate-400 font-semibold">Uploads are sent to the backend immediately and linked on submit.</p></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input ref={govRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => { const file=e.target.files?.[0]; if(!file)return; try{ await uploadDocument(file,"gov"); } catch (error:any) { alert(error?.response?.data?.message || error?.message || "Failed to upload document."); } e.target.value=""; }} />
        <input ref={propertyRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => { const file=e.target.files?.[0]; if(!file)return; try{ await uploadDocument(file,"property"); } catch (error:any) { alert(error?.response?.data?.message || error?.message || "Failed to upload document."); } e.target.value=""; }} />
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const file=e.target.files?.[0]; if(!file)return; try{ await handleCoverUpload(file); } catch (error:any) { alert(error?.response?.data?.message || error?.message || "Failed to upload image."); } e.target.value=""; }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Venue Name</label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">City</label><select value={city} onChange={(e) => setCity(e.target.value)} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none">{CITIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Address</label><Input value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Capacity</label><Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required /></div>
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Starting Price</label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
          <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="flex w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none min-h-[90px]" /></div>
          <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Categories</label><div className="flex flex-wrap gap-2">{CATEGORIES.map((item) => <button key={item} type="button" onClick={() => toggleCategory(item)} className={`px-3 py-2 border rounded-xl text-xs font-extrabold ${categories.includes(item) ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-white border-slate-200 text-slate-650"}`}>{item}</button>)}</div></div>
          <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amenities</label><div className="flex flex-wrap gap-2">{AMENITIES.map((item) => <button key={item} type="button" onClick={() => toggleAmenity(item)} className={`px-3 py-2 border rounded-xl text-xs font-extrabold ${amenities.includes(item) ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-white border-slate-200 text-slate-650"}`}>{item}</button>)}</div></div>
          <div className="md:col-span-2 space-y-3"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cover Photo</label><div className="flex gap-3 flex-wrap">{PRESETS.map((item, index) => <button key={index} type="button" onClick={() => { setPresetCover(item); setCoverPreview(""); setCoverStorageUrl(""); setCoverFileName(""); }} className={`relative h-16 w-24 rounded-lg overflow-hidden border-2 ${presetCover===item && !coverPreview ? "border-rose-600" : "border-transparent"}`}><Image src={item} alt={`Preset ${index + 1}`} fill className="object-cover" /></button>)}</div><button type="button" onClick={() => coverRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold bg-white"><UploadCloud className="size-4" />{coverFileName || "Upload Custom Cover"}</button>{coverPreview && <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-slate-200"><Image src={coverPreview} alt="Cover Preview" fill className="object-cover" /></div>}</div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"><button type="button" onClick={() => govRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-5 text-left ${govDocUrl ? "border-emerald-500 bg-emerald-50/10" : "border-slate-200"}`}><div className="font-black text-xs uppercase">Government Photo ID</div><div className="text-[11px] text-slate-500 mt-1">{govFileName || "Upload Aadhar, passport, or license"}</div></button><button type="button" onClick={() => propertyRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-5 text-left ${propertyDocUrl ? "border-emerald-500 bg-emerald-50/10" : "border-slate-200"}`}><div className="font-black text-xs uppercase">Property Document</div><div className="text-[11px] text-slate-500 mt-1">{propertyFileName || "Upload license, utility bill, or deed"}</div></button></div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="border-slate-200 text-slate-500 font-bold h-11 px-6 rounded-xl">Cancel</Button><Button type="submit" disabled={isSubmitting || !govDocUrl || !propertyDocUrl} className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-8 rounded-xl border-none">{isSubmitting ? "Submitting..." : "Publish Venue"}</Button></div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"><div><h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Manage Venues</h2><p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">Submit venues through the real backend approval flow.</p></div><Button type="button" onClick={() => setIsAdding(true)} className="self-start sm:self-center flex items-center gap-1.5 bg-slate-900 hover:bg-slate-950 text-white text-xs font-black uppercase tracking-wider h-10 px-4 rounded-xl border-none"><Plus className="size-4" /><span>Add New Venue</span></Button></div>
      {hostVenues.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{hostVenues.map((venue) => <div key={venue.id} className="flex border border-slate-200/60 shadow-xs rounded-2xl overflow-hidden bg-white"><div className="relative w-28 sm:w-36 shrink-0 bg-slate-100"><Image src={venue.thumbnail} alt={venue.name} fill className="object-cover" /></div><div className="flex-grow p-4 text-left flex flex-col justify-between space-y-3"><div className="space-y-1"><div className="flex flex-wrap gap-1">{(venue.categories?.length ? venue.categories : [venue.category]).map((item) => <span key={item} className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100/50 uppercase leading-none">{item}</span>)}</div><Link href={`/venue/${venue.id}`} className="font-extrabold text-slate-850 text-sm sm:text-base leading-tight hover:text-rose-600 transition block truncate">{venue.name}</Link><div className="flex items-center gap-1 text-[11px] font-bold text-slate-400"><MapPin className="size-3" /><span>{venue.city}</span></div></div><div className="flex items-baseline justify-between pt-2 border-t border-slate-100/60"><span className="text-xs font-black text-slate-900">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(venue.startingPrice)}</span><span className="text-[10px] font-black text-slate-450 uppercase">{venue.status || "PENDING"}</span></div></div></div>)}</div> : <div className="bg-slate-50 border border-slate-150/50 rounded-2xl py-12 px-6 text-center text-slate-450 font-semibold text-sm max-w-lg mx-auto space-y-3"><UploadCloud className="size-8 text-slate-300 mx-auto" /><p>No venues added yet.</p></div>}
    </div>
  );
}
