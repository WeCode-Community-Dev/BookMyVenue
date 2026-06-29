"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Car,
  Layers,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/src/admin/components/StatusBadge";
import Link from "next/link";
import { getAdminVenueDetails, getAdminVenuePhotos, getAdminVenueDocs } from "@/src/admin/route";
import { Skeleton } from "@/components/ui/skeleton";

export default function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [venue, setVenue] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenueData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailsRes, photosRes, docsRes] = await Promise.all([
          getAdminVenueDetails(id),
          getAdminVenuePhotos(id),
          getAdminVenueDocs(id),
        ]);
        setVenue(detailsRes);
        setPhotos(photosRes);
        setDocs(docsRes);
      } catch (err: any) {
        console.error("Error loading venue details:", err);
        setError("Failed to load venue details from backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenueData();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5 text-[#70706e] hover:text-[#1A1A19] mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to Venues
        </Button>
        <div className="flex flex-wrap items-start gap-3 justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5 text-[#70706e]">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="bg-[#F0F0EC] rounded-2xl p-8 text-center">
          <Building2 className="h-12 w-12 text-[#70706e] mx-auto mb-3" />
          <h2 className="font-semibold text-[#1A1A19] mb-2">{error || "Venue not found"}</h2>
          <p className="text-sm text-[#70706e] mb-4">
            This venue could not be loaded or does not exist. Check the verification queue.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/admin/venues">
              <Button variant="outline" className="border-[#E2E2DE] text-[#70706e] rounded-xl">
                All Venues
              </Button>
            </Link>
            <Link href={`/admin/verification/${id}`}>
              <Button className="bg-[#0D7377] hover:bg-[#0a5b5e] text-white rounded-xl">
                Check Verification Queue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5 text-[#70706e] hover:text-[#1A1A19] mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to Venues
        </Button>
        <div className="flex flex-wrap items-start gap-3 justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A19]">{venue.venueName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5 text-[#70706e]" />
              <span className="text-sm text-[#70706e]">{venue.city}, {venue.state}</span>
              <StatusBadge status={venue.status} size="md" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">

          {/* Gallery */}
          {photos?.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
                <h3 className="font-semibold text-sm text-[#1A1A19]">Gallery</h3>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((img: any, i: number) => (
                  <div key={i} className="aspect-video rounded-xl bg-[#F0F0EC] overflow-hidden">
                    <img src={img.imageUrl ?? img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue details */}
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
              <h3 className="font-semibold text-sm text-[#1A1A19]">Details</h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <VenueDetailRow icon={<Layers />} label="Type" value={venue.venueType} />
              <VenueDetailRow icon={<Users />} label="Max Capacity" value={`${venue.maxCapacity?.toLocaleString()} guests`} />
              <VenueDetailRow icon={<DollarSign />} label="Starting Price" value={`₹${Number(venue.startingPrice || 0).toLocaleString("en-IN")}`} />
              <VenueDetailRow icon={<Calendar />} label="Booking Type" value={venue.bookingType} />
              <VenueDetailRow icon={<Car />} label="Parking" value={venue.hasParking ? `Yes (${venue.parkingCapacity || 0} slots)` : "No"} />
              <VenueDetailRow icon={<MapPin />} label="Address" value={`${venue.address}, ${venue.city} - ${venue.pincode}`} />
            </div>
            {venue.description && (
              <div className="px-5 pb-5">
                <p className="text-[10px] font-bold text-[#70706e] uppercase tracking-wide mb-2">Description</p>
                <p className="text-sm text-[#1A1A19] leading-relaxed">{venue.description}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          {docs?.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
                <h3 className="font-semibold text-sm text-[#1A1A19]">Verification Documents</h3>
              </div>
              <div className="p-4 space-y-2">
                {docs.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#E2E2DE] hover:bg-[#FAFAF8] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-[#E6F1F1] flex items-center justify-center text-[#0D7377]">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1A1A19]">{doc.documentType.replace(/_/g, " ")}</p>
                        <p className="text-[10px] text-[#70706e]">Status: {doc.verificationStatus}</p>
                      </div>
                    </div>
                    {doc.documentUrl && (
                      <a href={doc.documentUrl} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm" className="h-7 rounded-lg text-[10px] px-2.5 gap-1 border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC]">
                          View <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onboarding checklist */}
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#E2E2DE]">
              <h3 className="font-semibold text-sm text-[#1A1A19]">Submission Checklist</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {[
                { label: "Venue Info", done: venue.stepVenueInfoDone },
                { label: "Photos", done: venue.stepPhotosDone },
                { label: "Facilities", done: venue.stepFacilitiesDone },
                { label: "Documents", done: venue.stepDocumentsDone },
              ].map(({ label, done }) => (
                <div key={label} className={`flex items-center gap-2 p-3 rounded-xl border ${done ? "bg-emerald-50 border-emerald-200" : "bg-[#F0F0EC] border-[#E2E2DE]"}`}>
                  <CheckCircle className={`h-4 w-4 shrink-0 ${done ? "text-emerald-600" : "text-[#E2E2DE]"}`} />
                  <span className={`text-xs font-semibold ${done ? "text-emerald-700" : "text-[#70706e]"}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#1A1A19]">Quick Actions</h3>
            <Link href={`/admin/verification/${venue.id}`}>
              <Button variant="outline" className="w-full border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl gap-2 justify-start">
                <ExternalLink className="h-4 w-4" /> View Verification
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs p-5 space-y-3">
            <h3 className="font-semibold text-sm text-[#1A1A19]">Venue Stats</h3>
            <StatLine label="Status" value={<StatusBadge status={venue.status} />} />
            <StatLine label="Total Area" value={venue.squareFeet ? `${venue.squareFeet.toLocaleString()} sq ft` : "—"} />
            <StatLine label="Bookings" value="—" note="Live data coming soon" />
            <StatLine label="Reviews" value="—" note="Live data coming soon" />
          </div>
        </div>
      </div>
    </div>
  );
}

function VenueDetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#70706e] uppercase tracking-wide flex items-center gap-1.5 mb-0.5">
        <span className="text-[#0D7377] [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>{label}
      </p>
      <p className="text-sm font-semibold text-[#1A1A19]">{value ?? "—"}</p>
    </div>
  );
}

function StatLine({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-[#70706e]">{label}</span>
      <div className="text-right">
        <span className="text-xs font-semibold text-[#1A1A19]">{value}</span>
        {note && <span className="text-[10px] text-[#70706e] block">{note}</span>}
      </div>
    </div>
  );
}
