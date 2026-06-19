"use client";

import { useState } from "react";
import { MapPin, Search, ChevronDown, Sparkles } from "lucide-react";
import Image from "next/image";
import { DISTRICTS, CATEGORIES } from "@/lib/data";

export function Hero() {
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [districtOpen, setDistrictOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);

    return (
        <section className="relative overflow-hidden bg-primary">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-linear-to-b from-primary/30 via-primary/40 to-primary/80" />
            </div>

            <div className="absolute top-8 right-12 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
            <div className="absolute bottom-12 left-8 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 text-center">
                <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
                    Kerala&apos;s #1 Venue Platform
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                    Find Your Perfect
                    <br />
                    <span className="text-accent">Event Venue</span> in Kerala
                </h1>
                <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-12">
                    From intimate gatherings to grand weddings — discover verified venues across all 14 districts
                    of God&apos;s Own Country.
                </p>

                <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <button
                            className="w-full flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl text-left text-foreground text-sm font-medium hover:bg-muted transition-colors"
                            onClick={() => {
                                setDistrictOpen(!districtOpen);
                                setCatOpen(false);
                            }}
                        >
                            <MapPin className="w-4 h-4 text-accent shrink-0" />
                            <span className="flex-1 truncate">{selectedDistrict || "Select District"}</span>
                            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${districtOpen ? "rotate-180" : ""}`} />
                        </button>
                        {districtOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-30 max-h-52 overflow-y-auto">
                                {DISTRICTS.map((d) => (
                                    <button
                                        key={d}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground"
                                        onClick={() => {
                                            setSelectedDistrict(d);
                                            setDistrictOpen(false);
                                        }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative flex-1">
                        <button
                            className="w-full flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl text-left text-foreground text-sm font-medium hover:bg-muted transition-colors"
                            onClick={() => {
                                setCatOpen(!catOpen);
                                setDistrictOpen(false);
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-accent shrink-0" />
                            <span className="flex-1 truncate">
                                {selectedCategory === "All" ? "Select Category" : selectedCategory}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${catOpen ? "rotate-180" : ""}`} />
                        </button>
                        {catOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-30">
                                {["All", ...CATEGORIES.map((c) => c.label)].map((cat) => (
                                    <button
                                        key={cat}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground"
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setCatOpen(false);
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shrink-0">
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-10 text-primary-foreground/60 text-sm">
                    <span className="flex items-center gap-1.5">
                        <span className="text-accent font-bold text-base">700+</span> Venues
                    </span>
                    <span className="text-primary-foreground/30">·</span>
                    <span className="flex items-center gap-1.5">
                        <span className="text-accent font-bold text-base">14</span> Districts
                    </span>
                    <span className="text-primary-foreground/30">·</span>
                    <span className="flex items-center gap-1.5">
                        <span className="text-accent font-bold text-base">12K+</span> Happy Bookings
                    </span>
                </div>
            </div>
        </section>
    );
}
