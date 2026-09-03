import { IoLocationOutline, IoSearch } from 'react-icons/io5';
import heroImage from '@/assets/hero.png';

interface HeroSectionProps {
  search: string;
  setSearch: (search: string) => void;
  handleSearch: () => void;
}

export function HeroSection({ search, setSearch, handleSearch }: HeroSectionProps) {
  return (
    <div className="relative h-[650px] md:h-[720px] w-full rounded-[2.5rem] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 z-10" />

      <img
        src={heroImage}
        alt="Venue Hero"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out hover:scale-105"
      />

      <div className="relative z-20 px-6 w-full max-w-6xl text-center flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in-up">
          Find the Perfect Venue
          <br />
          for Every Occasion
        </h1>

        <p className="text-gray-200 mt-4 max-w-2xl mx-auto text-sm md:text-lg animate-fade-in-up">
          Curated spaces for corporate events, weddings, and private gatherings.
        </p>

        <div className="w-[92%] md:w-full max-w-4xl mx-auto bg-[var(--bg-tertiary)] rounded-2xl p-2 shadow-xl flex flex-col md:flex-row items-center gap-2 animate-fade-in-up-delay mt-10 md:mt-20">
          <div className="flex items-center gap-3 w-full px-4 py-3">
            <IoLocationOutline className="text-[var(--text-secondary)] text-2xl shrink-0" />

            <input
              type="text"
              placeholder="Search venue, city, or event type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm md:text-lg"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-8 py-4 bg-[var(--bg-green)] text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-base shrink-0"
          >
            <IoSearch className="text-xl" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
