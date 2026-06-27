"use client";

import { LogoIcon } from "@/components/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/nav-group";
import { navGroups } from "@/components/app-shared";
import { Link, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { OWNER_ROUTES, PUBLIC_ROUTES } from "@/routes/common/route-path";
import { useLogout } from "@/hooks/use-auth";

export function AppSidebar() {
	const navigate = useNavigate();
	const logout = useLogout();

	const handleLogout = () => {
		logout.mutate(undefined, {
			onSuccess: () => navigate(PUBLIC_ROUTES.HOME),
		});
	};

	return (
		<Sidebar collapsible="icon" variant="floating">
			<SidebarHeader className="h-14 justify-center">
				<SidebarMenuButton asChild>
					<Link to={OWNER_ROUTES.DASHBOARD}>
						<LogoIcon />
						<span className="font-medium">BookMyVenue</span>
					</Link>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				{navGroups.map((group, index) => (
					<NavGroup key={`sidebar-group-${index}`} {...group} />
				))}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="text-muted-foreground"
							tooltip="Logout"
							onClick={handleLogout}
							disabled={logout.isPending}
						>
							<LogOutIcon />
							<span>{logout.isPending ? "Logging out..." : "Logout"}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
