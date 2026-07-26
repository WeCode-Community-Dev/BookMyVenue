import { useState } from "react";
import { useParams } from "react-router";
import { Loader2, AlertCircle, Settings } from "lucide-react";
import { useVenueSettings } from "@/services/api/useVenueSettings";
import { VenueSettingsView } from "@/components/settings/VenueSettingsView";
import { VenueSettingsEdit } from "@/components/settings/VenueSettingsEdit";
import { DangerZone } from "@/components/settings/DangerZone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function VenueSettingsPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const { data: venue, isLoading, error } = useVenueSettings(venueId!);
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-6 max-w-md text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <h2 className="text-lg font-semibold">
            Failed to load venue settings
          </h2>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Unable to fetch venue data. Please try again."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Venue Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your venue configuration
            </p>
          </div>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        ) : (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </div>

      {isEditing ? (
        <VenueSettingsEdit venue={venue} onCancel={() => setIsEditing(false)} />
      ) : (
        <VenueSettingsView venue={venue} />
      )}

      <DangerZone venue={venue} />
    </div>
  );
}
