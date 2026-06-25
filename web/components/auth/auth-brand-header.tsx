import { CalendarCheck, MapPin, type LucideIcon } from "lucide-react";

const icons = {
  "calendar-check": CalendarCheck,
  "map-pin": MapPin,
} as const;

type AuthBrandHeaderProps = {
  icon?: keyof typeof icons;
  showTagline?: boolean;
};

export function AuthBrandHeader({
  icon = "calendar-check",
  showTagline = true,
}: AuthBrandHeaderProps) {
  const Icon: LucideIcon = icons[icon];

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex size-11 items-center justify-center rounded-lg bg-surface-tint">
        <Icon className="size-6 text-white" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-on-surface">
          BookMyVenue
        </h1>
        {showTagline && (
          <p className="text-sm text-on-surface-variant">Venue Management</p>
        )}
      </div>
    </div>
  );
}
