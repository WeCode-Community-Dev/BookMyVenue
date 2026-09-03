import { NavLink, useNavigate } from "react-router";
import {
  CalendarCheck,
  Calendar,
  BarChart2,
  Building2,
  Users,
  Shield,
  UserCog,
  AlertTriangle,
  LogOut,
  Star,
  ActivitySquare,
  Settings,
} from "lucide-react";
import bmvLogo from "@/assets/bmv-logo.png";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { ROLES } from "@/constants/roles";
import { VENUE_STATUS } from "@/constants/venueStatus";
import { PROFILE_STALE_TIME } from "@/constants/queryConfig";
import type { UserProfile } from "@/components/guards/AuthGuard";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/config/axios";
import { queryClient } from "@/config/queryClient";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NavItem = {
  label: string;
  path: string | ((venueId: string | null) => string);
  icon: React.ElementType;
  roles: UserProfile["role"][];
};

interface MyVenue {
  _id: string;
  name: string;
  status: string;
}

interface MyVenuesResponse {
  count: number;
  venues: MyVenue[];
}

const NAV_CONFIG: NavItem[] = [
  // owner
  {
    label: "My Venues",
    path: "/dashboard/select-venue",
    icon: Building2,
    roles: [ROLES.OWNER],
  },
  {
    label: "Bookings",
    path: (venueId) => `/dashboard/venue/${venueId}/bookings`,
    icon: CalendarCheck,
    roles: [ROLES.OWNER],
  },
  {
    label: "Reviews",
    path: (venueId) => `/dashboard/venue/${venueId}/reviews`,
    icon: Star,
    roles: [ROLES.OWNER],
  },
  {
    label: "Calendar",
    path: (venueId) => `/dashboard/venue/${venueId}/calendar`,
    icon: Calendar,
    roles: [ROLES.OWNER],
  },
  {
    label: "Reports",
    path: (venueId) => `/dashboard/venue/${venueId}/reports`,
    icon: BarChart2,
    roles: [ROLES.OWNER],
  },
  {
    label: "Settings",
    path: (venueId) => `/dashboard/venue/${venueId}/settings`,
    icon: Settings,
    roles: [ROLES.OWNER],
  },
  // admin
  {
    label: "Bookings",
    path: "/dashboard/bookings",
    icon: CalendarCheck,
    roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  },
  {
    label: "Venues",
    path: "/dashboard/venues",
    icon: Building2,
    roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  },
  {
    label: "Owners",
    path: "/dashboard/owners",
    icon: Users,
    roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  },
  {
    label: "Moderation",
    path: "/dashboard/moderation",
    icon: AlertTriangle,
    roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  },
  // superAdmin only
  {
    label: "Team",
    path: "/dashboard/team",
    icon: Shield,
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: UserCog,
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    label: "Activity Logs",
    path: "/dashboard/logs",
    icon: ActivitySquare,
    roles: [ROLES.SUPER_ADMIN],
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { activeVenueId, lastVenueSubRoute, setActiveVenue } = useAppStore();

  const { data: profile } = useApiQuery<UserProfile>(
    QUERY_KEYS.PROFILE,
    { method: "GET", url: API_ENDPOINTS.PROFILE },
    { staleTime: PROFILE_STALE_TIME },
  );

  const { data: myVenuesData } = useApiQuery<MyVenuesResponse>(
    QUERY_KEYS.MY_VENUES,
    { method: "GET", url: API_ENDPOINTS.MY_VENUES },
    {
      staleTime: PROFILE_STALE_TIME,
      enabled: profile?.role === ROLES.OWNER,
    },
  );

  const handleSignOut = async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    } catch {
      // ignore logout errors on client
    } finally {
      queryClient.clear();
      navigate("/login");
    }
  };

  const navItems = NAV_CONFIG.filter(
    (item) => profile && item.roles.includes(profile.role),
  );

  const venues = myVenuesData?.venues || [];

  return (
    <div className="flex h-screen w-64 flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] text-[var(--sidebar-text)]">
      {/* Brand */}
      <div className="flex h-20 items-center gap-3 px-6">
        <img
          src={bmvLogo}
          alt="BookMyVenue"
          className="h-8 w-auto bg-white rounded p-1"
        />
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300">
          Admin
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => {
          const isOwner = profile?.role === ROLES.OWNER;
          const isMyVenues = item.label === "My Venues";
          const isDisabled = isOwner && !activeVenueId && !isMyVenues;
          const toPath =
            typeof item.path === "function"
              ? item.path(activeVenueId)
              : item.path;

          return (
            <NavLink
              key={item.label}
              to={isDisabled ? "#" : toPath}
              onClick={() => {
                if (isMyVenues) {
                  setActiveVenue(null, null);
                }
              }}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive && !isDisabled
                    ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-text-active)]"
                    : "hover:bg-zinc-800 hover:text-white",
                  isDisabled &&
                    "opacity-50 cursor-not-allowed pointer-events-none",
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Venue Switcher (Only for owners) */}
      {profile?.role === ROLES.OWNER && (
        <div className="px-4 py-4">
          <Select
            value={activeVenueId || undefined}
            onValueChange={(newId) => {
              const venue = venues.find((v) => v._id === newId);
              if (venue) {
                setActiveVenue(newId, venue.name);
                navigate(`/dashboard/venue/${newId}/${lastVenueSubRoute}`);
              }
            }}
          >
            <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-300">
              <SelectValue placeholder="Select Venue..." />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem
                  key={venue._id}
                  value={venue._id}
                  disabled={
                    venue.status !== VENUE_STATUS.APPROVED &&
                    venue.status !== VENUE_STATUS.INACTIVE
                  }
                >
                  {venue.name}{" "}
                  {venue.status !== VENUE_STATUS.APPROVED
                    ? `(${venue.status})`
                    : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* User Footer */}
      <div className="border-t border-[var(--sidebar-border)] p-4">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white">
            {profile?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="ml-3 flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">
              {profile?.name}
            </p>
            <p className="truncate text-xs text-zinc-400 capitalize">
              {profile?.role}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
