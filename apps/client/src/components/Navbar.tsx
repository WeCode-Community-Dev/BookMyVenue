"use client";

import { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">BookMyVenue</span>
                    </div>

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
                        <a
                            href="#registervenue"
                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm font-medium"
                        >
                            Register Venue
                        </a>
                        <button className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors px-4 py-1.5 rounded-full border border-primary-foreground/30 hover:border-primary-foreground/60">
                            Login
                        </button>
                        <button className="text-sm font-semibold bg-accent text-white px-4 py-1.5 rounded-full hover:bg-accent/90 transition-colors">
                            Sign Up
                        </button>
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
                        <button className="flex-1 text-sm border border-primary-foreground/30 text-primary-foreground rounded-full py-1.5">
                            Login
                        </button>
                        <button className="flex-1 text-sm bg-accent text-white rounded-full py-1.5 font-semibold">
                            Sign Up
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
