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

  const approvedVenues = venues.filter((venue) => venue.status === "APPROVED" || venue.verified);

  const filteredVenues = approvedVenues.filter((venue) => {
    const matchesCategory = selectedCategory
      ? (venue.categories && venue.categories.length > 0
          ? venue.categories.some((category) => category.toLowerCase() === selectedCategory.toLowerCase())
          : venue.category.toLowerCase() === selectedCategory.toLowerCase())
      : true;
    const matchesQuery = searchQuery
      ? venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (venue.categories && venue.categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase())))
      : true;
    return matchesCategory && matchesQuery;
  });

  const featuredVenues = filteredVenues.slice(0, 8);

  const handleSearchTagSelect = (tag: string) => {
    if (tag.toLowerCase().includes("wedding")) setSelectedCategory("Wedding");
    else if (tag.toLowerCase().includes("birthday")) setSelectedCategory("Birthday");
    else if (tag.toLowerCase().includes("conference")) setSelectedCategory("Conference");
    else if (tag.toLowerCase().includes("resort")) setSelectedCategory("Resort");
    else if (tag.toLowerCase().includes("meetup")) setSelectedCategory("Meeting");
  };

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-grow">
        <HeroSection onSearchTag={handleSearchTagSelect} />
        <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <div className="py-6 space-y-4">
          <VenueSection
            title="Available Right Now"
            description="Approved venues currently coming from the backend APIs"
            venues={featuredVenues}
          />
        </div>
        <Features />
      </main>
      <Footer />
    </>
  );
}

