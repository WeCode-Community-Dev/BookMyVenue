"use client";

import { AppText, getText, setLanguage } from "@/lib/language/LanguageHelper";
import {
    Check,
    ChevronDown,
    Headphones,
    Languages,
    LogOut,
    Moon,
    Settings,
    Sun,
    User,
} from "lucide-react";
import { LANGUAGE, SCREENS, SUPPORTED_LANGUAGES, THEME } from "@/lib/Constants";
import { storeTheme, useConfigTheme, useLanguage } from "@/store/AppConfigReducer";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import NxtImage from "next/image";
import { profileDropdownStyle } from "./ProfileDropdownStyle";
import { useAuthService } from "@/features/auth/services/AuthService";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
    isOpen: boolean;
}

export default function ProfileDropdown({ isOpen }: ProfileDropdownProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector(useConfigTheme);
    const currentLanguage = useSelector(useLanguage) || LANGUAGE.ENGLISH;
    const { logout, user } = useAuthService();
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    if (!isOpen) return null;

    const toggleTheme = () => {
        dispatch(storeTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK));
    };

    const handleProfile = () => {
        router.push(SCREENS.PROFILE);
    };

    const handleLanguageSelect = (langCode: string) => {
        setLanguage(langCode);
    };

    const currentLangObj = SUPPORTED_LANGUAGES.find(
        (lang) => lang.code.toLowerCase() === currentLanguage.toLowerCase()
    ) || SUPPORTED_LANGUAGES[0];

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
                {user?.role !== "ADMIN" && (
                    <>
                        <button
                            onClick={handleProfile}
                            className={profileDropdownStyle.menuItem}
                        >
                            <div className={profileDropdownStyle.menuItemLeft}>
                                <User className={profileDropdownStyle.menuItemIcon} />
                                <span>{getText("PROFILE", "MENUS")}</span>
                            </div>
                        </button>

                        <button
                            className={profileDropdownStyle.menuItem}
                        >
                            <div className={profileDropdownStyle.menuItemLeft}>
                                <Settings className={profileDropdownStyle.menuItemIcon} />
                                <span>{getText("SETTINGS", "MENUS")}</span>
                            </div>
                        </button>
                    </>
                )}

                {/* Language Dropdown Row */}
                <div>
                    <button
                        onClick={() => setIsLanguageOpen((prev) => !prev)}
                        className={profileDropdownStyle.menuItem}
                        aria-expanded={isLanguageOpen}
                    >
                        <div className={profileDropdownStyle.menuItemLeft}>
                            <Languages className={profileDropdownStyle.menuItemIcon} />
                            <span>{getText("LANGUAGE", "MENUS")}</span>
                        </div>
                        <div className={profileDropdownStyle.menuItemRight}>
                            <span>{currentLangObj.label}</span>
                            <ChevronDown
                                className={`${profileDropdownStyle.languageChevron} ${
                                    isLanguageOpen ? "rotate-180" : ""
                                }`}
                            />
                        </div>
                    </button>

                    {/* Language Options Submenu */}
                    {isLanguageOpen && (
                        <div className={profileDropdownStyle.languageSubmenu}>
                            {SUPPORTED_LANGUAGES.map((lang) => {
                                const isSelected =
                                    lang.code.toLowerCase() === currentLanguage.toLowerCase();
                                return (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang.code)}
                                        className={`${profileDropdownStyle.languageSubItem} ${
                                            isSelected
                                                ? profileDropdownStyle.languageSubItemActive
                                                : profileDropdownStyle.languageSubItemInactive
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{lang.label}</span>
                                            {lang.nativeLabel !== lang.label && (
                                                <span className="text-xs text-dropdown-icon">
                                                    ({lang.nativeLabel})
                                                </span>
                                            )}
                                        </span>
                                        {isSelected && (
                                            <Check
                                                className={profileDropdownStyle.languageCheckIcon}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={profileDropdownStyle.menuItem}
                >
                    <div className={profileDropdownStyle.menuItemLeft}>
                        {theme === THEME.DARK ? (
                            <Sun className={profileDropdownStyle.menuItemIcon} />
                        ) : (
                            <Moon className={profileDropdownStyle.menuItemIcon} />
                        )}
                        <span>{getText("THEME", "MENUS")}</span>
                    </div>
                </button>
            </div>

            {user?.role !== "ADMIN" && (
                <>
                    <div className={profileDropdownStyle.divider} />

                    {/* Support */}
                    <div className={profileDropdownStyle.supportContainer}>
                        <button className={profileDropdownStyle.menuItem}>
                            <div className={profileDropdownStyle.menuItemLeft}>
                                <Headphones className={profileDropdownStyle.menuItemIcon} />
                                <AppText textName="SUPPORT" textModule="MENUS" />
                            </div>
                        </button>
                    </div>
                </>
            )}

            <div className={profileDropdownStyle.divider} />

            {/* Logout */}
            <div className={profileDropdownStyle.logoutContainer}>
                <button className={profileDropdownStyle.logoutItem} onClick={logout}>
                    <div className={profileDropdownStyle.menuItemLeft}>
                        <LogOut className={profileDropdownStyle.logoutIcon} />
                        <AppText textName="LOGOUT" textModule="MENUS" />
                    </div>
                </button>
            </div>
        </div>
    );
}
