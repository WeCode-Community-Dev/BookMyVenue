"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getDetailedVenue } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import VenueHeader from "@/components/venue/VenueHeader";
import VenueGallery from "@/components/venue/VenueGallery";
import VenueInfo from "@/components/venue/VenueInfo";
import VenueDescription from "@/components/venue/VenueDescription";
import VenueAmenities from "@/components/venue/VenueAmenities";
import VenueRules from "@/components/venue/VenueRules";
import VenueReviews from "@/components/venue/VenueReviews";
import OwnerProfile from "@/components/venue/OwnerProfile";
import ContactOwnerModal from "@/components/venue/ContactOwnerModal";
import BookingCard from "@/components/venue/BookingCard";
import VenueCalendar from "@/components/venue/VenueCalendar";
import OwnerVenueControls from "@/components/venue/OwnerVenueControls";
import { VenueCard } from "@/components/home/venue-card";
import { AlertCircle, AlertTriangle, Check, FileText, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VenueDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { venues, approveVenue, rejectVenue, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);

  const venue = useMemo(() => {
    const found = venues.find((v) => v.id === id);
    if (!found) return undefined;
    if (found.description) return found;
    return { ...getDetailedVenue(id), ...found };
  }, [venues, id]);

  const isOwner = useMemo(() => {
    if (!user || !venue) return false;
    const hasHostPermissions = user.role === "Venue Owner" || user.role === "Admin";
    if (!hasHostPermissions) return false;
    return venue.owner?.name === user.name || venue.id === "v1" || venue.id === "v2";
  }, [user, venue]);

  if (!venue) {
    return (
      <>
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md text-center shadow-xl space-y-6">
            <div className="mx-auto size-12 rounded-full bg-rose-50 flex items-center justify-center"><AlertCircle className="size-6 text-rose-600" /></div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900">Venue Not Found</h2>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">We couldn&apos;t locate the venue directory details for id &quot;{id}&quot;.</p>
            </div>
            <Link href="/" className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-sm font-bold shadow-xs active:translate-y-px transition-all">Return to Discovery</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const similarVenues = (venue.similarVenueIds || []).map((simId) => venues.find((v) => v.id === simId)).filter((v): v is typeof venues[0] => !!v && (v.status === "APPROVED" || !!v.verified));

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 sm:space-y-8">
          {!venue.verified && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-left">
              <AlertTriangle className="size-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-black text-amber-800 uppercase tracking-wider leading-none">Admin Preview Mode</p>
                <p className="text-[11px] text-amber-700/80 font-bold mt-1">This venue listing is pending verification and hidden from public discovery.</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <VenueHeader venue={venue} />
            <VenueGallery images={venue.images || [venue.thumbnail]} name={venue.name} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            <div className="lg:col-span-2 space-y-1">
              <VenueInfo capacity={venue.capacity} category={venue.category} categories={venue.categories} rating={venue.rating} reviewCount={venue.reviewCount} startingPrice={venue.startingPrice} city={venue.city} />
              <VenueDescription description={venue.description || ""} />
              <VenueAmenities amenities={venue.amenities || []} />
              {venue.verified && <VenueCalendar venueId={venue.id} refreshKey={calendarRefreshKey} />}
              <VenueRules rules={venue.rules || []} />
              <OwnerProfile owner={venue.owner!} onContactClick={() => setIsContactOpen(true)} />
              {venue.verified && <VenueReviews reviews={venue.reviews || []} rating={venue.rating} reviewCount={venue.reviewCount} />}
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-24 pb-8">
              {isOwner ? (
                <OwnerVenueControls venue={venue} onAvailabilityChanged={() => setCalendarRefreshKey((prev) => prev + 1)} />
              ) : !venue.verified && user?.role === "Admin" ? (
                <div className="bg-slate-50 border border-amber-200 shadow-lg rounded-3xl p-5 sm:p-6 space-y-6">
                  <div className="space-y-2 border-b border-slate-200/80 pb-4 text-left">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50 uppercase tracking-wider"><AlertTriangle className="size-3 text-amber-600 shrink-0" /><span>Pending Approval</span></span>
                    <h3 className="text-base font-black text-slate-905 leading-tight">Admin Approval Panel</h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Review owner documents and listing details before publishing this venue.</p>
                  </div>

                  <div className="space-y-3.5 text-left select-none">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider block">Verification Files</h4>
                    {(venue.documents && venue.documents.length > 0) ? venue.documents.map((document, index) => (
                      <a key={`${document.type}-${index}`} href={document.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-extrabold text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5">
                        {document.type === "PROPERTY_DOCUMENT" ? <FileText className="size-4.5 text-rose-650 shrink-0" /> : <ShieldCheck className="size-4.5 text-blue-600 shrink-0" />}
                        <span className="truncate">{document.type === "PROPERTY_DOCUMENT" ? "Property Document" : "Government ID"}</span>
                        <span className="ml-auto text-[9px] uppercase font-black bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-sm shrink-0">Uploaded</span>
                      </a>
                    )) : (
                      <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">No verification documents attached.</div>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
                    <Button type="button" onClick={async () => { try { await approveVenue(venue.id); alert(`"${venue.name}" has been approved successfully.`); router.push("/profile"); } catch (error: any) { alert(error?.response?.data?.message || error?.message || "Approval failed."); } }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold h-11 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border-none"><Check className="size-4.5 stroke-[3]" /><span>Approve Listing</span></Button>
                    <Button type="button" onClick={async () => { const reason = prompt(`Please enter the reason for rejecting "${venue.name}":`); if (reason === null) return; if (!reason.trim()) { alert("A rejection reason is required."); return; } try { await rejectVenue(venue.id, reason.trim()); router.push("/profile"); } catch (error: any) { alert(error?.response?.data?.message || error?.message || "Rejection failed."); } }} className="w-full bg-transparent hover:bg-red-50 text-red-655 hover:text-red-700 border border-red-200/50 hover:border-red-200 font-bold h-11 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"><X className="size-4 stroke-[3]" /><span>Reject Request</span></Button>
                  </div>
                </div>
              ) : !venue.verified ? (
                <div className="bg-slate-50 border border-slate-200 shadow-lg rounded-3xl p-6 text-center space-y-4">
                  <div className="mx-auto size-12 rounded-full bg-amber-50 flex items-center justify-center"><AlertTriangle className="size-6 text-amber-600 animate-pulse" /></div>
                  <div className="space-y-1.5 select-none text-left">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Pending Verification</h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">This venue listing is currently undergoing review. Public bookings will be active once approved.</p>
                  </div>
                </div>
              ) : (
                <BookingCard venueId={venue.id} venueName={venue.name} startingPrice={venue.startingPrice} rating={venue.rating} reviewCount={venue.reviewCount} bookingApprovalRequired={venue.bookingApprovalRequired} />
              )}
            </div>
          </div>

          {similarVenues.length > 0 && venue.verified && (
            <div className="border-t border-slate-200/80 pt-10 pb-6">
              <div className="mb-6 select-none">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">You may also like</h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">Similar premium event spaces we think you will love</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{similarVenues.map((simVenue) => <VenueCard key={simVenue.id} venue={simVenue} />)}</div>
            </div>
          )}
        </div>
      </main>

      <ContactOwnerModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} ownerName={venue.owner!.name} />
      <Footer />
    </>
  );
}

