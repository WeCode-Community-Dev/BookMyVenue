// src/components/venues/hero-banner.tsx
import { SearchBar } from "./search-bar";
import { FilterButtons } from "../shared/filter-buttons";

export function Banner() {
  return (
    <section
      className="relative w-full min-h-[80vh] overflow-hidden flex flex-col justify-evenly px-10">
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent z-1" />

      <div className="relative z-10 max-w-3xl text-left">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/60 border border-gray-100 text-black mb-6">
          covered 1000+ bookings
        </span>

        <h1 className="text-5xl md:text-6xl font-fraunces font-medium text-black tracking-tight leading-[1.1] mb-6">
          Find the space where your ideas happen
        </h1>

        <p className="text-lg md:text-xl text-black leading-relaxed mb-10">
          From industrial lofts to rooftop gardens, discover curated venues
          designed for weddings, workshops, and creative productions.
        </p>
      </div>
      <div className="flex flex-col gap-4 items-start z-10">
        <SearchBar />
        <FilterButtons />
      </div>
    </section>
  );
}

