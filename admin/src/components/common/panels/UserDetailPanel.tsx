import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mail, User, Shield, CalendarDays, Phone } from "lucide-react";

interface UserData {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  status: string;
  role?: string;
  createdAt: string;
}

export function UserDetailPanel({
  data: rawData,
}: {
  data: Record<string, unknown>;
}) {
  const data = rawData as unknown as UserData;
  if (!data) return null;

  const statusVariant =
    data.status === "active"
      ? "default"
      : data.status === "suspended"
        ? "destructive"
        : "outline";

  return (
    <div className="space-y-6 text-sm">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl bg-background/50 border border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {data.username}
          </h2>
          <div className="text-muted-foreground mt-1 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {data.email}
          </div>
        </div>
        <Badge
          variant={statusVariant}
          className="border-none px-3 py-1 text-sm font-medium"
        >
          {data.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Info */}
        <Card className="p-5 space-y-4 bg-background/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
            <Shield className="w-4 h-4 text-primary" /> Account Details
          </h3>
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                User ID
              </span>
              <span className="font-mono bg-accent/50 px-2 py-1 rounded text-foreground break-all">
                {data._id}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Username
              </span>
              <span className="font-medium text-foreground">
                {data.username}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Role
              </span>
              <Badge variant="outline" className="text-xs">
                {data.role || "user"}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Status
              </span>
              <Badge variant={statusVariant}>{data.status}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Registered
              </span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Phone
              </span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                {data.phone || "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-5 space-y-4 bg-background/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
            <Mail className="w-4 h-4 text-primary" /> Contact Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Email
              </span>
              <span className="text-foreground break-all">{data.email}</span>
            </div>
            {data.phone && (
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                  Phone
                </span>
                <span className="text-foreground">{data.phone}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
