"use client";

import {
    Bell,
    ChevronDown,
    Menu,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppText } from "@/lib/language/LanguageHelper";
import { Button } from "@/components/ui/button/Button";
import NxtImage from "next/image";
import ProfileDropdown from "../dropdown/ProfileDropdown";
import { headerStyle } from "./HeaderStyles";

import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "@/features/auth/AuthSlice";
import { useRouter } from "next/navigation";

export default function Header() {
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const router = useRouter();

    const [
        mobileMenuOpen, setMobileMenuOpen
    ] = useState(false);

    const [
        profileOpen, setProfileOpen
    ] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(evt: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(evt.target as Node)
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [
    ]);

    return (
        <>
            <header className={headerStyle.headerWrapper}>
                <div className={headerStyle.container}>

                    {/* Left */}
                    <div className={headerStyle.leftSection}>
                        <button
                            onClick={() => {
                                return setMobileMenuOpen(true);
                            }}
                            className={headerStyle.menuBtn}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className={headerStyle.divider} />

                        <div className={headerStyle.logoContainer}>
                            <NxtImage
                                src="/assets/logos/logo.png"
                                alt="BookMyVenue Logo"
                                fill
                                priority
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Center Navigation */}

                    <nav className={headerStyle.navBar}>
                        <Button className={headerStyle.navBtnActive}>
                            <AppText textName="EXPLORE" textModule="MENUS" />
                        </Button>
                        <Button className={headerStyle.navBtnActive}>
                            <AppText textName="VENUE_NEAR_ME" textModule="MENUS" />
                        </Button>
                        <Button className={headerStyle.navBtnActive}>
                            <AppText textName="OFFERS" textModule="MENUS" />
                            <span
                                className={headerStyle.offersBadge}
                                style={{ backgroundColor: "#FF6B6B" }}
                            >
                                12
                            </span>
                        </Button>
                    </nav>

                    {/* Right */}
                    <div className={headerStyle.rightSection}>

                        {isAuthenticated ? (
                            <>
                                {/* Notification */}
                                <button className={headerStyle.notificationBtn}>
                                    <Bell className="h-5 w-5 text-slate-700" />

                                    <span
                                        className={headerStyle.notificationBadge}
                                        style={{ backgroundColor: "#FF6B6B" }}
                                    >
                                        3
                                    </span>
                                </button>

                                {/* Profile */}
                                <div
                                    ref={dropdownRef}
                                    className={headerStyle.profileContainer}
                                >
                                    <Button
                                        onClick={() => {
                                            return setProfileOpen((prev) => {
                                                return !prev;
                                            });
                                        }}
                                        className={headerStyle.profileBtn}
                                    >
                                        <NxtImage
                                            height={1}
                                            width={1}
                                            src={user?.avatarUrl || "https://i.pravatar.cc/100?img=12"}
                                            alt="Profile"
                                            className={headerStyle.avatar}
                                        />

                                        <ChevronDown
                                            className={`${headerStyle.chevron} ${profileOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </Button>

                                    <ProfileDropdown isOpen={profileOpen} />
                                </div>
                            </>
                        ) : (
                            <Button
                                onClick={() => {
                                    return router.push("/register"); 
                                }}
                                className={headerStyle.signInBtn}
                            >
                                <AppText textName="SIGN_IN_SIGN_UP" textModule="BUTTON" />
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div
                className={`${headerStyle.mobileDrawerOverlayWrapper} ${mobileMenuOpen
                    ? "visible"
                    : "invisible"
                }`}
            >
                {/* Overlay */}
                <div
                    className={`${headerStyle.mobileDrawerBackdrop} ${mobileMenuOpen
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    onClick={() => {
                        return setMobileMenuOpen(false);
                    }}
                />

                {/* Drawer */}
                <div
                    className={`${headerStyle.mobileDrawerPanel} ${mobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
                >
                    {/* Drawer Header */}
                    <div className={headerStyle.mobileDrawerHeader}>
                        <h2 className={headerStyle.mobileDrawerTitle}>
                            <AppText textName="MENU" textModule="LABEL" />
                        </h2>

                        <button
                            onClick={() => {
                                return setMobileMenuOpen(false);
                            }}
                            className={headerStyle.mobileDrawerCloseBtn}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Menu */}
                    <div className={headerStyle.mobileDrawerMenu}>
                        <Button className={headerStyle.mobileDrawerMenuItem}>
                            <AppText textName="EXPLORE" textModule="MENUS" />
                        </Button>

                        <Button className={headerStyle.mobileDrawerMenuItem}>
                            <AppText textName="VENUE_NEAR_ME" textModule="MENUS" />
                        </Button>

                        <Button className={headerStyle.mobileDrawerMenuItem}>
                            <AppText textName="OFFERS" textModule="MENUS" />
                        </Button>

                        {isAuthenticated && (
                            <>
                                <hr className={headerStyle.mobileDrawerDivider} />

                                <Button className={headerStyle.mobileDrawerMenuItem}>
                                    <AppText textName="MY_BOOKINGS" textModule="MENUS" />
                                </Button>

                                <Button className={headerStyle.mobileDrawerMenuItem}>
                                    <AppText textName="WISHLIST" textModule="MENUS" />
                                </Button>

                                <Button className={headerStyle.mobileDrawerMenuItem}>
                                    <AppText textName="RECENTLY_VIEWED" textModule="MENUS" />
                                </Button>
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                <hr className={headerStyle.mobileDrawerDivider} />
                                <Button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        router.push("/register");
                                    }}
                                    className={headerStyle.mobileDrawerSignInBtn}
                                >
                                    <AppText textName="SIGN_IN_SIGN_UP" textModule="BUTTON" />
                                </Button>
                            </>
                        )}

                        <Button className={headerStyle.mobileDrawerMenuItem}>
                            <AppText textName="SUPPORT" textModule="MENUS" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
