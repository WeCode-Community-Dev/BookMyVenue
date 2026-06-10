// src/components/admin/VenueApprovalModal.tsx

"use client";

import Image from "next/image";
import {
  X,
  MapPin,
  Users,
  IndianRupee,
  Star,
  CalendarDays,
  User,
  Mail,
  Phone,
  Info,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface VenueApprovalModalProps {
  open: boolean;
  onClose: () => void;
}

export default function VenueApprovalModal({
  open,
  onClose,
}: VenueApprovalModalProps) {
  if (!open) return null;

  const galleryImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1511578314322-379afb476865",
  "https://images.unsplash.com/photo-1511578314322-379afb476865",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 md:p-6">
      <div className="max-h-[95vh] w-full max-w-7xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 p-5 md:p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Lagoona Beach Resort
            </h2>

            <div className="mt-2 flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4" />
              Cherai, Kochi
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
              Pending Approval
            </span>

            <button onClick={onClose}>
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid gap-4 p-5 md:grid-cols-[2fr_1fr] md:p-6">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={galleryImages[0]}
              alt="Venue"
              width={900}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {galleryImages.slice(1).map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl"
              >
                <Image
                  src={img}
                  alt="Venue"
                  width={300}
                  height={200}
                  className="h-full w-full object-cover"
                />

                {index === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-bold text-white">
                    +6
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-6 px-5 pb-5 md:grid-cols-2 md:px-6 md:pb-6">

          {/* Venue Information */}
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <Info className="h-5 w-5 text-teal-600" />
              Venue Information
            </h3>

            <div className="space-y-4">

              <InfoRow
                icon={<Users className="h-4 w-4" />}
                label="Capacity"
                value="200 Guests"
              />

              <InfoRow
                icon={<IndianRupee className="h-4 w-4" />}
                label="Price"
                value="₹18,000 / day"
              />

              <InfoRow
                icon={<Star className="h-4 w-4" />}
                label="Rating"
                value="4.8 (88 reviews)"
              />

              <InfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Availability"
                value="Available This Weekend"
              />

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Amenities
                </p>

                <div className="flex flex-wrap gap-2">
                  {["AC", "Parking", "WiFi", "+5 More"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Description
                </p>

                <p className="text-sm leading-7 text-slate-600">
                  A beautiful beachfront venue perfect for weddings,
                  parties and corporate events.
                </p>
              </div>

            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <MapPin className="h-5 w-5 text-teal-600" />
              Location
            </h3>

            <div className="overflow-hidden rounded-xl border">
              <iframe
                src={"https://maps.googleapis.com/maps/api/staticmap?center=Cherai,Kochi&zoom=13&size=800x500&key=YOUR_GOOGLE_MAPS_API_KEY"}
                width={800}
                height={500}
                className="w-full"
              />
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Cherai, Kochi, Kerala, India
              </p>

              <button className="flex items-center gap-2 rounded-lg border border-teal-200 px-4 py-2 text-sm font-medium text-teal-600">
                Open In Maps
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Owner Information */}
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-teal-600" />
              Owner Information
            </h3>

            <div className="space-y-4">
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="Owner Name"
                value="Vishnu Raj"
              />

              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value="vishnu.raj@example.com"
              />

              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value="+91 98765 43210"
              />

              <InfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Member Since"
                value="24 May 2024"
              />
            </div>
          </div>

          {/* Submission Info */}
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              Submission Details
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Submitted On
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  24 May 2025, 10:30 AM
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Additional Notes
                </p>

                <textarea
                  readOnly
                  value="Please review and approve the venue listing."
                  className="h-28 w-full rounded-xl border border-slate-200 p-3 text-sm"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white p-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-3 font-medium"
          >
            Cancel
          </button>

          <button className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700">
            Approve Venue
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span>{label}</span>
      </div>

      <span className="text-right font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}