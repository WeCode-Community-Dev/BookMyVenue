import {
  Accessibility,
  ArrowUpDown,
  Car,
  ConciergeBell,
  Shield,
  UtensilsCrossed,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import type { VenueAmenityIcon } from "@/lib/data/list-venue";

export const venueAmenityIcons: Record<VenueAmenityIcon, LucideIcon> = {
  wifi: Wifi,
  car: Car,
  shield: Shield,
  "concierge-bell": ConciergeBell,
  "arrow-up-down": ArrowUpDown,
  "utensils-crossed": UtensilsCrossed,
  accessibility: Accessibility,
};
