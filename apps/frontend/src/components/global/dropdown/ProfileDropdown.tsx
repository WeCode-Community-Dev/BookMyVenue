"use client";

import { AppText, getText, setLanguage } from "@/lib/language/LanguageHelper";
import {
    Headphones,
    Languages,
    LogOut,
    Moon,
    Settings,
    Sun,
    User,
} from "lucide-react";
import { LANGUAGE, SCREENS, THEME } from "@/lib/Constants";
import { storeTheme, useConfigTheme, useLanguage } from "@/store/AppConfigReducer";
import { useDispatch, useSelector } from "react-redux";
import { useAuthService } from "@/features/auth/services/AuthService";

import NxtImage from "next/image";
import { profileDropdownStyle } from "./ProfileDropdownStyle";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
    isOpen: boolean;
}

export default function ProfileDropdown({ isOpen }: ProfileDropdownProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector(useConfigTheme);
    const currentLanguage = useSelector(useLanguage);
    const { logout, user } = useAuthService();

    if (!isOpen) return null;

    const toggleTheme = () => {
        dispatch(storeTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK));
    };

    const handleProfile = () => {
        router.push(SCREENS.PROFILE);
    };

    const changeLanguage = () => {
        const nextLanguage = currentLanguage === LANGUAGE.HINDI ? LANGUAGE.ENGLISH : LANGUAGE.HINDI;
        setLanguage(nextLanguage);
    };

    const menuItems = [
        {
            icon: User,
            label: getText("PROFILE", "MENUS"),
            onClick: handleProfile
        },
        {
            icon: Settings,
            label: getText("SETTINGS", "MENUS"),
        },
        {
            icon: Languages,
            label: getText("LANGUAGE", "MENUS"),
            onClick: changeLanguage
        },
        {
            icon: theme === THEME.DARK ? Sun : Moon,
            label: getText("THEME", "MENUS"),
            onClick: toggleTheme,
        },
    ];

    return (
        <div className={profileDropdownStyle.wrapper}>
            {/* User Info */}
            <div className={profileDropdownStyle.userInfo}>
                <div className={profileDropdownStyle.userInfoContainer}>
                    <NxtImage
                        height={1}
                        width={1}
                        src={user?.avatarUrl || "https://i.pravatar.cc/100?img=12"}
                        alt="Profile"
                        className={profileDropdownStyle.avatar}
                    />

                    <div>
                        <h3 className={profileDropdownStyle.userName}>
                            {user?.name || user?.email?.split("@")[ 0 ] || "User"}
                        </h3>

                        <p className={profileDropdownStyle.userRole}>
                            {user?.role === "VENUE_OWNER" ? "Venue Owner" : user?.role === "ADMIN" ? "Admin" : "User"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Menu */}
            <div className={profileDropdownStyle.menuContainer}>
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className={profileDropdownStyle.menuItem}
                        >
                            <Icon className={profileDropdownStyle.menuItemIcon} />

                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div className={profileDropdownStyle.divider} />

            {/* Support */}
            <div className={profileDropdownStyle.supportContainer}>
                <button className={profileDropdownStyle.menuItem}>
                    <Headphones className={profileDropdownStyle.menuItemIcon} />
                    <AppText textName="SUPPORT" textModule="MENUS" />
                </button>
            </div>

            <div className={profileDropdownStyle.divider} />

            {/* Logout */}
            <div className={profileDropdownStyle.logoutContainer}>
                <button className={profileDropdownStyle.logoutItem} onClick={logout}>
                    <LogOut className={profileDropdownStyle.logoutIcon} />
                    <AppText textName="LOGOUT" textModule="MENUS" />
                </button>
            </div>
        </div>
    );
}
