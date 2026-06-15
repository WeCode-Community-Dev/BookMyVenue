"use client";

import {
    Bell,
    ChevronDown,
    Menu,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import NxtImage from "next/image";
import ProfileDropdown from "../dropdown/ProfileDropdown";
import { headerStyle } from "./HeaderStyles";

export default function Header() {
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
                        <button className={headerStyle.navBtnActive}>
                            Explore

                            <span className={headerStyle.activeIndicator} />
                        </button>

                        <button className={headerStyle.navBtn}>
                            Venues Near Me
                        </button>

                        <button className={headerStyle.navBtnRelative}>
                            Offers

                            <span
                                className={headerStyle.offersBadge}
                                style={{ backgroundColor: "#FF6B6B" }}
                            >
                                12
                            </span>
                        </button>
                    </nav>

                    {/* Right */}
                    <div className={headerStyle.rightSection}>

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
                            <button
                                onClick={() => {
                                    return setProfileOpen((prev) => {
                                        return !prev;
                                    });
                                }
                                }
                                className={headerStyle.profileBtn}
                            >
                                <NxtImage
                                    height={1}
                                    width={1}
                                    src="https://i.pravatar.cc/100?img=12"
                                    alt="Profile"
                                    className={headerStyle.avatar}
                                />

                                <ChevronDown
                                    className={`${headerStyle.chevron} ${profileOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <ProfileDropdown isOpen={profileOpen} />
                        </div>
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
                    }
                    }
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
                            Menu
                        </h2>

                        <button
                            onClick={() => {
                                return setMobileMenuOpen(false);
                            }
                            }
                            className={headerStyle.mobileDrawerCloseBtn}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Menu */}
                    <div className={headerStyle.mobileDrawerMenu}>
                        <button className={headerStyle.mobileDrawerMenuItem}>
                            Explore
                        </button>

                        <button className={headerStyle.mobileDrawerMenuItem}>
                            Venues Near Me
                        </button>

                        <button className={headerStyle.mobileDrawerMenuItem}>
                            Offers
                        </button>

                        <hr className={headerStyle.mobileDrawerDivider} />

                        <button className={headerStyle.mobileDrawerMenuItem}>
                            My Bookings
                        </button>

                        <button className={headerStyle.mobileDrawerMenuItem}>
                            Wishlist
                        </button>

                        <button className={headerStyle.mobileDrawerMenuItem}>
                            Recently Viewed
                        </button>

                        <button className={headerStyle.mobileDrawerMenuItem}>
                            Support
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
