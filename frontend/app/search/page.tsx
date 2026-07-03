"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/context/AuthContext";
import SearchHeader from "@/components/search/SearchHeader";
import FilterBar from "@/components/search/FilterBar";
import FilterDrawer from "@/components/search/FilterDrawer";
import SortDropdown from "@/components/search/SortDropdown";
import SearchResults from "@/components/search/SearchResults";
import Pagination from "@/components/search/Pagination";
import MapPlaceholder from "@/components/search/MapPlaceholder";
import EmptyState from "@/components/search/EmptyState";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const { venues } = useAuth();
  
  // Resolve initial parameters from query string
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || null;
  const initialCapacity = searchParams.get("capacity") ? parseInt(searchParams.get("capacity")!) : null;
  const initialCity = searchParams.get("city") || "Kochi";

  // Search and Filter State variables
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 300000]);
  const [capacity, setCapacity] = useState<number | null>(initialCapacity);
  const [rating, setRating] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  
  // UI Panels states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Active filters counting (excluding base city)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== null) count++;
    if (priceRange[1] < 300000) count++;
    if (capacity !== null) count++;
    if (rating !== null) count++;
    count += selectedAmenities.length;
    return count;
  }, [selectedCategory, priceRange, capacity, rating, selectedAmenities]);

  // Client Side Mocks Filtering Logic
  const filteredAndSortedVenues = useMemo(() => {
    let list = [...venues];

    // Filter by city first if provided
    if (initialCity && initialCity !== "Anywhere") {
      list = list.filter((v) => v.city.toLowerCase() === initialCity.toLowerCase());
    }

    // Filter by text search query (venue name, area, city, category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          (v.categories && v.categories.some((c) => c.toLowerCase().includes(q))) ||
          (v.area && v.area.toLowerCase().includes(q))
      );
    }

    // Filter by scroll-bar category tags
    if (selectedCategory) {
      const categoryLower = selectedCategory.toLowerCase();
      
      if (categoryLower === "outdoor" || categoryLower === "indoor") {
        // Special tags mapping
        list = list.filter((v) => {
          const amenitiesLower = (v.amenities || []).map((a) => a.toLowerCase());
          if (categoryLower === "outdoor") {
            return !amenitiesLower.includes("air conditioning");
          } else {
            return amenitiesLower.includes("air conditioning");
          }
        });
      } else {
        list = list.filter((v) =>
          v.categories && v.categories.length > 0
            ? v.categories.some((c) => c.toLowerCase() === categoryLower)
            : v.category.toLowerCase() === categoryLower
        );
      }
    }

    // Filter by price range
    list = list.filter(
      (v) => v.startingPrice >= priceRange[0] && v.startingPrice <= priceRange[1]
    );

    // Filter by capacity
    if (capacity !== null) {
      list = list.filter((v) => v.capacity >= capacity);
    }

    // Filter by rating
    if (rating !== null) {
      list = list.filter((v) => v.rating >= rating);
    }

    // Filter by amenities Checklist selection
    if (selectedAmenities.length > 0) {
      list = list.filter((v) =>
        selectedAmenities.every((amenity) => (v.amenities || []).includes(amenity))
      );
    }

    // Sort operations
    if (sortBy === "rating-desc") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === "popular") {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === "newest") {
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [initialCity, searchQuery, selectedCategory, priceRange, capacity, rating, selectedAmenities, sortBy]);

  // Pagination setup (6 elements per page)
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedVenues.length / itemsPerPage));
  
  const paginatedVenues = useMemo(() => {
    // Clamp current page to bounds
    const page = Math.min(currentPage, totalPages);
    const startIdx = (page - 1) * itemsPerPage;
    return filteredAndSortedVenues.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedVenues, currentPage, totalPages]);

  // Reset all filters state
  const handleResetFilters = () => {
    setPriceRange([1000, 300000]);
    setCapacity(null);
    setRating(null);
    setSelectedAmenities([]);
    setSelectedCategory(null);
    setSearchQuery("");
    setSortBy("recommended");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  return (
    <>
      {/* Sticky header navbar */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
          
          {/* Active Info tags & Search parameters */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <SearchHeader
              totalCount={filteredAndSortedVenues.length}
              city={initialCity}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              capacity={capacity}
              setCapacity={setCapacity}
              rating={rating}
              setRating={setRating}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              onClearAll={handleResetFilters}
            />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Quick tags category bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Main 2-Column Desktop layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start pt-2">
            
            {/* Left side column: Listings Grid (60% on desktop) */}
            <div className="lg:col-span-6 space-y-6">
              {paginatedVenues.length > 0 ? (
                <>
                  <SearchResults venues={paginatedVenues} />
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <EmptyState onReset={handleResetFilters} />
              )}
            </div>

            {/* Right side column: Map panel (40% on desktop, hidden on mobile/tablet) */}
            <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 h-[calc(100vh-140px)]">
              <MapPlaceholder />
            </div>

          </div>

        </div>
      </main>

      {/* Advanced filters slide drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        capacity={capacity}
        setCapacity={setCapacity}
        rating={rating}
        setRating={setRating}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center select-none">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Searching venues...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
