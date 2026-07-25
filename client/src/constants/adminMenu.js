import {
  LayoutDashboard,
  Users,
  Store,
  Building2,
  CalendarDays,
  CreditCard,
  Tags,
} from "lucide-react";

import { ROUTES } from "./routes";

export const ADMIN_MENU = [
  {
    title: "Dashboard",
    path: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    path: ROUTES.ADMIN.USERS,
    icon: Users,
  },
  {
    title: "Vendor Management",
    path: ROUTES.ADMIN.VENDORS,
    icon: Store,
  },
  {
    title: "Venue Management",
    path: ROUTES.ADMIN.VENUES,
    icon: Building2,
  },
  {
    title: "Booking Management",
    path: ROUTES.ADMIN.BOOKINGS,
    icon: CalendarDays,
  },
  {
    title: "Payment Management",
    path: ROUTES.ADMIN.PAYMENTS,
    icon: CreditCard,
  },
  {
    title: "Category Management",
    path: ROUTES.ADMIN.CATEGORIES,
    icon: Tags,
  },
];