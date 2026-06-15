"use client";

import {
    Headphones,
    Languages,
    LogOut,
    Moon,
    Settings,
    Sun,
    User,
} from "lucide-react";
import { storeTheme, useConfigTheme } from "@/store/AppConfigReducer";
import { useDispatch, useSelector } from "react-redux";

import NxtImage from "next/image";
import { THEME } from "@/lib/Constants";
import { profileDropdownStyle } from "./ProfileDropdownStyle";

interface ProfileDropdownProps {
    isOpen: boolean;
}

export default function ProfileDropdown({ isOpen }: ProfileDropdownProps) {
    const theme = useSelector(useConfigTheme);
    const dispatch = useDispatch();

    const toggleTheme = () => {
        dispatch(storeTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK));
    };

    if (!isOpen) return null;

    const menuItems = [
        {
            icon: User,
            label: "Profile",
        },
        {
            icon: Settings,
            label: "Settings",
        },
        {
            icon: Languages,
            label: "Language",
        },
        {
            icon: theme === THEME.DARK ? Sun : Moon,
            label: "Theme",
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
                        src="https://i.pravatar.cc/100?img=12"
                        alt="Profile"
                        className={profileDropdownStyle.avatar}
                    />

                    <div>
                        <h3 className={profileDropdownStyle.userName}>
                            Vishnu Raj
                        </h3>

                        <p className={profileDropdownStyle.userRole}>
                            Venue Owner
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
                    Support
                </button>
            </div>

            <div className={profileDropdownStyle.divider} />

            {/* Logout */}
            <div className={profileDropdownStyle.logoutContainer}>
                <button className={profileDropdownStyle.logoutItem}>
                    <LogOut className={profileDropdownStyle.logoutIcon} />
                    Logout
                </button>
            </div>
        </div>
    );
}
