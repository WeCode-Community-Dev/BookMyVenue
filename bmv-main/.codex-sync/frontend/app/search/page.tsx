"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SearchHeader from "@/components/search/SearchHeader";
import FilterBar from "@/components/search/FilterBar";
import FilterDrawer from "@/components/search/FilterDrawer";
import SortDropdown from "@/components/search/SortDropdown";
import SearchResults from "@/components/search/SearchResults";
import Pagination from "@/components/search/Pagination";
import EmptyState from "@/components/search/EmptyState";
import { Venue } from "@/types";
import * as searchService from "@/services/search.service";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || null;
  const initialCapacity = searchParams.get("capacity") ? parseInt(searchParams.get("capacity")!, 10) : null;
  const initialCity = searchParams.get("city") || "Kochi";

  const [searchQuery, setSearchQueryState] = useState(initialQuery);
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [capacity, setCapacityState] = useState<number | null>(initialCapacity);
  const [rating, setRating] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== null) count++;
    if (priceRange[0] > 0 || priceRange[1] < 300000) count++;
    if (capacity !== null) count++;
    if (rating !== null) count++;
    count += selectedAmenities.length;
    return count;
  }, [selectedCategory, priceRange, capacity, rating, selectedAmenities]);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");

      try {
        if (searchQuery.trim()) {
          let filtered = await searchService.searchNavbar(searchQuery.trim());
          if (initialCity && initialCity !== "Anywhere") {
            filtered = filtered.filter((venue) => venue.city.toLowerCase() === initialCity.toLowerCase());
          }
          if (selectedCategory) {
            filtered = filtered.filter((venue) =>
              (venue.categories || []).some((category) => category.toLowerCase() === selectedCategory.toLowerCase()),
            );
          }
          if (capacity !== null) {
            filtered = filtered.filter((venue) => venue.capacity >= capacity);
          }
          filtered = filtered.filter((venue) => venue.startingPrice >= priceRange[0] && venue.startingPrice <= priceRange[1]);
          if (selectedAmenities.length > 0) {
            filtered = filtered.filter((venue) =>
              selectedAmenities.every((amenity) => (venue.amenities || []).includes(amenity)),
            );
          }

          if (!isCancelled) {
            setVenues(filtered);
            setTotalPages(1);
          }
        } else {
          const response = await searchService.searchVenues({
            city: initialCity !== "Anywhere" ? initialCity : undefined,
            category: selectedCategory,
            capacity,
            skip: (currentPage - 1) * 6,
            take: 6,
          });

          let filtered = response.data.filter((venue) => venue.startingPrice >= priceRange[0] && venue.startingPrice <= priceRange[1]);
          if (selectedAmenities.length > 0) {
            filtered = filtered.filter((venue) =>
              selectedAmenities.every((amenity) => (venue.amenities || []).includes(amenity)),
            );
          }

          if (!isCancelled) {
            setVenues(filtered);
            setTotalPages(Math.max(1, Math.ceil(response.pagination.total / 6)));
          }
        }
      } catch (loadError: unknown) {
        if (!isCancelled) {
          const message = loadError instanceof Error ? loadError.message : "Failed to load venues from the backend."; setError(message);
          setVenues([]);
          setTotalPages(1);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isCancelled = true;
    };
  }, [searchQuery, selectedCategory, capacity, currentPage, initialCity, priceRange, selectedAmenities]);

  const filteredAndSortedVenues = useMemo(() => {
    const list = [...venues];
    const ratedList = rating !== null ? list.filter((venue) => venue.rating >= rating) : list;

    if (sortBy === "price-asc") {
      ratedList.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price-desc") {
      ratedList.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === "newest") {
      ratedList.sort((a, b) => b.id.localeCompare(a.id));
    }

    return ratedList;
  }, [venues, rating, sortBy]);

  const handleResetFilters = () => {
    setPriceRange([0, 300000]);
    setCapacityState(null);
    setRating(null);
    setSelectedAmenities([]);
    setSelectedCategoryState(null);
    setSearchQueryState("");
    setSortBy("recommended");
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={(value) => { setCurrentPage(1); setSearchQueryState(value); }} />
      <main className="flex-grow bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <SearchHeader
              totalCount={filteredAndSortedVenues.length}
              city={initialCity}
              selectedCategory={selectedCategory}
              setSelectedCategory={(value) => { setCurrentPage(1); setSelectedCategoryState(value); }}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              capacity={capacity}
              setCapacity={(value) => { setCurrentPage(1); setCapacityState(value); }}
              rating={rating}
              setRating={setRating}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              onClearAll={handleResetFilters}
            />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategoryState(category);
              setCurrentPage(1);
            }}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            activeFiltersCount={activeFiltersCount}
          />

          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm font-semibold text-rose-700">{error}</div>
            ) : isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-500">
                Loading venues from the backend...
              </div>
            ) : filteredAndSortedVenues.length > 0 ? (
              <>
                <SearchResults venues={filteredAndSortedVenues} />
                {totalPages > 1 && !searchQuery.trim() && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
              </>
            ) : (
              <EmptyState onReset={handleResetFilters} />
            )}
          </div>
        </div>
      </main>

      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        capacity={capacity}
        setCapacity={(value) => { setCurrentPage(1); setCapacityState(value); }}
        rating={rating}
        setRating={setRating}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        onApply={() => setCurrentPage(1)}
        onReset={handleResetFilters}
      />

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center select-none">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Searching venues...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}





