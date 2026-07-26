import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, Store, ShieldCheck } from "lucide-react";

interface OwnerData {
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  _id?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  venues?: {
    name?: string;
    city?: string;
    address?: string;
    status?: string;
  }[];
  [key: string]: unknown;
}
export function OwnerDetailPanel({
  data: rawData,
}: {
  data: Record<string, unknown>;
}) {
  const data = rawData as unknown as OwnerData;
  if (!data) return null;

  return (
    <div className="space-y-6 text-sm">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-xl bg-background/50 border border-border">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/20 shrink-0">
          <Store className="w-10 h-10 text-blue-500" />
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {data.username || data.name}
          </h2>
          <div className="flex items-center gap-3 text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" /> {data.email}
            </span>
            {data.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" /> {data.phone}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge
            variant={data.active ? "default" : "destructive"}
            className="text-sm px-3 py-1"
          >
            {data.active ? "Active Owner" : "Inactive Account"}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <ShieldCheck className="w-3 h-3 text-green-500" /> Verified Partner
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Venues Overview */}
        <Card className="p-5 space-y-4 bg-background/50">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" /> Registered Venues
            </h3>
            {data.venues && (
              <Badge variant="secondary" className="font-mono">
                {data.venues.length} Total
              </Badge>
            )}
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {data.venues && data.venues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.venues.map((venue, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/30 hover:bg-background/80 transition-colors"
                  >
                    <div className="truncate pr-2">
                      <span className="font-medium text-foreground block truncate">
                        {venue.name}
                      </span>
                      <span className="text-xs text-muted-foreground block truncate">
                        {venue.city || venue.address}
                      </span>
                    </div>
                    <Badge
                      variant={
                        venue.status === "Approved"
                          ? "default"
                          : venue.status === "Rejected"
                            ? "destructive"
                            : "secondary"
                      }
                      className="shrink-0"
                    >
                      {venue.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2">
                <Store className="w-8 h-8 opacity-20" />
                <p>No venues registered yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Info */}
        <Card className="p-5 space-y-4 bg-background/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
            <User className="w-4 h-4 text-primary" /> Account Details
          </h3>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                User ID
              </span>
              <span className="font-mono text-xs bg-accent/50 px-2 py-1 rounded select-all">
                {data._id}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Role Type
              </span>
              <Badge variant="outline" className="capitalize">
                {data.role || "Owner"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Audit */}
        <Card className="p-5 space-y-4 bg-background/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
            <Calendar className="w-4 h-4 text-primary" /> Timestamps
          </h3>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Joined Date
              </span>
              <span className="font-medium text-foreground">
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Last Updated
              </span>
              <span className="font-medium text-foreground">
                {data.updatedAt
                  ? new Date(data.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
