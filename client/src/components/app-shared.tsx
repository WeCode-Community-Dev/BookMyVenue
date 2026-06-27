import type { ReactNode } from "react";
import {
	LayoutGridIcon,
	FileTextIcon,
	CalendarCheckIcon,
	ShieldCheckIcon,
	UsersIcon,
	TrendingUpIcon,
} from "lucide-react";
import type { UserRole } from "@/types/auth.types";
import { ADMIN_ROUTES, OWNER_ROUTES } from "@/routes/common/route-path";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label: string;
	items: SidebarNavItem[];
};

export const ownerNavGroups: SidebarNavGroup[] = [
	{
		label: "Manage",
		items: [
			{
				title: "Dashboard",
				path: OWNER_ROUTES.DASHBOARD,
				icon: <LayoutGridIcon />,
			},
			{
				title: "Create venue",
				path: OWNER_ROUTES.CREATE_VENUE,
				icon: <FileTextIcon />,
			},
			{
				title: "Bookings",
				path: OWNER_ROUTES.BOOKINGS,
				icon: <CalendarCheckIcon />,
			},
		],
	},
];

export const adminNavGroups: SidebarNavGroup[] = [
	{
		label: "Administration",
		items: [
			{
				title: "Dashboard",
				path: ADMIN_ROUTES.DASHBOARD,
				icon: <LayoutGridIcon />,
			},
			{
				title: "Venues",
				path: ADMIN_ROUTES.VENUES,
				icon: <ShieldCheckIcon />,
			},
			{
				title: "Users",
				path: ADMIN_ROUTES.USERS,
				icon: <UsersIcon />,
			},
			{
				title: "Revenue",
				path: ADMIN_ROUTES.REVENUE,
				icon: <TrendingUpIcon />,
			},
		],
	},
];

export const getNavGroups = (role?: UserRole): SidebarNavGroup[] =>
	role === "ADMIN" ? adminNavGroups : ownerNavGroups;

export const navGroups = ownerNavGroups;

export const footerNavLinks: SidebarNavItem[] = [];

export const navLinks: SidebarNavItem[] = [
	...ownerNavGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...adminNavGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];
