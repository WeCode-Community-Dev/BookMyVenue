"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserVenueDetails from "@/components/UserVenueDetails";

export default function PublicVenueDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return (
      <div className="flex-grow flex items-center justify-center p-12 text-center bg-background">
        <p className="text-muted-foreground text-sm">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/venues"
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline mb-6 select-none"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to venue search
        </Link>

        {/* Reusable details component */}
        <UserVenueDetails venueId={id} />
      </div>
    </div>
  );
}
