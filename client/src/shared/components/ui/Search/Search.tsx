import { useState } from "react";
import { Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SearchInput from "./SearchInput";
import SearchButton from "./SearchButton";
import type { SearchProps } from "./types";
import SearchSuggestions from "./SearchSuggestions";

const Search = ({
  value,
  onChange,
  placeholder,
  onSearch,
  showButton = true,
  buttonLabel = 'Search',
  icon,
  suggestions,
  onSuggestionSelect,
  onLocationChange
}: SearchProps) => {
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleGpsToggle = () => {
    if (gpsActive) {
      setGpsActive(false);
      onLocationChange?.(null, null);
      toast.success("GPS Mode Disabled");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);
    const getPosition = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLoading(false);
          setGpsActive(true);
          const { latitude, longitude } = position.coords;
          onLocationChange?.(latitude, longitude);
          toast.success("GPS Mode Enabled: Location loaded successfully!");
        },
        (error) => {
          if (highAccuracy && error.code === error.TIMEOUT) {
            console.warn("High accuracy GPS request timed out. Retrying with low accuracy...");
            getPosition(false);
            return;
          }
          setGpsLoading(false);
          let message = "Failed to retrieve your location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Location permission denied. Please enable location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "The request to get your location timed out.";
              break;
          }
          toast.error(message);
          onLocationChange?.(null, null);
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 10000,
          maximumAge: highAccuracy ? 0 : 60000,
        }
      );
    };

    getPosition(true);
  };

  return (
    <div className="relative max-w-3xl">

      <div className="
    mt-10
    bg-zinc-900/80
    backdrop-blur-md
    border
    border-zinc-800/60
    rounded-2xl
    p-3
    flex
    flex-col
    md:flex-row
    gap-3
    shadow-xl
 ">

        <SearchInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          icon={icon}
        />

        <button
          type="button"
          onClick={handleGpsToggle}
          disabled={gpsLoading}
          className={`p-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${gpsActive
              ? 'bg-[#e21a47]/10 border-[#e21a47]/40 text-[#e21a47] shadow-lg shadow-[#e21a47]/5'
              : 'bg-zinc-950/40 border-zinc-800/40 text-zinc-400 hover:text-white hover:border-zinc-700/60'
            }`}
          title={gpsActive ? "Disable GPS Mode" : "Enable GPS Mode"}
        >
          {gpsLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Navigation className={`w-4 h-4 ${gpsActive ? 'fill-[#e21a47]' : ''}`} />
          )}
          <span className="text-xs font-semibold hidden md:inline">
            {gpsActive ? 'GPS Active' : 'Use GPS'}
          </span>
        </button>

        {
          showButton &&
          <SearchButton
            label={buttonLabel}
            onClick={() => onSearch?.()}
          />
        }

      </div>


      {
        suggestions &&
        suggestions.length > 0 &&
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={(item) => onSuggestionSelect?.(item)}
        />
      }

    </div>
  )
}

export default Search;