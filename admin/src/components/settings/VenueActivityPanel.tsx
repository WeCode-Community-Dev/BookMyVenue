import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

interface ActivityEntry {
  _id: string;
  actorId?: { _id: string; username: string; email: string } | null;
  actorRole: "superAdmin" | "admin" | "owner" | "system";
  action: string;
  reason?: string;
  createdAt: string;
}

interface ActivityResponse {
  logs: ActivityEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Owner-facing wording, not the internal action name
const ACTION_LABELS: Record<string, string> = {
  approve_venue: "Venue approved",
  reject_venue: "Venue rejected",
  suspend_venue: "Venue suspended",
  unsuspend_venue: "Suspension lifted",
  auto_suspend_venue: "Suspended automatically",
  extend_venue_deadline: "Edit deadline extended",
  request_inactivity: "You requested to close",
  cancel_inactivity: "You cancelled the closure",
  approve_inactivity: "Closure approved",
  reject_inactivity: "Closure declined",
  venue_closed: "Venue closed",
  reopen_venue: "You reopened the venue",
  request_venue_deletion: "You requested deletion",
};

const ACTOR_LABELS: Record<string, string> = {
  superAdmin: "Admin team",
  admin: "Admin team",
  owner: "You",
  system: "Automatic",
};

export function VenueActivityPanel({ venueId }: { venueId: string }) {
  const { data, isLoading } = useApiQuery<ActivityResponse>(
    [...QUERY_KEYS.OWNER_VENUE_ACTIVITY, venueId],
    {
      method: "GET",
      url: `${API_ENDPOINTS.OWNER_VENUE_SETTINGS}/${venueId}/activity?page=1&limit=20`,
    },
    { enabled: !!venueId },
  );

  const entries = data?.logs ?? [];

  return (
    <Card className="p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b pb-2">
        <History className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold">Activity</h3>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground pt-3">
          Loading activity...
        </p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground pt-3">
          Nothing has happened to this venue yet.
        </p>
      ) : (
        <ul className="divide-y pt-1">
          {entries.map((entry) => (
            <li
              key={entry._id}
              className="flex items-start justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </p>
                {entry.reason && (
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">
                    {entry.reason}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge variant="outline" className="text-xs">
                  {ACTOR_LABELS[entry.actorRole] ?? entry.actorRole}
                </Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
