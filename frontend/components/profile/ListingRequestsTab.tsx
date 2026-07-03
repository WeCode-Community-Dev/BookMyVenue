"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, FileText, User, ShieldCheck, MapPin, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function ListingRequestsTab() {
  const { venues, approveVenue, rejectVenue } = useAuth();
  const [selectedDocVenue, setSelectedDocVenue] = useState<string | null>(null);

  // We filter the venues that are NOT verified
  // To avoid showing all 20 default unverified venues at once, let's show the custom added ones, plus a few select default ones
  const pendingVenues = venues.filter(
    (v) => !v.verified && (v.id.startsWith("v-custom") || v.id === "v2" || v.id === "v3" || v.id === "v4")
  );

  const handleApprove = (id: string, name: string) => {
    approveVenue(id);
    alert(`"${name}" has been approved and is now verified and active globally!`);
  };

  const handleReject = (id: string, name: string) => {
    if (confirm(`Are you sure you want to reject the listing request for "${name}"?`)) {
      rejectVenue(id);
      alert(`Listing request for "${name}" has been rejected.`);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="text-left select-none">
        <h2 className="text-xl sm:text-2xl font-black text-slate-905 tracking-tight flex items-center gap-2">
          <span>Venue Listing Requests</span>
          <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-full border border-amber-200/50 font-black">
            {pendingVenues.length} Pending
          </span>
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
          Review host credentials and property listings. Approve verified spaces to publish them live.
        </p>
      </div>

      {pendingVenues.length > 0 ? (
        <div className="space-y-4">
          {pendingVenues.map((venue) => {
            const formattedPrice = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(venue.startingPrice);

            const isDocOpen = selectedDocVenue === venue.id;

            return (
              <div
                key={venue.id}
                className="bg-white border border-slate-200/70 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col gap-4 hover:border-slate-300 transition duration-200"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="relative w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <Image
                      src={venue.thumbnail}
                      alt={venue.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details content */}
                  <div className="flex-grow space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50 uppercase leading-none">
                        Pending Admin Review
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Category: <span className="font-extrabold text-slate-700">{venue.categories && venue.categories.length > 0 ? venue.categories.join(", ") : venue.category}</span>
                      </span>
                    </div>

                    <Link
                      href={`/venue/${venue.id}`}
                      className="text-base sm:text-lg font-black text-slate-900 hover:text-rose-600 transition leading-tight block"
                    >
                      {venue.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-semibold select-none pt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-slate-400" />
                        <span>{venue.city}, India</span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                        <User className="size-3.5 text-slate-400" />
                        <span>Host: <span className="font-bold text-slate-700">{venue.owner?.name || "Independent Host"}</span></span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                        <span>Capacity: <span className="font-bold text-slate-700">{venue.capacity} guests</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Action values */}
                  <div className="sm:border-l border-slate-100 sm:pl-5 sm:min-w-[130px] shrink-0 text-left sm:text-right flex sm:flex-col justify-between items-baseline sm:items-end gap-2 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none mb-1">
                        Starting Cost
                      </span>
                      <span className="text-base font-black text-slate-900 leading-none">
                        {formattedPrice}
                      </span>
                    </div>
                    
                    <span className="text-[10px] font-black text-slate-450 uppercase leading-none bg-slate-50 border border-slate-150 px-2 py-1 rounded-md">
                      Pending
                    </span>
                  </div>
                </div>

                {/* Document Expand Toggle section */}
                <div className="border-t border-slate-100/70 pt-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedDocVenue(isDocOpen ? null : venue.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 transition flex items-center gap-1 cursor-pointer bg-transparent border-none"
                    >
                      <FileText className="size-3.5" />
                      <span>{isDocOpen ? "Hide Owner Documents" : "Review Owner Documents"}</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => handleReject(venue.id, venue.name)}
                        className="bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200/50 hover:border-red-200 text-xs font-extrabold h-8 rounded-lg px-3 cursor-pointer"
                      >
                        <X className="size-3.5 mr-1 stroke-[3]" />
                        <span>Reject</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleApprove(venue.id, venue.name)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black h-8 rounded-lg px-3.5 cursor-pointer border-none"
                      >
                        <Check className="size-3.5 mr-1 stroke-[3.5]" />
                        <span>Approve</span>
                      </Button>
                    </div>
                  </div>

                  {isDocOpen && (
                    <div className="bg-slate-50/70 border border-slate-200/40 rounded-xl p-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Property Registration Certificate</span>
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 mt-1 select-none">
                          <FileText className="size-4.5 text-rose-650" />
                          <span className="truncate">deed_reg_verify_signed.pdf</span>
                          <span className="ml-auto text-[9px] uppercase font-black bg-emerald-50 text-emerald-750 px-1.5 py-0.5 rounded-sm">Valid</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Owner Identity Document</span>
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 mt-1 select-none">
                          <ShieldCheck className="size-4.5 text-blue-600" />
                          <span className="truncate">national_id_card_front.jpg</span>
                          <span className="ml-auto text-[9px] uppercase font-black bg-blue-50 text-blue-750 px-1.5 py-0.5 rounded-sm">Verified</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-150/50 rounded-2xl py-12 px-6 text-center text-slate-450 font-semibold text-sm max-w-lg mx-auto space-y-3">
          <ShieldCheck className="size-8 text-slate-300 mx-auto" />
          <p>No pending verification requests.</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            All submitted property registers have been approved and published live.
          </p>
        </div>
      )}

    </div>
  );
}
