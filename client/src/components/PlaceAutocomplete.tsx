import { useState, useRef, useEffect } from 'react';
import { useFormikContext } from 'formik';
import type { GeoSearchResult } from '@/types/geo.types';
import { axiosInstance } from '@/config/axios';

interface PlaceAutocompleteProps {
  fieldName?: string;
  placeholder?: string;
  onPlaceSelected?: (place: GeoSearchResult) => void;
}

export function PlaceAutocomplete({
  fieldName = 'city',
  placeholder = 'Search city or place...',
  onPlaceSelected,
}: PlaceAutocompleteProps) {
  const { setFieldValue, values } = useFormikContext<Record<string, unknown>>();
  const [input, setInput] = useState<string>(String(values[fieldName] ?? ''));
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let searchQuery = query;
      const currentDistrict = values.district as string | undefined;

      // If a district is selected, refine the search context
      if (currentDistrict && !query.toLowerCase().includes(currentDistrict.toLowerCase())) {
        searchQuery = `${query}, ${currentDistrict}, Kerala`;
      }

      const response = await axiosInstance.get(`/geo/search?q=${encodeURIComponent(searchQuery)}`);

      const searchResults = (response.data?.data as GeoSearchResult[]) || [];
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search unavailable';
      setError(errorMsg);
      setResults([]);
      console.warn('Place search error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(value);
    }, 600);
  };

  const handleSelectPlace = (place: GeoSearchResult) => {
    setInput(place.displayName);
    setFieldValue(fieldName, place.city || place.displayName);

    // Auto-fill district if it matches KERALA_DISTRICTS (best-effort fuzzy match)
    if (place.district) {
      const KERALA_DISTRICTS = [
        'Alappuzha',
        'Ernakulam',
        'Idukki',
        'Kannur',
        'Kasaragod',
        'Kollam',
        'Kottayam',
        'Kozhikode',
        'Malappuram',
        'Palakkad',
        'Pathanamthitta',
        'Thiruvananthapuram',
        'Thrissur',
        'Wayanad',
      ];

      const normalizedDistrict = place.district.toLowerCase();
      const matched = KERALA_DISTRICTS.find((d) => d.toLowerCase() === normalizedDistrict);
      if (matched) {
        setFieldValue('district', matched);
      }
    }

    // Auto-fill pincode if available
    if (place.postcode) {
      setFieldValue('pincode', place.postcode);
    }

    // Set coordinates for geospatial search (Feature 3)
    setFieldValue('coordinates', { lat: place.lat, lng: place.lng });

    setResults([]);
    setIsOpen(false);

    if (onPlaceSelected) {
      onPlaceSelected(place);
    }
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
    setIsOpen(false);
    setError(null);
    setFieldValue(fieldName, '');
    setFieldValue('coordinates', null);
  };

  const hasCoordinates = !!(
    values.coordinates &&
    typeof values.coordinates === 'object' &&
    'lat' in values.coordinates
  );

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={() => input.length >= 2 && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-[var(--bg-primary)] border border-[var(--bg-grey)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--bg-green)] focus:border-transparent transition-all outline-none"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg-grey)] border-t-[var(--bg-green)]" />
            </div>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

          {isOpen && results.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {results.map((result, index) => (
                <button
                  key={`${result.lng}-${result.lat}-${index}`}
                  onClick={() => handleSelectPlace(result)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[var(--bg-grey)]/30 border-b border-[var(--bg-grey)] last:border-b-0 transition-colors"
                >
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {result.displayName}
                  </div>
                  {(result.city || result.district || result.postcode) && (
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {[result.city, result.district, result.postcode].filter(Boolean).join(', ')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {input && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear search"
            className="px-4 py-3 rounded-xl border border-[var(--bg-grey)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-grey)]/30 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {hasCoordinates && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <span>✓ Location set</span>
          {typeof values.coordinates === 'object' &&
            values.coordinates !== null &&
            'lat' in values.coordinates &&
            'lng' in values.coordinates && (
              <span className="text-xs text-gray-500">
                ({Number((values.coordinates as { lat: number }).lat).toFixed(4)},{' '}
                {Number((values.coordinates as { lng: number }).lng).toFixed(4)})
              </span>
            )}
        </div>
      )}
    </div>
  );
}
