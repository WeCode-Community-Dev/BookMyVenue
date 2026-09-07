"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VenueResponse } from "@/context/AppContext";
import { Building, Plus, MapPin, Users } from "lucide-react";

interface VenuesTabProps {
  hostVenues: VenueResponse[];
  loading: boolean;
  onAddSpace: () => void;
}

export default function VenuesTab({ hostVenues, loading, onAddSpace }: VenuesTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground">Venues Directory</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            View active listing spaces and publish new venues.
          </p>
        </div>
        <Button onClick={onAddSpace} className="rounded-xl bg-primary text-primary-foreground font-semibold px-5">
          <Plus className="h-5 w-5 mr-1.5" />
          List a Space
        </Button>
      </div>

      {loading && hostVenues.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : hostVenues.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl py-16 flex flex-col items-center justify-center text-center gap-3">
          <Building className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">No venues listed yet</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Publish your first space to start receiving booking requests.
          </p>
          <Button onClick={onAddSpace} className="rounded-xl bg-primary text-primary-foreground font-semibold px-5 mt-2">
            <Plus className="h-4 w-4 mr-1.5" />
            List a Space
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hostVenues.map((v) => (
            <div
              key={v.id}
              onClick={() => router.push(`/host/venues/${v.id}`)}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between h-full group cursor-pointer hover:shadow-md hover:border-primary/40 transition-all"
            >
              <div className="relative aspect-video w-full bg-muted">

                {v.imageFiles?.[0] ? (
                  
                  <img
                     src={`http://localhost:8080/${v.imageFiles[0]}`}
                    alt={"hi"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xxs">
                    No image
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold border bg-primary/95 text-primary-foreground">
                  {v.venueType?.toUpperCase()}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <h4 className="font-extrabold text-sm text-foreground line-clamp-1">{v.name}</h4>
                <p className="text-xxs text-muted-foreground line-clamp-2 leading-relaxed">{v.description}</p>

                <div className="flex items-center justify-between text-xxs text-muted-foreground pt-2 border-t border-border/60">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-primary" />
                    {v.address}, {v.city}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    Up to {v.seatingCapacity}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xxs text-muted-foreground pt-1 flex-wrap">
                  {v.parking && (
                    <span className="px-2 py-0.5 rounded-full bg-muted text-foreground/80">
                      Parking
                    </span>
                  )}
                  {v.amenities?.map((a) => (
                    <span key={a} className="px-2 py-0.5 rounded-full bg-muted text-foreground/80">
                      {a.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3 bg-muted/10"
                onClick={(e) => e.stopPropagation()}
              >
                <Button onClick={() => router.push(`/venues/${v.id}`)} variant="outline" size="sm" className="rounded-xl text-xxs w-1/2">
                  Public View
                </Button>
                <Button onClick={() => router.push(`/host/venues/${v.id}`)} variant="outline" size="sm" className="rounded-xl text-xxs w-1/2">
                  View Venue
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
