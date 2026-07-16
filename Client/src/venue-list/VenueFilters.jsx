import React from "react";
import { Search, Users, SlidersHorizontal } from "lucide-react";

export function VenueFilters({
  searchQuery,
  setSearchQuery,
  selectedCapacity,
  setSelectedCapacity,
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  categories,
}) {
  return (
    <div className="bg-[#F7F5EE] rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col gap-6 mb-12 transition-all duration-500 animate-fadeInUp ">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="relative md:col-span-6 animate-fade-in-stagger delay-150">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search venue names, locations, types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF9F6] border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-2xl py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 text-sm font-medium transition-all"
          />
        </div>

        <div className="relative md:col-span-3 animate-fade-in-stagger delay-300">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <select
            value={selectedCapacity}
            onChange={(e) => setSelectedCapacity(e.target.value)}
            className="w-full bg-[#FAF9F6] border border-slate-200 focus:border-ticket-orange
             focus:ring-1 focus:ring-ticket-orange rounded-2xl py-4 pl-12 pr-4 text-slate-800 text-sm font-medium
              transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#FAF9F6] text-slate-800">
              Any Capacity
            </option>
            <option value="5000" className="bg-[#FAF9F6] text-slate-800">
              5000+ guests
            </option>
            <option value="4000" className="bg-[#FAF9F6] text-slate-800">
              4000+ guests
            </option>
            <option value="2000" className="bg-[#FAF9F6] text-slate-800">
              2000+ guests
            </option>
            <option value="1000" className="bg-[#FAF9F6] text-slate-800">
              1000+ guests
            </option>
          </select>
        </div>

        <div className="relative md:col-span-3 animate-fade-in-stagger delay-450">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#FAF9F6] border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange rounded-2xl py-4 pl-12 pr-4 text-slate-800 text-sm font-medium transition-all appearance-none cursor-pointer"
          >
            <option value="default" className="bg-[#FAF9F6] text-slate-800">
              Sort by: Default
            </option>
            <option value="price-low" className="bg-[#FAF9F6] text-slate-800">
              Price: Low to High
            </option>
            <option value="price-high" className="bg-[#FAF9F6] text-slate-800">
              Price: High to Low
            </option>
            <option value="rating" className="bg-[#FAF9F6] text-slate-800">
              Rating: High to Low
            </option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 animate-fade-in-stagger delay-600">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 animate-fade-in-up   ${
            selectedCategory === "All"
              ? "bg-ticket-yellow text-slate-950 shadow-sm"
              : "bg-slate-100 text-slate-650 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60"
          }`}
        >
          All
        </button>
        {categories.map((category, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 animate-fade-in-up 
              active:scale-95 ${
                selectedCategory === category
                  ? "bg-ticket-yellow text-slate-950 shadow-sm"
                  : "bg-slate-100 text-slate-650 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VenueFilters;
