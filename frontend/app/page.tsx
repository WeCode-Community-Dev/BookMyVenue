"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryList } from "@/components/home/category-list";
import { VenueSection } from "@/components/home/venue-section";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { venues } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter venues based on category AND search input keywords
  const filteredVenues = venues.filter((venue) => {
    const matchesCategory = selectedCategory
      ? (venue.categories && venue.categories.length > 0
          ? venue.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())
          : venue.category.toLowerCase() === selectedCategory.toLowerCase())
      : true;
    const matchesQuery = searchQuery
      ? venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (venue.categories && venue.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())))
      : true;
    return matchesCategory && matchesQuery;
  });

  // Filter venues for "Popular Near You" (rating >= 4.7)
  const popularVenues = filteredVenues.filter((venue) => venue.rating >= 4.7).slice(0, 8);

  // Callbacks for tag clicks (popular search tags in hero)
  const handleSearchTagSelect = (tag: string) => {
    if (tag.toLowerCase().includes("wedding")) {
      setSelectedCategory("Wedding");
    } else if (tag.toLowerCase().includes("birthday")) {
      setSelectedCategory("Birthday");
    } else if (tag.toLowerCase().includes("conference")) {
      setSelectedCategory("Conference");
    } else if (tag.toLowerCase().includes("resort")) {
      setSelectedCategory("Resort");
    } else if (tag.toLowerCase().includes("meetup")) {
      setSelectedCategory("Party"); // Map meetups to Party category
    }
  };

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-grow">
        <HeroSection onSearchTag={handleSearchTagSelect} />
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        {/* Venue Sections */}
        <div className="py-6 space-y-4">
          <VenueSection
            title="Popular Near You"
            description="Highly rated venues matching your filter criteria"
            venues={popularVenues}
          />
        </div>

        <Features />
      </main>
      <Footer />
    </>
  );
}
