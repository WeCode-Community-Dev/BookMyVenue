"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedVenues } from "@/components/FeaturedVenues";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CTABanner } from "@/components/CTABanner";

export default function Home() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="bg-background text-foreground">
            <Hero />
            <Categories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <FeaturedVenues activeCategory={activeCategory} />
            <WhyChooseUs />
            <CTABanner />
        </div>
    );
}
