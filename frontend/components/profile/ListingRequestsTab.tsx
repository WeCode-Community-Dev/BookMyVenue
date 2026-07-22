"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Check, ExternalLink, FileText, MapPin, ShieldCheck, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const LABELS: Record<"GOVERNMENT_ID" | "PROPERTY_DOCUMENT", string> = {
  GOVERNMENT_ID: "Government ID",
  PROPERTY_DOCUMENT: "Property Document",
};

const REQUIRED_TYPES: Array<"GOVERNMENT_ID" | "PROPERTY_DOCUMENT"> = ["GOVERNMENT_ID", "PROPERTY_DOCUMENT"];

export default function ListingRequestsTab() {
  const { venues, approveVenue, rejectVenue } = useAuth();
  const [openVenueId, setOpenVenueId] = useState<string | null>(null);
  const [busyVenueId, setBusyVenueId] = useState<string | null>(null);

  const pendingVenues = useMemo(
    () => venues.filter((venue) => venue.status === "PENDING" || venue.status === "PENDING_DOCUMENTS"),
    [venues],
  );

  const pendingReviewCount = pendingVenues.filter((venue) => venue.status === "PENDING").length;
  const missingDocsCount = pendingVenues.filter((venue) => venue.status === "PENDING_DOCUMENTS").length;

  const handleApprove = async (id: string, name: string) => {
    setBusyVenueId(id);
    try {
      await approveVenue(id);
      alert(`"${name}" has been approved.`);
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to approve venue.");
    } finally {
      setBusyVenueId(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    const reason = prompt(`Please enter the reason for rejecting "${name}":`);
    if (reason === null) return;
    if (!reason.trim()) {
      alert("A rejection reason is required.");
      return;
    }

    setBusyVenueId(id);
    try {
      await rejectVenue(id, reason.trim());
      alert(`"${name}" has been rejected.`);
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to reject venue.");
    } finally {
      setBusyVenueId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-905 tracking-tight flex items-center gap-2">
            <span>Venue Listing Requests</span>
            <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-full border border-amber-200/50 font-black">
              {pendingVenues.length} Pending
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
            Review real backend submissions, including uploaded documents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">Ready For Admin Review</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{pendingReviewCount}</div>
            <p className="mt-1 text-xs font-semibold text-slate-600">These requests have the required documents and can be approved.</p>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-700">Blocked By Missing Documents</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{missingDocsCount}</div>
            <p className="mt-1 text-xs font-semibold text-slate-600">These requests cannot be approved until all required uploads are attached.</p>
          </div>
        </div>
      </div>

      {pendingVenues.length === 0 ? (
        <div className="bg-slate-50 border border-slate-150/50 rounded-2xl py-12 px-6 text-center text-slate-450 font-semibold text-sm max-w-lg mx-auto space-y-3">
          <ShieldCheck className="size-8 text-slate-300 mx-auto" />
          <p>No pending verification requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingVenues.map((venue) => {
            const isOpen = openVenueId === venue.id;
            const isBusy = busyVenueId === venue.id;
            const needsDocuments = venue.status === "PENDING_DOCUMENTS";
            const formattedPrice = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(venue.startingPrice);
            const attachedTypes = new Set((venue.documents || []).map((document) => document.type));
            const missingTypes = REQUIRED_TYPES.filter((type) => !attachedTypes.has(type));

            return (
              <div key={venue.id} className={`bg-white border shadow-xs rounded-2xl p-4 sm:p-5 space-y-4 ${needsDocuments ? "border-rose-200 bg-rose-50/20" : "border-slate-200/70"}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <Image src={venue.thumbnail} alt={venue.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-2 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border uppercase leading-none ${needsDocuments ? "text-rose-700 bg-rose-50 border-rose-200/50" : "text-amber-700 bg-amber-50 border-amber-200/50"}`}>
                        {needsDocuments ? "Pending Documents" : "Pending Admin Review"}
                      </span>
                      <span className="text-xs font-bold text-slate-400 text-right">{venue.categories?.join(", ") || venue.category}</span>
                    </div>
                    <Link href={`/venue/${venue.id}`} className="text-base sm:text-lg font-black text-slate-900 hover:text-rose-600 transition block">
                      {venue.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-semibold pt-1">
                      <div className="flex items-center gap-1"><MapPin className="size-3.5 text-slate-400" /><span>{venue.city}, India</span></div>
                      <div className="flex items-center gap-1 border-l border-slate-200 pl-4"><User className="size-3.5 text-slate-400" /><span>{venue.owner?.name || "Independent Host"}</span></div>
                      <div className="border-l border-slate-200 pl-4"><span>{venue.capacity} guests</span></div>
                    </div>
                    {needsDocuments && (
                      <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-white/80 px-3 py-2 text-xs font-semibold text-rose-700">
                        <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                        <span>Approval is blocked. Missing: {missingTypes.map((type) => LABELS[type]).join(", ") || "required documents"}.</span>
                      </div>
                    )}
                  </div>
                  <div className="sm:border-l border-slate-100 sm:pl-5 shrink-0 text-left sm:text-right flex sm:flex-col justify-between gap-2 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none mb-1">Starting Cost</span>
                      <span className="text-base font-black text-slate-900 leading-none">{formattedPrice}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase leading-none px-2 py-1 rounded-md border ${needsDocuments ? "text-rose-700 bg-rose-50 border-rose-200" : "text-slate-450 bg-slate-50 border-slate-150"}`}>{venue.status}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
                  <button onClick={() => setOpenVenueId(isOpen ? null : venue.id)} className="text-xs font-bold text-rose-600 hover:text-rose-700 transition flex items-center gap-1 bg-transparent border-none cursor-pointer">
                    <FileText className="size-3.5" />
                    <span>{isOpen ? "Hide Details" : "Review Details"}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => handleReject(venue.id, venue.name)} disabled={isBusy} className="bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200/50 text-xs font-extrabold h-8 rounded-lg px-3 cursor-pointer disabled:opacity-60">
                      <X className="size-3.5 mr-1 stroke-[3]" /><span>{isBusy ? "Working..." : "Reject"}</span>
                    </Button>
                    <Button type="button" onClick={() => handleApprove(venue.id, venue.name)} disabled={isBusy || needsDocuments} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black h-8 rounded-lg px-3.5 cursor-pointer border-none disabled:opacity-60">
                      <Check className="size-3.5 mr-1 stroke-[3.5]" /><span>{isBusy ? "Working..." : needsDocuments ? "Missing Docs" : "Approve"}</span>
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <div className="bg-slate-50/70 border border-slate-200/40 rounded-xl p-4 space-y-4 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`border rounded-lg p-3 text-xs font-semibold flex items-center gap-2 ${needsDocuments ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-white border-slate-200 text-slate-700"}`}>
                        <ShieldCheck className={`size-4 ${needsDocuments ? "text-rose-600" : "text-amber-600"}`} />
                        <span>{needsDocuments ? "Waiting for required uploads" : venue.status}</span>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <FileText className="size-4 text-slate-500" />
                        <span>{venue.rejectionReason || "No rejection reason recorded."}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Document Checklist</h4>
                        <span className="text-[10px] font-black uppercase text-slate-400">{(venue.documents || []).length} Attached</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {REQUIRED_TYPES.map((type) => {
                          const document = venue.documents?.find((item) => item.type === type);
                          return document ? (
                            <a key={type} href={document.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs font-semibold text-emerald-800 hover:border-emerald-300 transition">
                              <Check className="size-4 shrink-0" />
                              <span className="flex-1 truncate">{LABELS[type]}</span>
                              <ExternalLink className="size-3.5 shrink-0" />
                            </a>
                          ) : (
                            <div key={type} className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs font-semibold text-rose-700">
                              <AlertTriangle className="size-4 shrink-0" />
                              <span>{LABELS[type]} missing</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">Venue Description</h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl font-medium">{venue.description || "No description provided."}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-100 p-3 rounded-xl text-xs font-bold text-slate-700">
                        <p className="text-slate-800 font-extrabold">{venue.address || "Address not provided"}</p>
                        <p className="text-slate-450">{venue.city}, India</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-slate-100 rounded-xl min-h-[50px] items-center">
                        {venue.amenities?.length ? venue.amenities.map((amenity, index) => <span key={index} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{amenity}</span>) : <span className="text-[10px] font-semibold text-slate-400">No amenities selected.</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
