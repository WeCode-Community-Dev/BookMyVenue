"use client";

import { useState } from "react";
import { MapPin, Search, Sparkles } from "lucide-react";
import { DISTRICTS, VENUE_CATEGORIES } from "@bookmyvenue/types";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Hero() {
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const params = new URLSearchParams();

    if (selectedDistrict) {
        params.set("district", selectedDistrict);
    }

    if (selectedCategory !== "All") {
        params.set("category", selectedCategory);
    }

    const searchUrl = `/venues?${params.toString()}`;

    return (
        <section className="relative overflow-hidden bg-primary">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-linear-to-b from-primary/30 via-primary/40 to-primary/80" />
            </div>

            <div className="absolute top-8 right-12 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
            <div className="absolute bottom-12 left-8 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-36">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
                    Kerala&apos;s #1 Venue Platform
                </p>

                <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                    Find Your Perfect
                    <br />
                    <span className="text-accent">Event Venue</span> in Kerala
                </h1>

                <p className="mx-auto mb-12 max-w-2xl text-lg text-primary-foreground/70">
                    From intimate gatherings to grand weddings — discover verified venues across all 14
                    districts of God&apos;s Own Country.
                </p>

                <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur sm:flex-row">
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                        <SelectTrigger className="flex-1 border-0 bg-secondary px-4 py-6 shadow-none">
                            <div className="flex min-w-0 items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0 text-accent" />
                                <SelectValue placeholder="Select District" />
                            </div>
                        </SelectTrigger>

                        <SelectContent position="popper">
                            {DISTRICTS.map((district) => (
                                <SelectItem key={district} value={district}>
                                    {district}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="flex-1 border-0 bg-secondary px-4 py-6 shadow-none">
                            <div className="flex min-w-0 items-center gap-2">
                                <Sparkles className="h-4 w-4 shrink-0 text-accent" />

                                <SelectValue placeholder="Select Category" />
                            </div>
                        </SelectTrigger>

                        <SelectContent position="popper">
                            <SelectItem value="All">All Categories</SelectItem>

                            {VENUE_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Link
                        href={searchUrl}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <Search className="h-4 w-4" />
                        Search
                    </Link>
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/60">
                    <span className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-accent">700+</span>
                        Venues
                    </span>

                    <span className="text-primary-foreground/30">·</span>

                    <span className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-accent">14</span>
                        Districts
                    </span>

                    <span className="text-primary-foreground/30">·</span>

                    <span className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-accent">12K+</span>
                        Happy Bookings
                    </span>
                </div>
            </div>
        </section>
    );
}
