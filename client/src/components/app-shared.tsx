import type { ReactNode } from "react";
import { LayoutGridIcon, FileTextIcon } from "lucide-react";

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

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Manage",
		items: [
			{
				title: "Dashboard",
				path: "/owner-dashboard",
				icon: <LayoutGridIcon />,
			},
			{
				title: "Create venue",
				path: "/create-venue",
				icon: <FileTextIcon />,
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];
