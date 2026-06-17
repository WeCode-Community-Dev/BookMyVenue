"use client";

import { AppText, getText } from "@/lib/language/LanguageHelper";
import {
    Building2,
    CalendarDays,
    ChevronLeft,
    CircleHelp,
    CirclePlus,
    Heart,
    LayoutDashboard,
    Settings,
    User,
} from "lucide-react";

import { Button } from "../../ui/button/Button";
import NxtImage from "next/image";
import { SCREENS } from "@/lib/Constants";
import { cn } from "@/lib/Utils";
import { sideBarStyle } from "./SideBarStyle";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();

    const naviagateToScreen = (path: string) => {
        router.push(path);
    };

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: getText("DASHBOARD", "MENUS"),
            active: false,
            path: ""
        },
        {
            icon: CirclePlus,
            label: getText("ADD_VENUE", "MENUS"),
            active: false,
            path: SCREENS.ADD_VENUE
        },
        {
            icon: Building2,
            label: getText("MY_VENUE", "MENUS"),
            active: false,
            path: ""
        },
        {
            icon: CalendarDays,
            label: getText("BOOKINGS", "MENUS"),
            active: false,
            path: ""
        },
        {
            icon: Heart,
            label: getText("WISHLIST", "MENUS"),
            active: false,
            path: ""
        },
        {
            icon: User,
            label: getText("PROFILE", "MENUS"),
            active: false,
            path: SCREENS.PROFILE
        },
        {
            icon: Settings,
            label: getText("SETTINGS", "MENUS"),
            active: false,
            path: SCREENS.SETTINGS
        },
        {
            icon: CircleHelp,
            label: getText("HELP_SUPPORT", "MENUS"),
            active: false,
            path: ""
        },
    ];
    return (
        <aside className={sideBarStyle.aside}>
            {/* Scrollable Content */}
            <div className={sideBarStyle.scrollableContent}>
                <nav className={sideBarStyle.nav}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Button
                                key={item.label}
                                onClick={() => {
                                    naviagateToScreen(item.path);
                                }}
                                className={cn(
                                    sideBarStyle.menuItemButton,
                                    item.active ? sideBarStyle.menuItemActive : sideBarStyle.menuItemInactive
                                )}
                            >
                                <Icon className={sideBarStyle.menuItemIcon} />

                                <span className={sideBarStyle.menuItemLabel}>
                                    {item.label}
                                </span>
                            </Button>
                        );
                    })}
                </nav>

                {/* CTA Card */}
                <div className={sideBarStyle.ctaCard}>
                    <div className={sideBarStyle.ctaImageWrapper}>
                        <NxtImage
                            width={1}
                            height={1}
                            src="/assets/images/building.png"
                            alt="List Venue"
                            className={sideBarStyle.ctaImage}
                        />
                    </div>

                    <div className={sideBarStyle.ctaContent}>
                        <h3 className={sideBarStyle.ctaTitle}>
                            List your venue
                            <br />
                            with us
                        </h3>

                        <p className={sideBarStyle.ctaDescription}>
                            <AppText textName="REACH_CUSTOMERS" textModule="LABEL" />
                        </p>
                    </div>

                    <div className={sideBarStyle.ctaButtonWrapper}>
                        <Button className={sideBarStyle.ctaButton}>
                            <AppText textName="GET_STARTED" textModule="BUTTON" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Fixed Footer */}
            <div className={sideBarStyle.footer}>
                <Button className={sideBarStyle.footerButton}>
                    <ChevronLeft className={sideBarStyle.footerButtonIcon} />
                    <AppText textName="COLLAPSE_SIDEBAR" textModule="BUTTON" />
                </Button>
            </div>
        </aside>
    );
}
