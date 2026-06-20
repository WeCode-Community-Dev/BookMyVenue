"use client";

import { useState } from "react";
import {Menu, X } from "lucide-react";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import ProfileButton from "./ProfileButton";

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.svg" alt="BookMyVenue" width={40} height={40} />
                        <span className="text-xl font-bold tracking-tight">BookMyVenue</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#venues"
                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                        >
                            Explore Venues
                        </a>
                        <a
                            href="#categories"
                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                        >
                            Categories
                        </a>
                        <a
                            href="#about"
                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                        >
                            About
                        </a>
                        <a
                            href="#contact"
                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                        >
                            Contact
                        </a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {/* <a
                            href="#registervenue"
                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                        >
                            Register Venue
                        </a> */}

                        <Show when="signed-out">
                            <SignInButton>
                                <button className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors px-4 py-1.5 rounded-full border border-primary-foreground/30 hover:border-primary-foreground/60">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton>
                                <button className="text-sm font-semibold bg-accent text-white px-4 py-1.5 rounded-full hover:bg-accent/90 transition-colors cursor-pointer">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </Show>
                        <Show when="signed-in">
                            <ProfileButton />
                        </Show>
                    </div>

                    <button
                        className="md:hidden text-primary-foreground"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-primary border-t border-primary-foreground/10 px-4 py-4 flex flex-col gap-3">
                    <a href="#venues" className="text-primary-foreground/80 text-sm py-1">
                        Explore Venues
                    </a>
                    <a href="#categories" className="text-primary-foreground/80 text-sm py-1">
                        Categories
                    </a>
                    <a href="#about" className="text-primary-foreground/80 text-sm py-1">
                        About
                    </a>
                    <a href="#contact" className="text-primary-foreground/80 text-sm py-1">
                        Contact
                    </a>
                    <div className="flex gap-2 pt-2">
                        <SignInButton>
                            <button className="flex-1 text-sm border border-primary-foreground/30 text-primary-foreground rounded-full py-1.5">
                                Login
                            </button>
                        </SignInButton>
                        <SignUpButton>
                            <button className="flex-1 text-sm bg-accent text-white rounded-full py-1.5 font-semibold">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </div>
                </div>
            )}
        </nav>
    );
}
